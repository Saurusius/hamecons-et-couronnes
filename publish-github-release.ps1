param(
  [string]$Owner = "Saurusius",
  [string]$Repository = "hamecons-et-couronnes",
  [string]$Version = "1.0.0",
  [switch]$PrivateRepository,
  [switch]$ReplaceExistingRelease
)

$ErrorActionPreference = "Stop"
$Root = (Resolve-Path (Split-Path -Parent $MyInvocation.MyCommand.Path)).Path
$Tag = "v$Version"
$AssetName = "hamecons-et-couronnes-v$Version.zip"
$ReleaseDir = Join-Path $Root ".release"
$StageDir = Join-Path $ReleaseDir "stage"
$ZipPath = Join-Path $ReleaseDir $AssetName
$ManifestPath = Join-Path $Root "module.json"
$NotesPath = Join-Path $Root "RELEASE_NOTES_v$Version.md"
$RepoUrl = "https://github.com/$Owner/$Repository"
$ManifestUrl = "https://raw.githubusercontent.com/$Owner/$Repository/main/module.json"
$DownloadUrl = "$RepoUrl/releases/download/$Tag/$AssetName"

function Write-Utf8NoBom([string]$Path, [string]$Text) {
  $Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Text, $Utf8NoBom)
}

function Require-Command([string]$Name, [string]$InstallHint) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "Commande '$Name' introuvable. $InstallHint"
  }
}

Write-Host ""
Write-Host "=== Publication Hameçons & Couronnes $Tag ===" -ForegroundColor Cyan
Write-Host ""

Require-Command "git" "Installez Git pour Windows, puis relancez PowerShell."
Require-Command "gh" "Installez GitHub CLI avec : winget install --id GitHub.cli"

& gh auth status 1>$null 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Connexion à GitHub requise..." -ForegroundColor Yellow
  & gh auth login --web --git-protocol https
  if ($LASTEXITCODE -ne 0) { throw "Connexion GitHub annulée ou échouée." }
}

if (-not (Test-Path -LiteralPath $ManifestPath)) { throw "module.json introuvable : $ManifestPath" }
if (-not (Test-Path -LiteralPath $NotesPath)) { throw "Notes de release introuvables : $NotesPath" }

$Manifest = Get-Content -LiteralPath $ManifestPath -Raw | ConvertFrom-Json
if ($Manifest.id -ne "light-fishing-minigame") { throw "Identifiant de module inattendu : $($Manifest.id)" }

$Manifest.version = $Version
$Manifest.url = $RepoUrl
$Manifest.manifest = $ManifestUrl
$Manifest.download = $DownloadUrl
$Manifest.readme = "$RepoUrl/blob/main/README.md"
$Manifest.bugs = "$RepoUrl/issues"
$Manifest.changelog = "$RepoUrl/releases/tag/$Tag"
$Manifest.license = "LICENSE"
$ManifestJson = $Manifest | ConvertTo-Json -Depth 20
Write-Utf8NoBom -Path $ManifestPath -Text ($ManifestJson + [Environment]::NewLine)

$InstallScript = Join-Path $Root "install-local.ps1"
if (Test-Path -LiteralPath $InstallScript) {
  $InstallText = Get-Content -LiteralPath $InstallScript -Raw
  $InstallText = $InstallText -replace '\$ExpectedVersion\s*=\s*"[^"]+"', "`$ExpectedVersion = `"$Version`""
  Write-Utf8NoBom -Path $InstallScript -Text $InstallText
}

$FishCount = @(Get-ChildItem -LiteralPath (Join-Path $Root "assets\fish") -Filter "*.webp" -File).Count
$PreviewCount = @(Get-ChildItem -LiteralPath (Join-Path $Root "assets\fish-preview") -Filter "*.webp" -File).Count
$BiomeCount = @(Get-ChildItem -LiteralPath (Join-Path $Root "assets\biomes") -Filter "*.webp" -File).Count
if ($FishCount -ne 144 -or $PreviewCount -ne 144 -or $BiomeCount -ne 36) {
  throw "Assets incomplets : poissons $FishCount/144, miniatures $PreviewCount/144, biomes $BiomeCount/36."
}

if (Test-Path -LiteralPath $ReleaseDir) { Remove-Item -LiteralPath $ReleaseDir -Recurse -Force }
New-Item -ItemType Directory -Force -Path $StageDir | Out-Null

$Excluded = @(".git", ".release", "publish-github-release.ps1")
Get-ChildItem -LiteralPath $Root -Force | Where-Object { $Excluded -notcontains $_.Name } | ForEach-Object {
  Copy-Item -LiteralPath $_.FullName -Destination $StageDir -Recurse -Force
}

Compress-Archive -Path (Join-Path $StageDir "*") -DestinationPath $ZipPath -CompressionLevel Optimal -Force

$TestDir = Join-Path $ReleaseDir "test"
Expand-Archive -LiteralPath $ZipPath -DestinationPath $TestDir -Force
$PackedManifest = Join-Path $TestDir "module.json"
if (-not (Test-Path -LiteralPath $PackedManifest)) { throw "ZIP invalide : module.json n’est pas à la racine." }
$Packed = Get-Content -LiteralPath $PackedManifest -Raw | ConvertFrom-Json
if ($Packed.version -ne $Version -or $Packed.download -ne $DownloadUrl) {
  throw "ZIP invalide : le manifeste empaqueté ne correspond pas à $Tag."
}
Remove-Item -LiteralPath $TestDir -Recurse -Force

Push-Location $Root
try {
  if (-not (Test-Path -LiteralPath (Join-Path $Root ".git"))) {
    & git init
    if ($LASTEXITCODE -ne 0) { throw "git init a échoué." }
  }

  & git branch -M main
  & git add --all
  & git diff --cached --quiet
  if ($LASTEXITCODE -ne 0) {
    & git commit -m "Release $Tag"
    if ($LASTEXITCODE -ne 0) { throw "Le commit Git a échoué. Vérifiez votre nom et votre e-mail Git." }
  }

  & gh repo view "$Owner/$Repository" 1>$null 2>$null
  $RepoExists = ($LASTEXITCODE -eq 0)

  if (-not $RepoExists) {
    $Visibility = if ($PrivateRepository) { "--private" } else { "--public" }
    Write-Host "Création du dépôt $Owner/$Repository..." -ForegroundColor Yellow
    & gh repo create "$Owner/$Repository" $Visibility --source $Root --remote origin
    if ($LASTEXITCODE -ne 0) { throw "La création du dépôt GitHub a échoué." }
  }
  else {
    & git remote get-url origin 1>$null 2>$null
    if ($LASTEXITCODE -ne 0) {
      & git remote add origin "https://github.com/$Owner/$Repository.git"
    }
    else {
      & git remote set-url origin "https://github.com/$Owner/$Repository.git"
    }
  }

  & git push -u origin main
  if ($LASTEXITCODE -ne 0) { throw "Le push de la branche main a échoué." }

  & gh release view $Tag --repo "$Owner/$Repository" 1>$null 2>$null
  $ReleaseExists = ($LASTEXITCODE -eq 0)
  if ($ReleaseExists) {
    if (-not $ReplaceExistingRelease) {
      throw "La release $Tag existe déjà. Relancez avec -ReplaceExistingRelease pour la remplacer."
    }
    Write-Host "Suppression de l’ancienne release $Tag..." -ForegroundColor Yellow
    & gh release delete $Tag --repo "$Owner/$Repository" --yes --cleanup-tag
  }

  & git tag -d $Tag 1>$null 2>$null
  & git push origin ":refs/tags/$Tag" 1>$null 2>$null
  & git tag -a $Tag -m "Hameçons & Couronnes $Tag"
  & git push origin $Tag
  if ($LASTEXITCODE -ne 0) { throw "La publication du tag $Tag a échoué." }

  Write-Host "Création de la release GitHub..." -ForegroundColor Yellow
  & gh release create $Tag $ZipPath $ManifestPath --repo "$Owner/$Repository" --title "Hameçons & Couronnes $Tag" --notes-file $NotesPath --latest
  if ($LASTEXITCODE -ne 0) { throw "La création de la release GitHub a échoué." }
}
finally {
  Pop-Location
}

Write-Host ""
Write-Host "Publication réussie !" -ForegroundColor Green
Write-Host "Dépôt     : $RepoUrl" -ForegroundColor Cyan
Write-Host "Release   : $RepoUrl/releases/tag/$Tag" -ForegroundColor Cyan
Write-Host "Manifest  : $ManifestUrl" -ForegroundColor Cyan
Write-Host "Téléchargement : $DownloadUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pour The Forge, collez cette URL dans le Creator Dashboard :" -ForegroundColor Yellow
Write-Host $ManifestUrl -ForegroundColor White
