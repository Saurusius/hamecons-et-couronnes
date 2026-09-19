param(
  [string]$FoundryDataPath = "$env:LOCALAPPDATA\FoundryVTT\Data"
)

$ErrorActionPreference = "Stop"
$ModuleId = "light-fishing-minigame"
$ExpectedVersion = "1.1.2-dev"
$Source = (Resolve-Path (Split-Path -Parent $MyInvocation.MyCommand.Path)).Path
$ModulesPath = Join-Path $FoundryDataPath "modules"
$Target = Join-Path $ModulesPath $ModuleId
$BackupRoot = Join-Path $FoundryDataPath "module-backups"
$Backup = $null

Write-Host ""
Write-Host "=== Hameçons & Couronnes v$ExpectedVersion ===" -ForegroundColor Cyan
Write-Host ""

$FoundryProcess = Get-Process -ErrorAction SilentlyContinue | Where-Object {
  $_.ProcessName -match "Foundry|FoundryVTT" -or $_.MainWindowTitle -match "Foundry Virtual Tabletop"
} | Select-Object -First 1

if ($FoundryProcess) {
  throw "Foundry VTT semble encore ouvert. Fermez-le complètement avant l’installation."
}

if (-not (Test-Path -LiteralPath $FoundryDataPath)) {
  throw "Dossier Data de Foundry introuvable : $FoundryDataPath`nRelancez avec : .\install-local.ps1 -FoundryDataPath 'D:\Votre\Foundry\Data'"
}

$SourceManifestPath = Join-Path $Source "module.json"
if (-not (Test-Path -LiteralPath $SourceManifestPath)) {
  throw "Le fichier module.json est introuvable à côté du script."
}

$SourceManifest = Get-Content -LiteralPath $SourceManifestPath -Raw | ConvertFrom-Json
if ($SourceManifest.id -ne $ModuleId) {
  throw "Identifiant inattendu : '$($SourceManifest.id)' au lieu de '$ModuleId'."
}
if ($SourceManifest.version -ne $ExpectedVersion) {
  throw "Version inattendue : '$($SourceManifest.version)' au lieu de '$ExpectedVersion'."
}

New-Item -ItemType Directory -Force -Path $ModulesPath | Out-Null
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null

$ResolvedTarget = [System.IO.Path]::GetFullPath($Target).TrimEnd('\')
$ResolvedSource = [System.IO.Path]::GetFullPath($Source).TrimEnd('\')
if ($ResolvedTarget -ieq $ResolvedSource) {
  throw "Le script est déjà exécuté depuis le dossier d’installation Foundry. Aucune copie n’est nécessaire."
}

try {
  if (Test-Path -LiteralPath $Target) {
    $Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $Backup = Join-Path $BackupRoot "$ModuleId-$Timestamp"
    Write-Host "Sauvegarde de la version installée..." -ForegroundColor Yellow
    Move-Item -LiteralPath $Target -Destination $Backup
  }

  Write-Host "Copie du module..." -ForegroundColor Yellow
  New-Item -ItemType Directory -Force -Path $Target | Out-Null
  Get-ChildItem -LiteralPath $Source -Force | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $Target -Recurse -Force
  }

  $InstalledManifestPath = Join-Path $Target "module.json"
  $InstalledManifest = Get-Content -LiteralPath $InstalledManifestPath -Raw | ConvertFrom-Json
  if ($InstalledManifest.id -ne $ModuleId -or $InstalledManifest.version -ne $ExpectedVersion) {
    throw "La validation du manifeste installé a échoué."
  }

  $FishCount = @(Get-ChildItem -LiteralPath (Join-Path $Target "assets\fish") -Filter "*.webp" -File).Count
  $PreviewCount = @(Get-ChildItem -LiteralPath (Join-Path $Target "assets\fish-preview") -Filter "*.webp" -File).Count
  $BiomeCount = @(Get-ChildItem -LiteralPath (Join-Path $Target "assets\biomes") -Filter "*.webp" -File).Count
  $UnknownFishPlaceholder = Join-Path $Target "assets\ui\poisson-inconnu.webp"
  if ($FishCount -ne 144 -or $PreviewCount -ne 144 -or $BiomeCount -ne 36 -or -not (Test-Path -LiteralPath $UnknownFishPlaceholder)) {
    throw "Assets incomplets : poissons $FishCount/144, miniatures $PreviewCount/144, régions $BiomeCount/36, placeholder inconnu $(Test-Path -LiteralPath $UnknownFishPlaceholder)."
  }

  Write-Host ""
  Write-Host "Installation réussie !" -ForegroundColor Green
  Write-Host "Dossier : $Target" -ForegroundColor Cyan
  Write-Host "Assets : $FishCount poissons, $PreviewCount miniatures, $BiomeCount régions" -ForegroundColor DarkGray
  if ($Backup) { Write-Host "Sauvegarde : $Backup" -ForegroundColor DarkGray }
  Write-Host "Relancez Foundry puis activez Hameçons & Couronnes." -ForegroundColor Yellow
}
catch {
  Write-Host "Installation interrompue : $($_.Exception.Message)" -ForegroundColor Red
  if (Test-Path -LiteralPath $Target) {
    Remove-Item -LiteralPath $Target -Recurse -Force -ErrorAction SilentlyContinue
  }
  if ($Backup -and (Test-Path -LiteralPath $Backup)) {
    Write-Host "Restauration de l’ancienne version..." -ForegroundColor Yellow
    Move-Item -LiteralPath $Backup -Destination $Target
  }
  throw
}
