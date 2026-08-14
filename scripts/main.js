import {
  ZONES,
  HABITATS,
  POISSONS,
  POISSON_IMAGE_BY_ID,
  POISSONS_PAR_ID,
  POISSONS_PAR_ZONE,
  POISSONS_ORDINAIRES_PAR_ZONE,
  BOSS_PAR_ZONE,
  RARETES,
  PERIODES
} from "./fish-data.js";

const MODULE_ID = "light-fishing-minigame";
const PROFILE_FLAG = "profilPeche";
const VALID_FISH_IDS = new Set(POISSONS.map((fish) => fish.id));

const PROFILS_DIFFICULTE = Object.freeze({
  1: { zoneHeight: 0.35, fishAcceleration: 1.00, fishMaxSpeed: 0.42, fishDrag: 0.906, targetMin: 0.92, targetMax: 1.70, wobble: 0.014, gravity: 0.50, holdLift: 0.97, tapImpulse: 0.17, gain: 0.37, loss: 0.13, label: "Paisible" },
  2: { zoneHeight: 0.29, fishAcceleration: 1.24, fishMaxSpeed: 0.56, fishDrag: 0.914, targetMin: 0.70, targetMax: 1.38, wobble: 0.020, gravity: 0.57, holdLift: 1.03, tapImpulse: 0.18, gain: 0.33, loss: 0.17, label: "Remuant" },
  3: { zoneHeight: 0.24, fishAcceleration: 1.56, fishMaxSpeed: 0.71, fishDrag: 0.922, targetMin: 0.50, targetMax: 1.12, wobble: 0.028, gravity: 0.63, holdLift: 1.11, tapImpulse: 0.19, gain: 0.29, loss: 0.22, label: "Sportif" },
  4: { zoneHeight: 0.21, fishAcceleration: 1.92, fishMaxSpeed: 0.88, fishDrag: 0.929, targetMin: 0.34, targetMax: 0.90, wobble: 0.036, gravity: 0.70, holdLift: 1.18, tapImpulse: 0.20, gain: 0.26, loss: 0.29, label: "Féroce" },
  5: { zoneHeight: 0.18, fishAcceleration: 2.20, fishMaxSpeed: 1.03, fishDrag: 0.935, targetMin: 0.24, targetMax: 0.72, wobble: 0.044, gravity: 0.77, holdLift: 1.26, tapImpulse: 0.215, gain: 0.23, loss: 0.34, label: "Légendaire" }
});

const TALENT_COSTS = Object.freeze({
  standard: [200, 500, 1000, 1800, 3000],
  compact: [300, 800, 1600, 2600],
  short: [400, 1100, 2200],
  capstone: [3500]
});

const TALENT_TREES = Object.freeze([
  {
    id: "moulinet",
    name: "Maîtrise du moulinet",
    icon: "fa-fishing-rod",
    accent: "control",
    summary: "Contrôle, stabilité et marge d’erreur.",
    talents: [
      { id: "poigne-assuree", name: "Poigne assurée", icon: "fa-hand-fist", maxRank: 5, costs: TALENT_COSTS.standard, position: "root", description: "Agrandit sensiblement la zone de capture.", effect: (rank) => `Zone de capture : +${rank * 4}%` },
      { id: "fil-renforce", name: "Fil renforcé", icon: "fa-link", maxRank: 5, costs: TALENT_COSTS.standard, position: "left", requires: { id: "poigne-assuree", rank: 2 }, description: "Réduit nettement la perte de progression lorsque le poisson sort de la zone.", effect: (rank) => `Perte de capture : −${rank * 6}%` },
      { id: "moulinet-precision", name: "Moulinet de précision", icon: "fa-crosshairs", maxRank: 4, costs: TALENT_COSTS.compact, position: "right", requires: { id: "poigne-assuree", rank: 2 }, description: "Améliore la réactivité du moulinet sans supprimer son inertie.", effect: (rank) => `Réactivité du moulinet : +${rank * 4}%` },
      { id: "second-souffle", name: "Second souffle", icon: "fa-heart-pulse", maxRank: 3, costs: TALENT_COSTS.short, position: "mid", branchRequired: 6, description: "Commence chaque prise avec davantage de progression déjà acquise.", effect: (rank) => `Progression initiale : +${rank * 5}%` },
      { id: "main-du-maitre", name: "Main du maître", icon: "fa-hand-sparkles", maxRank: 1, costs: TALENT_COSTS.capstone, position: "capstone", branchRequired: 12, requires: { id: "second-souffle", rank: 3 }, description: "Après 1,3 seconde de maintien continu, la capture progresse beaucoup plus vite.", effect: () => "Concentration : +18% de gain après 1,3 s" }
    ]
  },
  {
    id: "instinct",
    name: "Instinct du pêcheur",
    icon: "fa-eye",
    accent: "instinct",
    summary: "Lecture des mouvements et maîtrise des poissons agressifs.",
    talents: [
      { id: "lecture-remous", name: "Lecture des remous", icon: "fa-water", maxRank: 5, costs: TALENT_COSTS.standard, position: "root", description: "Espace davantage les changements de direction du poisson.", effect: (rank) => `Durée des trajectoires : +${rank * 5}%` },
      { id: "calme-profondeurs", name: "Calme des profondeurs", icon: "fa-feather", maxRank: 5, costs: TALENT_COSTS.standard, position: "left", requires: { id: "lecture-remous", rank: 2 }, description: "Réduit sensiblement l’accélération et la vitesse maximale des poissons.", effect: (rank) => `Vitesse et accélération : −${rank * 4}%` },
      { id: "oeil-exerce", name: "Œil exercé", icon: "fa-binoculars", maxRank: 3, costs: TALENT_COSTS.short, position: "right", requires: { id: "lecture-remous", rank: 2 }, description: "Diminue fortement la fréquence des accélérations soudaines et des feintes.", effect: (rank) => `Mouvements brusques : −${rank * 15}%` },
      { id: "traqueur-profondeurs", name: "Traqueur des profondeurs", icon: "fa-bullseye", maxRank: 4, costs: TALENT_COSTS.compact, position: "mid", branchRequired: 6, description: "Augmente le gain de capture lorsque le poisson est correctement suivi.", effect: (rank) => `Gain de capture : +${rank * 4}%` },
      { id: "prediction-parfaite", name: "Prédiction parfaite", icon: "fa-shield-halved", maxRank: 1, costs: TALENT_COSTS.capstone, position: "capstone", branchRequired: 12, requires: { id: "traqueur-profondeurs", rank: 4 }, description: "Neutralise le premier mouvement brutal de chaque prise.", effect: () => "1 mouvement brutal annulé par prise" }
    ]
  },
  {
    id: "fortune",
    name: "Fortune des Couronnes",
    icon: "fa-crown",
    accent: "fortune",
    summary: "Récompenses, rareté et séries de captures.",
    talents: [
      { id: "prise-rentable", name: "Prise rentable", icon: "fa-coins", maxRank: 5, costs: TALENT_COSTS.standard, position: "root", description: "Augmente visiblement le score et les points de maîtrise gagnés.", effect: (rank) => `Récompenses : +${rank * 5}%` },
      { id: "appats-qualite", name: "Appâts de qualité", icon: "fa-worm", maxRank: 5, costs: TALENT_COSTS.standard, position: "left", requires: { id: "prise-rentable", rank: 2 }, description: "Augmente progressivement les chances de rencontrer des poissons rares.", effect: (rank) => `Chance de rareté améliorée : rang ${rank}` },
      { id: "serie-royale", name: "Série royale", icon: "fa-fire-flame-curved", maxRank: 4, costs: TALENT_COSTS.compact, position: "right", requires: { id: "prise-rentable", rank: 2 }, description: "Chaque capture consécutive augmente davantage les récompenses, jusqu’à un plafond dépendant du rang.", effect: (rank) => `Série : +3% par prise, plafond ${rank * 4} prises` },
      { id: "trophees-royaume", name: "Trophées du royaume", icon: "fa-trophy", maxRank: 3, costs: TALENT_COSTS.short, position: "mid", branchRequired: 6, description: "Augmente fortement les récompenses obtenues contre les boss.", effect: (rank) => `Récompenses de boss : +${rank * 12}%` },
      { id: "peche-miraculeuse", name: "Pêche miraculeuse", icon: "fa-star", maxRank: 1, costs: TALENT_COSTS.capstone, position: "capstone", branchRequired: 12, requires: { id: "trophees-royaume", rank: 3 }, description: "Chaque capture a une petite chance de doubler toutes ses récompenses.", effect: () => "7% de chance de récompenses doublées" }
    ]
  }
]);

const TALENTS_BY_ID = new Map(TALENT_TREES.flatMap((tree) => tree.talents.map((talent) => [talent.id, { ...talent, treeId: tree.id, treeName: tree.name }])));


const BOSS_TROPHIES = Object.freeze([
  { id: "discipline-aldorie", zoneId: "rostland", name: "Discipline aldorie", icon: "fa-hand-fist", effect: "Réactivité du moulinet : +5%.", lore: "Le Patriarche vous a appris qu’un geste précis vaut mieux qu’un geste brutal." },
  { id: "patience-roseaux", zoneId: "ceinture-verte", name: "Patience des roseaux", icon: "fa-seedling", effect: "Après 1 s de suivi continu, la zone de capture s’élargit de 6%.", lore: "Les eaux de la Ceinture Verte récompensent ceux qui savent tenir leur position." },
  { id: "morsure-tuskwater", zoneId: "tuskwater", name: "Morsure du Tuskwater", icon: "fa-tooth", effect: "Gain de capture : +6% contre les poissons de difficulté 4–5 et les boss.", lore: "La Mâchoire vous a appris à ne jamais relâcher une prise difficile." },
  { id: "charge-brisee", zoneId: "kamelands", name: "Charge brisée", icon: "fa-shield-halved", effect: "Mouvements brusques : −8% supplémentaires.", lore: "Le Bélier frappe fort ; vous avez appris à voir venir l’impact." },
  { id: "racines-profondes", zoneId: "narlmarches", name: "Racines profondes", icon: "fa-tree", effect: "Sous 30% de progression, la perte de capture est réduite de 20%.", lore: "Comme les racines noyées, votre ligne refuse désormais de lâcher prise." },
  { id: "science-meandres", zoneId: "sellen-hills", name: "Science des méandres", icon: "fa-route", effect: "Durée des trajectoires du poisson : +8%.", lore: "Les Sept Méandres vous ont appris à lire un trajet avant même qu’il ne se termine." },
  { id: "poursuite-libre", zoneId: "dunsward", name: "Poursuite libre", icon: "fa-wind", effect: "Lorsque le poisson sort de la zone, le moulinet reçoit une légère assistance vers sa direction.", lore: "Le Coursier ne se laisse pas suivre : il faut apprendre à le poursuivre." },
  { id: "sang-froid-cimes", zoneId: "levenies", name: "Sang-froid des cimes", icon: "fa-mountain", effect: "Vitesse maximale des poissons de difficulté 5 : −5%.", lore: "Dans les eaux froides des Levenies, la précipitation est l’ennemie du pêcheur." },
  { id: "repit-passeur", zoneId: "hooktongue", name: "Répit du passeur", icon: "fa-anchor", effect: "Chaque prise commence avec 0,30 s de grâce supplémentaire, y compris les phases de boss.", lore: "Vous savez désormais profiter du bref instant où le monstre jauge encore sa proie." },
  { id: "palissade-brisee", zoneId: "drelev", name: "Palissade brisée", icon: "fa-shield", effect: "Zone de capture : +6% contre les boss.", lore: "Le Briseur vous a appris qu’une défense plus large vaut parfois mieux qu’une ligne plus dure." },
  { id: "instinct-tigre", zoneId: "tiger-lords", name: "Instinct du Tigre", icon: "fa-paw", effect: "Fréquence des feintes : −25%.", lore: "Le Tigre à Branchies vous a appris à distinguer une attaque d’une feinte." },
  { id: "couronne-champion", zoneId: "rushlight", name: "Couronne du champion", icon: "fa-medal", effect: "Récompenses : +8% contre les boss et poissons légendaires.", lore: "Une victoire digne de Rushlight mérite toujours une récompense à sa hauteur." },
  { id: "derniere-flaque", zoneId: "glenebon-lowlands", name: "Dernière flaque", icon: "fa-droplet", effect: "Au-dessus de 70% de progression, le gain de capture augmente de 10%.", lore: "Le Dévoreur vous a appris à terminer une lutte avant qu’elle ne puisse se retourner." },
  { id: "tempo-virtuose", zoneId: "pitax", name: "Tempo du virtuose", icon: "fa-music", effect: "Oscillations parasites du poisson : −25%.", lore: "Le Grand Virtuose vous a laissé le sens du rythme — même sous l’eau." },
  { id: "souffle-manticore", zoneId: "glenebon-uplands", name: "Souffle de la Manticore", icon: "fa-feather-pointed", effect: "Zone de capture : +4% contre les poissons de difficulté 4–5.", lore: "Vous avez appris à garder de la marge face aux créatures les plus imprévisibles." },
  { id: "anomalie-adaptative", zoneId: "numeria", name: "Anomalie adaptative", icon: "fa-atom", effect: "8% de chance d’annuler chaque accélération ou feinte brutale.", lore: "Quelque chose dans l’Anomalie a changé votre manière de réagir aux mouvements impossibles." },
  { id: "murmure-eaux", zoneId: "thousand-voices", name: "Murmure des eaux", icon: "fa-comments", effect: "Dérives imprévues de la trajectoire : −30%.", lore: "À force d’écouter les Milles-Voix, certaines intentions du courant deviennent presque audibles." },
  { id: "volonte-leviathan", zoneId: "branthlend", name: "Volonté du Léviathan", icon: "fa-snowflake", effect: "Les combats de boss commencent chaque phase avec +5% de progression.", lore: "Le Léviathan du Pic Blanc vous a appris que survivre à une phase est déjà une victoire." }
]);

const BOSS_TROPHIES_BY_ID = new Map(BOSS_TROPHIES.map((trophy) => [trophy.id, trophy]));
const BOSS_TROPHIES_BY_ZONE = new Map(BOSS_TROPHIES.map((trophy) => [trophy.zoneId, trophy]));

function hasBossTrophy(profile, trophyOrZoneId) {
  const trophy = BOSS_TROPHIES_BY_ID.get(trophyOrZoneId) ?? BOSS_TROPHIES_BY_ZONE.get(trophyOrZoneId);
  if (!trophy) return false;
  const boss = BOSS_PAR_ZONE.get(trophy.zoneId);
  return Boolean(boss && profile?.especes?.[boss.id]);
}

function trophyCount(profile) {
  return BOSS_TROPHIES.reduce((sum, trophy) => sum + (hasBossTrophy(profile, trophy.id) ? 1 : 0), 0);
}

function trophyForFish(fish) {
  return fish?.boss ? BOSS_TROPHIES_BY_ZONE.get(fish.zoneId) ?? null : null;
}

function bossTrophyEffects(profile, fish) {
  const has = (zoneId) => hasBossTrophy(profile, zoneId);
  return {
    controlScale: has("rostland") ? 1.05 : 1,
    focusZoneBonus: has("ceinture-verte") ? 0.06 : 0,
    hardFishGainScale: has("tuskwater") && (fish?.boss || fish?.difficulte >= 4) ? 1.06 : 1,
    suddenReductionBonus: has("kamelands") ? 0.08 : 0,
    lowProgressLossScale: has("narlmarches") ? 0.80 : 1,
    targetDurationScale: has("sellen-hills") ? 1.08 : 1,
    pursuitAssist: has("dunsward") ? 0.18 : 0,
    legendarySpeedScale: has("levenies") && fish?.difficulte >= 5 ? 0.95 : 1,
    graceBonus: has("hooktongue") ? 0.30 : 0,
    bossZoneScale: has("drelev") && fish?.boss ? 1.06 : 1,
    feintScale: has("tiger-lords") ? 0.75 : 1,
    rewardBonus: has("rushlight") && (fish?.boss || fish?.rarete === "Légendaire") ? 0.08 : 0,
    finishingGainScale: has("glenebon-lowlands") ? 1.10 : 1,
    wobbleScale: has("pitax") ? 0.75 : 1,
    hardFishZoneScale: has("glenebon-uplands") && (fish?.boss || fish?.difficulte >= 4) ? 1.04 : 1,
    anomalyNullifyChance: has("numeria") ? 0.08 : 0,
    driftScale: has("thousand-voices") ? 0.70 : 1,
    bossPhaseStartBonus: has("branthlend") && fish?.boss ? 0.05 : 0
  };
}

let activeGame = null;
let audioContext = null;
let lastCatch = null;
let illustrationSerial = 0;
let launcherAbortController = null;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const randomBetween = (min, max) => min + Math.random() * (max - min);
const clone = (value) => globalThis.structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function tr(key, fallback) {
  try {
    const value = game.i18n.localize(key);
    return value && value !== key ? value : fallback;
  } catch (_error) {
    return fallback;
  }
}

function setting(key, fallback) {
  try {
    return game.settings.get(MODULE_ID, key);
  } catch (error) {
    console.warn(`${MODULE_ID} | Impossible de lire le réglage ${key}`, error);
    return fallback;
  }
}

function playTone(frequency = 440, duration = 0.08, type = "sine", volume = 0.035, delay = 0) {
  if (!setting("sound", true)) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  try {
    audioContext ??= new AudioCtx();
    const start = audioContext.currentTime + delay;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  } catch (error) {
    console.debug(`${MODULE_ID} | Son indisponible`, error);
  }
}

function currentNaturalPeriod() {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 19 ? "jour" : "nuit";
}

function initialPeriod() {
  const configured = setting("defaultPeriod", "auto");
  return configured === "jour" || configured === "nuit" ? configured : currentNaturalPeriod();
}

function zoneById(id) {
  return ZONES.find((zone) => zone.id === id) ?? ZONES[0];
}

function difficultyStars(level) {
  const safe = clamp(Number(level) || 1, 1, 5);
  return `<span class="lfg-stars" title="Difficulté ${safe} sur 5" aria-label="Difficulté ${safe} sur 5">${Array.from({ length: 5 }, (_, index) => `<i class="fas fa-star${index < safe ? "" : " lfg-star-empty"}"></i>`).join("")}</span>`;
}

function periodBadge(period) {
  const value = PERIODES[period] ?? PERIODES.toujours;
  return `<span class="lfg-period lfg-period-${period}"><i class="fas ${value.icon}"></i>${escapeHtml(value.nom)}</span>`;
}

function rarityClass(rarity) {
  return RARETES[rarity]?.classe ?? "commun";
}

function rarityBadge(rarity) {
  const icon = rarity === "Boss" ? "fa-crown" : "fa-gem";
  return `<span class="lfg-rarity lfg-rarity-${rarityClass(rarity)}"><i class="fas ${icon}"></i>${escapeHtml(rarity)}</span>`;
}

function defaultProfile() {
  return {
    version: 6,
    totalPrises: 0,
    poidsTotal: 0,
    score: 0,
    masteryEarned: 0,
    talents: {},
    currentStreak: 0,
    bestStreak: 0,
    capturesLegendaires: 0,
    bossesCaptures: 0,
    especes: {},
    plusGrosse: null,
    meilleurePrise: null,
    dernierePrise: null
  };
}

function talentRank(profile, talentId) {
  const talent = TALENTS_BY_ID.get(talentId);
  if (!talent) return 0;
  return clamp(Math.floor(Number(profile?.talents?.[talentId]) || 0), 0, talent.maxRank);
}

function talentCost(talent, rank) {
  return Math.max(0, Number(talent?.costs?.[rank]) || 0);
}

function masterySpent(profile) {
  let spent = 0;
  for (const [id, talent] of TALENTS_BY_ID) {
    const rank = talentRank(profile, id);
    for (let index = 0; index < rank; index += 1) spent += talentCost(talent, index);
  }
  return spent;
}

function masteryAvailable(profile) {
  return Math.max(0, Math.floor(Number(profile?.masteryEarned) || 0) - masterySpent(profile));
}

function branchRanks(profile, treeId) {
  const tree = TALENT_TREES.find((entry) => entry.id === treeId);
  return tree ? tree.talents.reduce((sum, talent) => sum + talentRank(profile, talent.id), 0) : 0;
}

function talentUnlocked(profile, talent) {
  if (!talent) return false;
  if (talent.branchRequired && branchRanks(profile, talent.treeId) < talent.branchRequired) return false;
  if (talent.requires && talentRank(profile, talent.requires.id) < talent.requires.rank) return false;
  return true;
}

function normalizeSpeciesRecords(rawSpecies) {
  const source = rawSpecies && typeof rawSpecies === "object" ? rawSpecies : {};
  const species = {};
  for (const [fishId, rawRecord] of Object.entries(source)) {
    if (!VALID_FISH_IDS.has(fishId) || !rawRecord || typeof rawRecord !== "object") continue;
    const nombre = Math.max(0, Math.floor(Number(rawRecord.nombre) || 0));
    const record = Math.max(0, Number(rawRecord.record) || 0);
    if (nombre <= 0 && record <= 0) continue;
    const premier = Math.max(0, Math.floor(Number(rawRecord.premier) || 0));
    const dernier = Math.max(premier, Math.floor(Number(rawRecord.dernier) || premier));
    species[fishId] = {
      nombre: Math.max(1, nombre),
      record: Math.round(record * 100) / 100,
      premier,
      dernier
    };
  }
  return species;
}

function normalizeStoredCatch(rawCatch) {
  if (!rawCatch || typeof rawCatch !== "object") return null;
  const fishId = VALID_FISH_IDS.has(rawCatch.fishId) ? rawCatch.fishId : null;
  const fish = fishId ? POISSONS_PAR_ID.get(fishId) : null;
  const weight = Number(rawCatch.weight);
  if (!Number.isFinite(weight) || weight < 0) return null;
  const score = Math.max(0, Math.floor(Number(rawCatch.score) || 0));
  const timestamp = Math.max(0, Math.floor(Number(rawCatch.timestamp) || 0));
  return {
    ...clone(rawCatch),
    fishId,
    name: String(rawCatch.name ?? fish?.nom ?? "Prise inconnue"),
    rarity: String(rawCatch.rarity ?? fish?.rarete ?? "Commun"),
    zoneId: String(rawCatch.zoneId ?? fish?.zoneId ?? ""),
    zone: String(rawCatch.zone ?? fish?.zone ?? "Zone inconnue"),
    difficulty: clamp(Math.floor(Number(rawCatch.difficulty ?? fish?.difficulte) || 1), 1, 5),
    period: rawCatch.period === "nuit" ? "nuit" : "jour",
    boss: Boolean(rawCatch.boss ?? fish?.boss),
    weight: Math.round(weight * 100) / 100,
    score,
    masteryGain: Math.max(0, Math.floor(Number(rawCatch.masteryGain) || score)),
    timestamp
  };
}

function normalizeProfile(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  const profile = { ...defaultProfile(), ...clone(source) };
  profile.especes = normalizeSpeciesRecords(source.especes);
  profile.talents = {};
  const sourceTalents = source.talents && typeof source.talents === "object" ? source.talents : {};
  for (const [id, talent] of TALENTS_BY_ID) {
    profile.talents[id] = clamp(Math.floor(Number(sourceTalents[id]) || 0), 0, talent.maxRank);
  }

  const capturedCount = Object.values(profile.especes).reduce((sum, record) => sum + record.nombre, 0);
  const capturedBosses = Object.keys(profile.especes).filter((id) => POISSONS_PAR_ID.get(id)?.boss).length;
  const legendaryCount = Object.entries(profile.especes).reduce((sum, [id, record]) => sum + (POISSONS_PAR_ID.get(id)?.rarete === "Légendaire" ? record.nombre : 0), 0);

  profile.totalPrises = Math.max(capturedCount, Math.floor(Number(source.totalPrises) || 0));
  profile.poidsTotal = Math.max(0, Math.round((Number(source.poidsTotal) || 0) * 100) / 100);
  profile.score = Math.max(0, Math.floor(Number(source.score) || 0));
  profile.capturesLegendaires = Math.max(legendaryCount, Math.floor(Number(source.capturesLegendaires) || 0));
  profile.bossesCaptures = Math.max(capturedBosses, Math.floor(Number(source.bossesCaptures) || 0));
  profile.currentStreak = Math.max(0, Math.floor(Number(source.currentStreak) || 0));
  profile.bestStreak = Math.max(profile.currentStreak, Math.floor(Number(source.bestStreak) || 0));
  // Migration 1.2.x : le score historique reste au classement et devient aussi
  // le capital initial de maîtrise. Aucun point déjà gagné n’est perdu.
  profile.masteryEarned = Math.max(0, Math.floor(Number(source.masteryEarned ?? profile.score) || 0), masterySpent(profile));
  profile.plusGrosse = normalizeStoredCatch(source.plusGrosse);
  profile.meilleurePrise = normalizeStoredCatch(source.meilleurePrise);
  profile.dernierePrise = normalizeStoredCatch(source.dernierePrise);
  profile.version = 6;
  return profile;
}

function getProfile(user = game.user) {
  if (!user) return defaultProfile();
  return normalizeProfile(user.getFlag(MODULE_ID, PROFILE_FLAG));
}

async function saveProfile(user, profile) {
  if (!user) throw new Error("Profil utilisateur introuvable.");
  const normalized = normalizeProfile(profile);
  await user.setFlag(MODULE_ID, PROFILE_FLAG, normalized);
  return normalized;
}

async function resetProfile(user) {
  if (!user) throw new Error("Profil utilisateur introuvable.");
  if (!user.canUserModify(game.user, "update")) {
    throw new Error(`Permissions insuffisantes pour modifier le profil de ${user.name}.`);
  }

  // Foundry v14 exposes unsetFlag explicitly. The setFlag(null) fallback keeps
  // compatibility with older compatible document implementations.
  const updated = typeof user.unsetFlag === "function"
    ? await user.unsetFlag(MODULE_ID, PROFILE_FLAG)
    : await user.setFlag(MODULE_ID, PROFILE_FLAG, null);
  const remaining = updated?.getFlag?.(MODULE_ID, PROFILE_FLAG) ?? user.getFlag(MODULE_ID, PROFILE_FLAG);
  if (remaining !== undefined && remaining !== null) {
    throw new Error(`La suppression du profil de ${user.name} n’a pas été confirmée par Foundry.`);
  }
  return defaultProfile();
}

async function confirmResetDialog({ title, content, confirmLabel = "Confirmer", cancelLabel = "Annuler", danger = false }) {
  if (activeGame?.showInternalConfirm) {
    return Boolean(await activeGame.showInternalConfirm({ title, content, confirmLabel, cancelLabel, danger }));
  }

  if (globalThis.Dialog?.confirm) {
    return Boolean(await globalThis.Dialog.confirm({
      title,
      content,
      yes: () => true,
      no: () => false,
      defaultYes: false
    }));
  }

  const DialogV2 = globalThis.foundry?.applications?.api?.DialogV2;
  if (DialogV2?.confirm) {
    return Boolean(await DialogV2.confirm({ window: { title }, content }));
  }

  return globalThis.confirm ? globalThis.confirm(content.replace(/<[^>]+>/g, " ")) : false;
}

function discoveredCurrentIds(profile) {
  return Object.keys(profile.especes ?? {}).filter((id) => VALID_FISH_IDS.has(id));
}

function zoneProgress(profile, zoneId) {
  const regular = POISSONS_ORDINAIRES_PAR_ZONE.get(zoneId) ?? [];
  const discovered = regular.filter((fish) => Boolean(profile.especes?.[fish.id])).length;
  const required = Math.ceil(regular.length / 2);
  const boss = BOSS_PAR_ZONE.get(zoneId);
  return {
    discovered,
    total: regular.length,
    required,
    complete: regular.length > 0 && discovered >= regular.length,
    halfComplete: discovered >= required,
    bossCaught: Boolean(boss && profile.especes?.[boss.id]),
    boss
  };
}

function isZoneUnlocked(profile, zoneIndex) {
  if (zoneIndex <= 0) return true;
  const previous = ZONES[zoneIndex - 1];
  return zoneProgress(profile, previous.id).halfComplete;
}

function unlockedZoneCount(profile) {
  return ZONES.filter((zone) => isZoneUnlocked(profile, zone.index)).length;
}

function profileSummary(profile) {
  const unique = discoveredCurrentIds(profile).length;
  const bosses = ZONES.filter((zone) => zoneProgress(profile, zone.id).bossCaught).length;
  return {
    total: profile.totalPrises,
    unique,
    completion: Math.round((unique / POISSONS.length) * 100),
    score: profile.score,
    mastery: masteryAvailable(profile),
    masterySpent: masterySpent(profile),
    talents: Object.values(profile.talents ?? {}).reduce((sum, rank) => sum + (Number(rank) || 0), 0),
    poids: profile.poidsTotal,
    record: profile.plusGrosse,
    bosses,
    trophies: trophyCount(profile),
    zones: unlockedZoneCount(profile)
  };
}

function catchScore(fish, weight) {
  const rarity = RARETES[fish.rarete];
  const zoneBonus = 1 + fish.zoneIndex * 0.08;
  const bossBonus = fish.boss ? 2.2 : 1;
  return Math.max(1, Math.round((rarity.points * (1 + (fish.difficulte - 1) * 0.24) + weight * 3.5) * zoneBonus * bossBonus));
}

async function recordCatch(result) {
  const profile = normalizeProfile(getProfile());
  const previousSpecies = profile.especes[result.fishId];
  result.isNew = !previousSpecies;
  const unlockedTrophy = result.boss ? trophyForFish(POISSONS_PAR_ID.get(result.fishId)) : null;
  result.trophyUnlocked = Boolean(unlockedTrophy && !previousSpecies);
  result.trophyId = unlockedTrophy?.id ?? null;
  const species = previousSpecies
    ? { ...previousSpecies }
    : { nombre: 0, record: 0, premier: result.timestamp, dernier: result.timestamp };
  species.nombre += 1;
  species.record = Math.max(Number(species.record) || 0, result.weight);
  species.dernier = result.timestamp;
  profile.especes[result.fishId] = species;
  profile.totalPrises += 1;
  profile.poidsTotal = Math.round((profile.poidsTotal + result.weight) * 100) / 100;
  profile.score += result.score;
  profile.masteryEarned += result.masteryGain;
  profile.currentStreak += 1;
  profile.bestStreak = Math.max(profile.bestStreak, profile.currentStreak);
  if (result.rarity === "Légendaire") profile.capturesLegendaires += 1;
  if (result.boss && species.nombre === 1) profile.bossesCaptures += 1;
  profile.dernierePrise = { ...result };
  profile.version = 6;

  if (!profile.plusGrosse || result.weight > profile.plusGrosse.weight) profile.plusGrosse = { ...result };
  if (!profile.meilleurePrise || result.score > profile.meilleurePrise.score) profile.meilleurePrise = { ...result };

  return saveProfile(game.user, profile);
}

function weightedFish(zoneId, period, profile) {
  const progress = zoneProgress(profile, zoneId);
  if (progress.complete && !progress.bossCaught && progress.boss && (progress.boss.periode === period || progress.boss.periode === "toujours")) return progress.boss;

  const baitRank = talentRank(profile, "appats-qualite");
  const regular = (POISSONS_ORDINAIRES_PAR_ZONE.get(zoneId) ?? []).filter((fish) => fish.periode === "toujours" || fish.periode === period);
  const entries = regular.map((fish) => {
    const rarity = RARETES[fish.rarete] ?? { poids: 1, ordre: 1 };
    const rarityLift = 1 + Math.max(0, rarity.ordre - 1) * baitRank * 0.12;
    const commonReduction = rarity.ordre === 1 ? Math.max(0.58, 1 - baitRank * 0.07) : 1;
    return { fish, weight: Math.max(0.01, rarity.poids * rarityLift * commonReduction) };
  });
  if (progress.bossCaught && progress.boss && (progress.boss.periode === period || progress.boss.periode === "toujours")) {
    entries.push({ fish: progress.boss, weight: 0.22 });
  }
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * total;
  for (const entry of entries) {
    roll -= entry.weight;
    if (roll <= 0) return entry.fish;
  }
  return entries[0]?.fish ?? POISSONS_PAR_ZONE.get(zoneId)?.[0] ?? POISSONS[0];
}

function rollCatch(fish, period, profile) {
  const weight = Math.round(randomBetween(fish.min, fish.max) * 100) / 100;
  const baseScore = catchScore(fish, weight);
  const profitableRank = talentRank(profile, "prise-rentable");
  const streakRank = talentRank(profile, "serie-royale");
  const trophyRank = talentRank(profile, "trophees-royaume");
  const streakCount = Math.min(profile.currentStreak, streakRank * 4);
  const trophyEffects = bossTrophyEffects(profile, fish);
  const multiplier = 1 + profitableRank * 0.05 + streakCount * 0.03 + (fish.boss ? trophyRank * 0.12 : 0) + trophyEffects.rewardBonus;
  const miracle = talentRank(profile, "peche-miraculeuse") > 0 && Math.random() < 0.07;
  const score = Math.max(1, Math.round(baseScore * multiplier * (miracle ? 2 : 1)));
  return {
    fishId: fish.id,
    name: fish.nom,
    rarity: fish.rarete,
    zoneId: fish.zoneId,
    zone: fish.zone,
    habitatId: fish.zoneId,
    habitat: fish.zone,
    difficulty: fish.difficulte,
    period,
    boss: Boolean(fish.boss),
    weight,
    baseScore,
    score,
    masteryGain: score,
    rewardMultiplier: multiplier,
    miracle,
    streakBonus: streakCount,
    userId: game.user.id,
    userName: game.user.name,
    timestamp: Date.now()
  };
}

function gameConfigFor(fish, bossPhase = 0, profile = getProfile()) {
  const base = PROFILS_DIFFICULTE[fish.difficulte] ?? PROFILS_DIFFICULTE[3];
  const trophy = bossTrophyEffects(profile, fish);
  const regularZoneScale = 1 + fish.zoneIndex * 0.022;
  const regularSpeedZoneScale = 1 + fish.zoneIndex * 0.014;
  const bossZoneScale = 1 + fish.zoneIndex * 0.010;
  const bossSpeedZoneScale = 1 + fish.zoneIndex * 0.007;
  const accelerationZoneScale = fish.boss ? bossZoneScale : regularZoneScale;
  const maxSpeedZoneScale = fish.boss ? bossSpeedZoneScale : regularSpeedZoneScale;
  const phaseScale = fish.boss ? [1.00, 1.07, 1.15][bossPhase] ?? 1.15 : 1;
  const gripRank = talentRank(profile, "poigne-assuree");
  const lineRank = talentRank(profile, "fil-renforce");
  const precisionRank = talentRank(profile, "moulinet-precision");
  const readingRank = talentRank(profile, "lecture-remous");
  const calmRank = talentRank(profile, "calme-profondeurs");
  const trackerRank = talentRank(profile, "traqueur-profondeurs");
  const speedScale = Math.max(0.72, 1 - calmRank * 0.04);
  const zoneDifficultyFloor = fish.boss ? 0.145 : 0.135;
  const rawZoneHeight = Math.max(zoneDifficultyFloor, base.zoneHeight - fish.zoneIndex * 0.0025 - (fish.boss ? bossPhase * 0.008 : 0));
  const rawBossMaxSpeed = base.fishMaxSpeed * maxSpeedZoneScale * phaseScale;
  const bossCappedSpeed = fish.boss ? Math.min(1.18, rawBossMaxSpeed) : rawBossMaxSpeed;
  const gain = fish.boss
    ? base.gain * 0.60 / (1 + fish.zoneIndex * 0.009) / 1.05
    : base.gain * 0.50 / (1 + fish.zoneIndex * 0.009);
  const loss = fish.boss
    ? base.loss * (1 + fish.zoneIndex * 0.006) * 0.96
    : base.loss * (1 + fish.zoneIndex * 0.012);

  return {
    ...base,
    zoneHeight: clamp(rawZoneHeight * (1 + gripRank * 0.04) * trophy.bossZoneScale * trophy.hardFishZoneScale, zoneDifficultyFloor, 0.50),
    fishAcceleration: Math.min(fish.boss ? 3.00 : Infinity, base.fishAcceleration * accelerationZoneScale * phaseScale) * speedScale * trophy.legendarySpeedScale,
    fishMaxSpeed: bossCappedSpeed * speedScale * trophy.legendarySpeedScale,
    targetMin: Math.max(fish.boss ? 0.27 : 0.18, base.targetMin / (1 + fish.zoneIndex * (fish.boss ? 0.006 : 0.012)) / phaseScale) * (1 + readingRank * 0.05) * trophy.targetDurationScale,
    targetMax: Math.max(fish.boss ? 0.58 : 0.48, base.targetMax / (1 + fish.zoneIndex * (fish.boss ? 0.005 : 0.010)) / Math.sqrt(phaseScale)) * (1 + readingRank * 0.05) * trophy.targetDurationScale,
    wobble: base.wobble * (1 + fish.zoneIndex * (fish.boss ? 0.010 : 0.018)) * phaseScale * trophy.wobbleScale,
    holdLift: base.holdLift * (1 + precisionRank * 0.04) * trophy.controlScale,
    tapImpulse: base.tapImpulse * (1 + precisionRank * 0.04) * trophy.controlScale,
    gain: gain * (1 + trackerRank * 0.04) * trophy.hardFishGainScale,
    loss: loss * Math.max(0.58, 1 - lineRank * 0.06),
    suddenReduction: clamp(talentRank(profile, "oeil-exerce") * 0.15 + trophy.suddenReductionBonus, 0, 0.78),
    focusMastery: talentRank(profile, "main-du-maitre") > 0,
    prediction: talentRank(profile, "prediction-parfaite") > 0,
    initialProgress: 0.30 + talentRank(profile, "second-souffle") * 0.05,
    focusZoneBonus: trophy.focusZoneBonus,
    lowProgressLossScale: trophy.lowProgressLossScale,
    pursuitAssist: trophy.pursuitAssist,
    graceBonus: trophy.graceBonus,
    feintScale: trophy.feintScale,
    finishingGainScale: trophy.finishingGainScale,
    anomalyNullifyChance: trophy.anomalyNullifyChance,
    driftScale: trophy.driftScale,
    bossPhaseStartBonus: trophy.bossPhaseStartBonus
  };
}

function shapeMarkup(fish, locked, uid) {
  const color = locked ? "#48545a" : fish.couleur;
  const accent = locked ? "#333d42" : fish.accent;
  const dark = locked ? "#20282c" : fish.sombre;
  const eye = locked ? "#2f383c" : "#fff5c7";
  const patternOpacity = locked ? 0 : 0.78;
  let body = "";
  let extras = "";

  if (fish.forme === "eel") {
    body = `<path d="M26 75 C55 26, 113 28, 142 66 C165 96, 196 99, 219 67 C203 116, 151 119, 118 88 C90 61, 56 66, 34 93 Z" fill="${color}" stroke="${dark}" stroke-width="5"/>`;
    extras = `<path d="M202 72 L232 49 L224 86 Z" fill="${accent}" stroke="${dark}" stroke-width="4"/><circle cx="55" cy="59" r="5" fill="${eye}"/><circle cx="56" cy="59" r="2" fill="#111"/>`;
  } else {
    const dims = {
      normal: { rx: 70, ry: 39, cx: 119, cy: 67 },
      long: { rx: 82, ry: 28, cx: 122, cy: 67 },
      broad: { rx: 61, ry: 47, cx: 116, cy: 67 },
      pike: { rx: 83, ry: 25, cx: 124, cy: 67 },
      catfish: { rx: 73, ry: 34, cx: 119, cy: 69 },
      armored: { rx: 70, ry: 37, cx: 119, cy: 67 }
    }[fish.forme] ?? { rx: 70, ry: 39, cx: 119, cy: 67 };
    body = `<ellipse cx="${dims.cx}" cy="${dims.cy}" rx="${dims.rx}" ry="${dims.ry}" fill="${color}" stroke="${dark}" stroke-width="5"/>`;
    extras = `
      <path d="M52 67 L14 36 L20 70 L14 101 Z" fill="${accent}" stroke="${dark}" stroke-width="5"/>
      <path d="M111 35 L137 9 L153 39 Z" fill="${accent}" stroke="${dark}" stroke-width="4"/>
      <path d="M111 98 L140 119 L151 94 Z" fill="${accent}" stroke="${dark}" stroke-width="4"/>
      <circle cx="170" cy="55" r="7" fill="${eye}"/><circle cx="172" cy="55" r="3" fill="#111"/>
      <path d="M184 73 Q201 79 211 70" fill="none" stroke="${dark}" stroke-width="4" stroke-linecap="round"/>`;
    if (fish.forme === "pike") extras += `<path d="M184 61 L225 72 L185 83 Z" fill="${color}" stroke="${dark}" stroke-width="4"/>`;
    if (fish.forme === "catfish") extras += `<path d="M185 70 Q219 53 231 40 M185 73 Q220 84 232 98" fill="none" stroke="${accent}" stroke-width="3" stroke-linecap="round"/>`;
    if (fish.forme === "armored") extras += `<path d="M70 49 L157 49 M62 66 L168 66 M70 83 L157 83" stroke="${dark}" stroke-width="4" opacity=".6"/>`;
  }

  const patterns = {
    plain: "",
    spots: `<g fill="${accent}" opacity="${patternOpacity}"><circle cx="88" cy="53" r="7"/><circle cx="117" cy="78" r="9"/><circle cx="145" cy="52" r="6"/><circle cx="84" cy="83" r="5"/></g>`,
    stripes: `<g stroke="${accent}" stroke-width="9" opacity="${patternOpacity}"><path d="M82 36 L71 94"/><path d="M112 31 L102 103"/><path d="M142 35 L136 98"/></g>`,
    mottled: `<g fill="${accent}" opacity="${patternOpacity}"><path d="M70 55 Q90 35 103 57 T139 54 T166 70 Q146 88 128 75 T89 83 Z"/></g>`,
    scales: `<g fill="none" stroke="${accent}" stroke-width="3" opacity="${patternOpacity}"><path d="M78 49 Q90 62 102 49 Q114 62 126 49 Q138 62 150 49"/><path d="M76 70 Q88 83 100 70 Q112 83 124 70 Q136 83 148 70"/><path d="M84 89 Q96 102 108 89 Q120 102 132 89"/></g>`,
    glow: `<g fill="${accent}" opacity="${patternOpacity}"><ellipse cx="112" cy="67" rx="44" ry="13"/><circle cx="79" cy="48" r="5"/><circle cx="151" cy="86" r="5"/></g>`
  };

  const crown = fish.boss && !locked ? `<path d="M83 27 L96 6 L112 24 L129 5 L145 27 Z" fill="#ffd66b" stroke="#6b4712" stroke-width="3"/><circle cx="96" cy="12" r="3" fill="#fff0a3"/><circle cx="129" cy="11" r="3" fill="#fff0a3"/>` : "";
  return `<g filter="url(#${uid}-shadow)">${crown}${body}${patterns[fish.motif] ?? ""}${extras}</g>`;
}

function fallbackFishIllustration(fish, { locked = false, large = false } = {}) {
  const uid = `lfg-fish-${illustrationSerial += 1}`;
  const label = locked ? "Espèce non découverte" : fish.nom;
  return `<svg class="lfg-fish-art${large ? " is-large" : ""}${locked ? " is-locked" : ""}${fish.boss ? " is-boss" : ""}" viewBox="0 0 240 130" role="img" aria-label="${escapeHtml(label)}">
    <defs><filter id="${uid}-shadow" x="-30%" y="-40%" width="160%" height="180%"><feDropShadow dx="0" dy="7" stdDeviation="6" flood-color="#000" flood-opacity=".42"/></filter></defs>
    <path d="M4 105 Q52 92 93 105 T183 104 T238 102" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="3"/>
    ${shapeMarkup(fish, locked, uid)}
  </svg>`;
}

const ASSET_CACHE_VERSION = "1.1.1";
const UNKNOWN_FISH_PLACEHOLDER = "modules/light-fishing-minigame/assets/ui/poisson-inconnu.webp";

function fishPreviewPath(src) {
  return String(src ?? "").replace("/assets/fish/", "/assets/fish-preview/");
}

function routedAssetPath(src) {
  const clean = String(src ?? "").replace(/^\/+/, "");
  if (!clean) return "";

  let routed = clean;
  try {
    const getRoute = globalThis.foundry?.utils?.getRoute;
    if (typeof getRoute === "function") routed = getRoute(clean);
    else if (globalThis.document?.baseURI) routed = new URL(clean, document.baseURI).href;
  } catch (error) {
    console.warn(`${MODULE_ID} | Impossible de construire la route de l’asset`, clean, error);
  }

  const separator = routed.includes("?") ? "&" : "?";
  return `${routed}${separator}v=${ASSET_CACHE_VERSION}`;
}

function lockedFishIllustration(fish, { large = false, mode = "preview", useFullSource = false } = {}) {
  const full = mode === "full";
  const classes = [
    "hc-fish-media",
    full ? "hc-fish-media--full" : "hc-fish-media--preview",
    useFullSource && !full ? "is-full-source" : "",
    large ? "is-large" : "",
    fish?.boss ? "is-boss" : "",
    "is-locked"
  ].filter(Boolean).join(" ");
  const label = escapeHtml(fish?.boss ? "Boss inconnu" : "Espèce inconnue");
  const source = escapeHtml(routedAssetPath(UNKNOWN_FISH_PLACEHOLDER));
  return `<div class="${classes}" role="img" aria-label="${label}">
    <img class="hc-fish-media__img" data-lfg-fish-image="true" src="${source}" alt="${label}" decoding="async" draggable="false">
    <span class="hc-fish-media__error" data-role="fish-image-error" hidden><i class="fas fa-image"></i><small>Illustration indisponible</small></span>
  </div>`;
}

function fishIllustration(fish, { locked = false, large = false, mode = "preview", useFullSource = false } = {}) {
  if (!fish) return "";
  if (locked) return lockedFishIllustration(fish, { large, mode, useFullSource });

  const fullSource = POISSON_IMAGE_BY_ID.get(fish.id);
  if (!fullSource) return fallbackFishIllustration(fish, { locked: false, large });

  const full = mode === "full";
  const source = (full || useFullSource) ? fullSource : fishPreviewPath(fullSource);
  const primary = routedAssetPath(source);
  const fallback = (!full && !useFullSource) ? routedAssetPath(fullSource) : "";
  const label = escapeHtml(fish.nom);
  const classes = [
    "hc-fish-media",
    full ? "hc-fish-media--full" : "hc-fish-media--preview",
    useFullSource && !full ? "is-full-source" : "",
    large ? "is-large" : "",
    fish.boss ? "is-boss" : ""
  ].filter(Boolean).join(" ");

  return `<div class="${classes}" role="img" aria-label="${label}">
    <img class="hc-fish-media__img" data-lfg-fish-image="true" src="${escapeHtml(primary)}"${fallback ? ` data-fallback-src="${escapeHtml(fallback)}"` : ""} alt="${label}" decoding="async" draggable="false">
    <span class="hc-fish-media__error" data-role="fish-image-error" hidden><i class="fas fa-image"></i><small>Illustration indisponible</small></span>
  </div>`;
}

function probeIllustrationAsset(src, label) {
  return new Promise((resolve) => {
    const image = new Image();
    const timeout = window.setTimeout(() => resolve({ ok: false, label, src, reason: "timeout" }), 6000);
    image.onload = () => {
      window.clearTimeout(timeout);
      resolve({ ok: true, label, src, width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      window.clearTimeout(timeout);
      resolve({ ok: false, label, src, reason: "load-error" });
    };
    image.src = src;
  });
}

async function diagnoseIllustrationAssets() {
  const sample = POISSON_IMAGE_BY_ID.values().next().value;
  if (!sample) return;
  const checks = await Promise.all([
    probeIllustrationAsset(routedAssetPath(sample), "illustration complète"),
    probeIllustrationAsset(routedAssetPath(fishPreviewPath(sample)), "miniature")
  ]);
  const failures = checks.filter((check) => !check.ok);
  if (!failures.length) {
    console.log(`${MODULE_ID} | Diagnostic images OK`, checks);
    return;
  }
  console.error(`${MODULE_ID} | Diagnostic images en échec`, failures);
  ui.notifications?.error("Hameçons & Couronnes : certaines illustrations ne peuvent pas être chargées. Consultez la console F12 pour connaître le chemin en erreur.", { permanent: true });
}

async function announceCatch(result) {
  if (!setting("chatResults", true)) return;
  const fish = POISSONS_PAR_ID.get(result.fishId);
  const content = `
    <section class="lfg-chat-card lfg-rarity-border-${rarityClass(result.rarity)}">
      <header><i class="fas ${result.boss ? "fa-crown" : "fa-fish"}"></i> ${result.boss ? "Boss capturé !" : tr("LFG.Caught", "Poisson attrapé !")}</header>
      <div class="lfg-chat-catch">
        ${fishIllustration(fish)}
        <div>
          <p><strong>${escapeHtml(result.userName)}</strong> a attrapé <strong>${escapeHtml(result.name)}</strong>.</p>
          <div class="lfg-chat-stats">
            <span>Zone : <strong>${escapeHtml(result.zone)}</strong></span>
            <span>Période : <strong>${escapeHtml(PERIODES[result.period]?.nom ?? result.period)}</strong></span>
            <span>Poids : <strong>${result.weight.toFixed(2)} kg</strong></span>
            <span>Score : <strong>${result.score} pts</strong></span>
          </div>
        </div>
      </div>
    </section>`;

  try {
    await ChatMessage.create({ speaker: { alias: result.userName }, content });
  } catch (error) {
    console.error(`${MODULE_ID} | Impossible de publier la prise dans le chat`, error);
  }
}

function leaderboardRows() {
  const rows = game.users.contents.map((user) => {
    const profile = getProfile(user);
    const summary = profileSummary(profile);
    return { user, profile, ...summary };
  }).filter((row) => row.total > 0 || row.user.id === game.user.id);
  rows.sort((a, b) => b.score - a.score || b.bosses - a.bosses || b.unique - a.unique || b.total - a.total || a.user.name.localeCompare(b.user.name, "fr"));
  return rows;
}

class FishingGame {
  constructor(options = {}) {
    const configuredZone = options.zone ?? options.habitat ?? setting("defaultZone", ZONES[0].id);
    this.profile = getProfile();
    const configuredIndex = ZONES.findIndex((zone) => zone.id === configuredZone);
    this.zoneId = configuredIndex >= 0 && isZoneUnlocked(this.profile, configuredIndex) ? configuredZone : ZONES[0].id;
    this.period = options.period === "jour" || options.period === "nuit" ? options.period : initialPeriod();
    const allowedView = ["peche", "catalogue", "talents", "classement"].includes(options.view) || (options.view === "admin" && game.user?.isGM);
    this.initialView = allowedView ? options.view : "peche";
    this.currentView = this.initialView;
    this.root = null;
    this.abortController = new AbortController();
    this.raf = null;
    this.startTimer = null;
    this.lastFrame = 0;
    this.status = "intro";
    this.pressed = false;
    this.progress = 0.30;
    this.playerY = 0.28;
    this.playerVelocity = 0;
    this.fishY = 0.62;
    this.fishVelocity = 0;
    this.fishTarget = 0.62;
    this.targetTimer = 0;
    this.inside = false;
    this.lastTap = 0;
    this.graceRemaining = 0;
    this.insideStreak = 0;
    this.predictionReady = false;
    this.targetFish = null;
    this.bossPhase = 0;
    this.catalogFilters = { search: "", zone: "toutes", rarity: "toutes", period: "toutes", status: "tous" };
    this.adminSelection = game.users?.find((user) => !user.isGM)?.id ?? game.user?.id ?? "";
    this.pendingConfirmResolver = null;
    this.pendingTalentSave = false;
    this.pendingAdminAction = false;
    this.talentPanel = "trees";
    this.selectedTrophyId = BOSS_TROPHIES[0]?.id ?? null;
    this.currentZoneHeight = 0.24;
  }

  open() {
    document.querySelector("#lfg-overlay")?.remove();
    this.root = document.createElement("div");
    this.root.id = "lfg-overlay";
    this.root.className = `lfg-overlay lfg-${this.period}`;
    this.root.innerHTML = this.template();
    document.body.appendChild(this.root);
    this.activateListeners();
    this.switchView(this.initialView);
    this.renderProfileSummary();
    this.renderHome();
    requestAnimationFrame(() => this.root?.classList.add("is-open"));
  }

  template() {
    return `
      <div class="lfg-shell" role="dialog" aria-modal="true" aria-label="Hameçons & Couronnes">
        <div class="lfg-water-glow"></div>
        <button type="button" class="lfg-close" data-action="close" title="Fermer"><i class="fas fa-xmark"></i></button>
        <header class="lfg-header">
          <div class="lfg-brand"><div class="lfg-title-icon"><i class="fas fa-fish-fins"></i></div><div><h2>Hameçons & Couronnes <small class="lfg-runtime-version">v${escapeHtml(game.modules.get(MODULE_ID)?.version ?? ASSET_CACHE_VERSION)}</small></h2><p>Pêchez. Explorez. Affrontez les monstres des eaux.</p></div></div>
          <nav class="lfg-nav" aria-label="Navigation de Hameçons & Couronnes">
            <button type="button" data-action="home" data-view="peche"><i class="fas fa-house"></i><span>Accueil</span></button>
            <button type="button" data-action="nav" data-view="catalogue"><i class="fas fa-book-open"></i><span>Catalogue</span><em data-role="catalog-count"></em></button>
            <button type="button" data-action="nav" data-view="talents"><i class="fas fa-diagram-project"></i><span>Talents</span></button>
            <button type="button" data-action="nav" data-view="classement"><i class="fas fa-trophy"></i><span>Classement</span></button>${game.user?.isGM ? `<button type="button" data-action="nav" data-view="admin"><i class="fas fa-screwdriver-wrench"></i><span>Admin</span></button>` : ""}
          </nav>
        </header>

        <main class="lfg-main">
          <section class="lfg-view lfg-fishing-view" data-view-panel="peche">
            <section class="lfg-intro-panel">
              <div class="lfg-home-top">
                <div class="lfg-zone-showcase">
                  <img data-role="zone-scene" alt="Illustration de la zone de pêche">
                  <div class="lfg-zone-showcase-shade"></div>
                  
                  <div class="lfg-period-toggle" role="group" aria-label="Période de pêche">
                    <button type="button" data-action="period" data-period="jour"><i class="fas fa-sun"></i> Jour</button>
                    <button type="button" data-action="period" data-period="nuit"><i class="fas fa-moon"></i> Nuit</button>
                  </div>
                </div>
                <aside class="lfg-zone-summary" data-role="zone-summary"></aside>
              </div>
              <div class="lfg-profile-strip" data-role="profile-summary"></div>
              <div class="lfg-zone-grid" data-role="zone-grid"></div>
              <div class="lfg-home-actions">
                <p class="lfg-help"><i class="fas fa-hand-pointer"></i> Maintenez <strong>Mouliner</strong> ou la barre <strong>Espace</strong> pour garder le poisson dans la zone de capture.</p>
                <button type="button" class="lfg-primary lfg-cast-button" data-action="start"><i class="fas fa-water"></i><span data-role="cast-label">Lancer la ligne</span></button>
              </div>
            </section>

            <section class="lfg-game-panel" hidden>
              <div class="lfg-game-scene" data-role="game-scene">
                
                <div class="lfg-encounter-banner"><div data-role="mystery-art"></div><div><span data-role="game-zone"></span><strong data-role="encounter-title">Quelque chose a mordu !</strong><div data-role="game-difficulty"></div></div></div>
                <div class="lfg-boss-bars" data-role="boss-bars" hidden></div>
                <div class="lfg-game-layout">
                  <div class="lfg-progress-wrap"><span>Capture</span><div class="lfg-progress-track"><div class="lfg-progress-fill" data-role="progress"></div><div class="lfg-progress-spark"></div></div></div>
                  <div class="lfg-lane" data-role="lane"><div class="lfg-lane-shimmer"></div><div class="lfg-bubbles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="lfg-catch-zone" data-role="catch-zone"><div class="lfg-hook-line"></div><div class="lfg-hook"><i class="fas fa-anchor"></i></div></div><div class="lfg-fish" data-role="fish"><i class="fas fa-fish"></i></div></div>
                  <div class="lfg-status-column"><div class="lfg-difficulty-badge" data-role="difficulty-label"></div><div class="lfg-live-hint"><kbd>Espace</kbd><span>ou</span><i class="fas fa-computer-mouse"></i></div></div>
                </div>
                <button type="button" class="lfg-reel" data-action="reel"><span class="lfg-reel-ring"></span><i class="fas fa-rotate"></i><strong>Mouliner !</strong></button>
              </div>
            </section>

            <section class="lfg-result-panel" hidden><div class="lfg-result-icon"><i class="fas fa-fish"></i></div><h3 data-role="result-title"></h3><div class="lfg-result-body" data-role="result-body"></div><div class="lfg-result-actions"><button type="button" class="lfg-primary" data-action="restart"><i class="fas fa-rotate-right"></i> Relancer la ligne</button><button type="button" class="lfg-secondary" data-action="nav" data-view="catalogue"><i class="fas fa-book-open"></i> Voir le catalogue</button></div></section>
          </section>

          <section class="lfg-view lfg-catalogue-view" data-view-panel="catalogue" hidden>
            <div class="lfg-section-heading"><div><span class="lfg-kicker">Album personnel</span><h3>Catalogue des poissons</h3><p>144 espèces d’eau douce réparties dans 18 zones. Les boss apparaissent après la découverte de toutes les espèces ordinaires de leur zone.</p></div><div class="lfg-section-actions"><div class="lfg-completion-ring" data-role="completion-ring"><strong>0 %</strong><span>complété</span></div></div></div>
            <div class="lfg-catalog-controls"><label><i class="fas fa-magnifying-glass"></i><input type="search" data-filter="search" placeholder="Rechercher une espèce découverte…"></label><select data-filter="zone"><option value="toutes">Toutes les zones</option>${ZONES.map((zone) => `<option value="${zone.id}">${escapeHtml(zone.name)}</option>`).join("")}</select><select data-filter="rarity"><option value="toutes">Toutes les raretés</option>${Object.keys(RARETES).map((rarity) => `<option value="${escapeHtml(rarity)}">${escapeHtml(rarity)}</option>`).join("")}</select><select data-filter="period"><option value="toutes">Jour et nuit</option><option value="jour">Poissons de jour</option><option value="nuit">Poissons de nuit</option><option value="toujours">Toujours présents</option></select><select data-filter="status"><option value="tous">Découverts et inconnus</option><option value="decouverts">Espèces découvertes</option><option value="inconnus">Espèces inconnues</option></select></div>
            <div class="lfg-catalog-scroll"><div class="lfg-catalog-grid" data-role="catalog-grid"></div></div>
            <div class="lfg-fish-detail" data-role="fish-detail" hidden></div>
          </section>

          <section class="lfg-view lfg-talents-view" data-view-panel="talents" hidden>
            <div class="lfg-section-heading lfg-talents-heading"><div><span class="lfg-kicker">Progression du pêcheur</span><h3>Talents & Trophées</h3><p>Développez votre technique avec la maîtrise, puis laissez les boss vaincus inscrire leurs pouvoirs dans votre Vague des Trophées.</p></div><div class="lfg-talent-wallet" data-role="talent-wallet"></div></div>
            <div class="lfg-progression-tabs" role="tablist" aria-label="Progression"><button type="button" data-action="talent-panel" data-panel="trees"><i class="fas fa-diagram-project"></i><span>Arbres de talents</span></button><button type="button" data-action="talent-panel" data-panel="trophies"><i class="fas fa-crown"></i><span>La Vague des Trophées</span><em data-role="trophy-tab-count"></em></button></div>
            <div data-role="talent-tree-panel">
              <div class="lfg-talents-toolbar"><span><i class="fas fa-circle-info"></i> Les talents utilisent les points de maîtrise et peuvent être réinitialisés.</span><button type="button" class="lfg-secondary" data-action="talent-reset"><i class="fas fa-rotate-left"></i> Réinitialiser</button></div>
              <div class="lfg-talents-scroll"><div class="lfg-talent-trees" data-role="talent-trees"></div></div>
            </div>
            <div class="lfg-trophy-panel" data-role="trophy-panel" hidden>
              <div class="lfg-talents-toolbar"><span><i class="fas fa-water"></i> Chaque victoire ajoute une empreinte à la Vague. Les 18 trophées sont indépendants et ne coûtent aucun point.</span><strong data-role="trophy-progress"></strong></div>
              <div class="lfg-trophy-wave-layout">
                <div class="lfg-trophy-wave-board" data-role="trophy-wave"></div>
                <aside class="lfg-trophy-detail" data-role="trophy-detail" aria-live="polite"></aside>
              </div>
            </div>
          </section>

          <section class="lfg-view lfg-leaderboard-view" data-view-panel="classement" hidden>
            <div class="lfg-section-heading"><div><span class="lfg-kicker">Royaumes Fluviaux</span><h3>Classement des pêcheurs</h3><p>Le score récompense les raretés, les zones dangereuses, les beaux spécimens et les boss capturés.</p></div><div class="lfg-section-actions"><i class="fas fa-trophy lfg-heading-trophy"></i></div></div>
            <div class="lfg-leaderboard-scroll"><div class="lfg-leaderboard" data-role="leaderboard"></div></div>
          </section>

          ${game.user?.isGM ? `<section class="lfg-view lfg-admin-view" data-view-panel="admin" hidden>
            <div class="lfg-section-heading"><div><span class="lfg-kicker">Outils MJ</span><h3>Administration de la pêche</h3><p>Ajustez les points, consultez l’état d’un profil et réinitialisez les données des joueurs si besoin.</p></div><div class="lfg-section-actions"><i class="fas fa-screwdriver-wrench lfg-heading-trophy"></i></div></div>
            <div class="lfg-admin-panel" data-role="admin-panel"></div>
          </section>` : ""}
        </main>
        <div class="lfg-boss-appearance" data-role="boss-appearance" hidden></div>
      </div>
      <div class="lfg-talent-tooltip" data-role="talent-tooltip" hidden></div><div class="lfg-confirm-overlay" data-role="confirm-overlay" hidden><div class="lfg-confirm-card"><div class="lfg-confirm-header"><h4 data-role="confirm-title"></h4><button type="button" class="lfg-confirm-close" data-action="confirm-cancel" aria-label="Fermer"><i class="fas fa-xmark"></i></button></div><div class="lfg-confirm-body" data-role="confirm-body"></div><div class="lfg-confirm-actions"><button type="button" class="lfg-secondary" data-action="confirm-cancel">Annuler</button><button type="button" class="lfg-primary" data-action="confirm-accept">Confirmer</button></div></div></div>`;
  }

  activateListeners() {
    const signal = this.abortController.signal;
    this.root.addEventListener("click", (event) => {
      const control = event.target.closest("[data-action]");
      if (!control) return;
      const { action } = control.dataset;
      if (action === "close") this.close();
      else if (action === "start") this.start();
      else if (action === "restart") this.restart();
      else if (action === "home") this.goHome();
      else if (action === "nav") this.switchView(control.dataset.view);
      else if (action === "zone") this.selectZone(control.dataset.zone);
      else if (action === "zone-boss") this.startBoss(control.dataset.zone);
      else if (action === "period") this.selectPeriod(control.dataset.period);
      else if (action === "fish-detail") this.showFishDetail(control.dataset.fishId);
      else if (action === "close-detail") this.hideFishDetail();
      else if (action === "talent-buy") this.buyTalent(control.dataset.talentId);
      else if (action === "talent-panel") this.setTalentPanel(control.dataset.panel);
      else if (action === "trophy-select") this.selectTrophy(control.dataset.trophyId);
      else if (action === "talent-reset") this.resetTalents();
      else if (action === "admin-refresh") this.renderAdmin();
      else if (action === "admin-points") this.adjustAdminPoints(control.dataset.mode);
      else if (action === "admin-reset") this.resetAdminProfile(control.dataset.scope);
      else if (action === "confirm-accept") this.resolveInternalConfirm(true);
      else if (action === "confirm-cancel") this.resolveInternalConfirm(false);
    }, { signal });

    this.root.addEventListener("error", (event) => {
      const image = event.target?.closest?.('img[data-lfg-fish-image="true"]');
      if (!image) return;

      const media = image.closest(".hc-fish-media");
      const fallback = image.dataset.fallbackSrc;
      if (fallback && image.dataset.fallbackTried !== "true") {
        image.dataset.fallbackTried = "true";
        media?.classList.add("is-using-full-fallback");
        image.src = fallback;
        return;
      }

      image.hidden = true;
      media?.classList.add("has-image-error");
      const errorState = media?.querySelector('[data-role="fish-image-error"]');
      if (errorState) errorState.hidden = false;
      console.error(`${MODULE_ID} | Illustration impossible à charger`, image.currentSrc || image.src);
    }, { capture: true, signal });

    this.root.addEventListener("load", (event) => {
      const image = event.target?.closest?.('img[data-lfg-fish-image="true"]');
      if (!image) return;
      const media = image.closest(".hc-fish-media");
      media?.classList.remove("has-image-error");
      const errorState = media?.querySelector('[data-role="fish-image-error"]');
      if (errorState) errorState.hidden = true;
    }, { capture: true, signal });

    this.root.addEventListener("pointerover", (event) => {
      const node = event.target.closest("[data-talent-id], [data-trophy-id]");
      if (node && !node.contains(event.relatedTarget)) this.showTalentTooltip(node);
    }, { signal });
    this.root.addEventListener("pointerout", (event) => {
      const node = event.target.closest("[data-talent-id], [data-trophy-id]");
      if (node && !node.contains(event.relatedTarget)) this.hideTalentTooltip();
    }, { signal });
    this.root.addEventListener("focusin", (event) => {
      const node = event.target.closest("[data-talent-id], [data-trophy-id]");
      if (node) this.showTalentTooltip(node);
    }, { signal });
    this.root.addEventListener("focusout", (event) => {
      if (event.target.closest("[data-talent-id], [data-trophy-id]")) this.hideTalentTooltip();
    }, { signal });

    this.root.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || !event.target.closest('[data-action="reel"]')) return;
      event.preventDefault();
      this.pressed = true;
      this.tap();
    }, { signal });

    window.addEventListener("pointerup", () => { this.pressed = false; }, { signal });
    window.addEventListener("pointercancel", () => { this.pressed = false; }, { signal });
    window.addEventListener("keydown", (event) => {
      if (event.code === "Escape") {
        event.preventDefault();
        const confirmation = this.root?.querySelector('[data-role="confirm-overlay"]');
        const detail = this.root?.querySelector('[data-role="fish-detail"]');
        if (confirmation && !confirmation.hidden) this.resolveInternalConfirm(false);
        else if (detail && !detail.hidden) this.hideFishDetail();
        else this.close();
        return;
      }
      if (event.code !== "Space" || this.status !== "playing") return;
      event.preventDefault();
      if (!event.repeat) this.tap();
      this.pressed = true;
    }, { signal });
    window.addEventListener("keyup", (event) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      this.pressed = false;
    }, { signal });

    this.root.querySelectorAll("[data-filter]").forEach((control) => {
      control.addEventListener(control.matches('input[type="search"]') ? "input" : "change", (event) => {
        const key = event.target.dataset.filter;
        this.catalogFilters[key] = event.target.value;
        this.renderCatalogue();
      }, { signal });
    });

    this.root.addEventListener("change", (event) => {
      const select = event.target.closest('[data-admin-select]');
      if (!select) return;
      this.adminSelection = select.value;
      this.renderAdmin();
    }, { signal });
  }

  switchView(view) {
    if (!["peche", "catalogue", "talents", "classement", "admin"].includes(view)) return;
    if (view === "admin" && !game.user?.isGM) return;
    if ((this.status === "playing" || this.status === "boss-intro") && view !== "peche") {
      ui.notifications?.warn("Terminez la prise en cours avant de changer d’écran.");
      return;
    }
    this.currentView = view;
    this.root.querySelectorAll("[data-view-panel]").forEach((panel) => { panel.hidden = panel.dataset.viewPanel !== view; });
    this.root.querySelectorAll('[data-view]').forEach((button) => button.classList.toggle("is-active", button.dataset.view === view));
    this.hideFishDetail();
    this.hideTalentTooltip();
    if (view === "peche") this.renderHome();
    if (view === "catalogue") this.renderCatalogue();
    if (view === "talents") this.renderTalents();
    if (view === "classement") this.renderLeaderboard();
    if (view === "admin" && game.user?.isGM) this.renderAdmin();
  }

  selectZone(id) {
    const zone = zoneById(id);
    if (!isZoneUnlocked(this.profile, zone.index)) {
      const previous = ZONES[zone.index - 1];
      const progress = zoneProgress(this.profile, previous.id);
      ui.notifications?.warn(`Capturez au moins ${progress.required} espèces dans ${previous.name} pour débloquer cette zone.`);
      return;
    }
    this.zoneId = zone.id;
    this.renderHome();
  }

  selectPeriod(period) {
    if (period !== "jour" && period !== "nuit") return;
    this.period = period;
    this.root.classList.toggle("lfg-jour", period === "jour");
    this.root.classList.toggle("lfg-nuit", period === "nuit");
    this.renderHome();
  }

  renderHome() {
    if (!this.root || this.currentView !== "peche" || this.status !== "intro") return;
    let zone = zoneById(this.zoneId);
    if (!isZoneUnlocked(this.profile, zone.index)) {
      this.zoneId = ZONES[0].id;
      zone = ZONES[0];
    }
    const progress = zoneProgress(this.profile, zone.id);
    const next = ZONES[zone.index + 1];
    const scene = this.root.querySelector('[data-role="zone-scene"]');
    if (scene) scene.src = this.period === "jour" ? zone.imageJour : zone.imageNuit;
    this.root.querySelectorAll('[data-action="period"]').forEach((button) => button.classList.toggle("is-active", button.dataset.period === this.period));

    const summary = this.root.querySelector('[data-role="zone-summary"]');
    if (summary) {
      const nextText = next
        ? progress.halfComplete
          ? `<span class="lfg-unlock-ok"><i class="fas fa-unlock"></i>${escapeHtml(next.name)} débloquée</span>`
          : `<span><i class="fas fa-lock"></i>Encore ${Math.max(0, progress.required - progress.discovered)} espèce${progress.required - progress.discovered > 1 ? "s" : ""} pour ${escapeHtml(next.name)}</span>`
        : `<span class="lfg-unlock-ok"><i class="fas fa-flag-checkered"></i>Dernière zone du parcours</span>`;
      const bossText = progress.complete
        ? progress.bossCaught
          ? `<span class="lfg-boss-complete"><i class="fas fa-crown"></i> Boss capturé · ${escapeHtml(progress.boss.nom)}</span>`
          : `<span class="lfg-boss-ready"><i class="fas fa-bullseye"></i> Boss disponible · ${progress.boss.periode === "jour" ? "jour" : "nuit"}</span>`
        : `<span><i class="fas fa-fish"></i> Encore ${Math.max(0, progress.total - progress.discovered)} espèce${progress.total - progress.discovered > 1 ? "s" : ""} pour faire apparaître le boss</span>`;
      summary.innerHTML = `<span class="lfg-kicker">Zone de niveau ${zone.level}</span><h3>${escapeHtml(zone.name)}</h3><p>${escapeHtml(zone.intro)}</p><div class="lfg-zone-progress"><strong>${progress.discovered}/${progress.total} espèces découvertes</strong><div><i style="width:${(progress.discovered / progress.total) * 100}%"></i></div></div>${nextText}${bossText}`;
    }

    this.renderZoneGrid();
    this.updateCastButton();
  }

  renderZoneGrid() {
    const grid = this.root?.querySelector('[data-role="zone-grid"]');
    if (!grid) return;
    grid.innerHTML = ZONES.map((zone) => {
      const unlocked = isZoneUnlocked(this.profile, zone.index);
      const progress = zoneProgress(this.profile, zone.id);
      const selected = zone.id === this.zoneId;
      const bossAvailable = Boolean(progress.boss && progress.complete && (progress.boss.periode === this.period || progress.boss.periode === "toujours"));
      const stateIcon = !unlocked
        ? "fa-lock"
        : progress.bossCaught
          ? "fa-crown"
          : selected
            ? "fa-location-dot"
            : progress.complete
              ? "fa-check-double"
              : progress.halfComplete
                ? "fa-check"
                : "fa-fish";
      const bossLabel = progress.bossCaught ? "Rejouer" : "Boss";
      return `<article class="lfg-zone-card${selected ? " is-selected" : ""}${!unlocked ? " is-locked" : ""}${progress.bossCaught ? " is-mastered" : ""}">
        <button type="button" class="lfg-zone-main" data-action="zone" data-zone="${zone.id}" ${!unlocked ? 'aria-disabled="true"' : ""}>
          <span class="lfg-zone-thumb" aria-hidden="true"><i class="fas ${zone.icon}"></i></span>
          <span class="lfg-zone-level">${zone.level}</span>
          <span class="lfg-zone-card-label"><strong>${escapeHtml(zone.name)}</strong><small>${unlocked ? `${progress.discovered}/${progress.total} poissons` : "Zone verrouillée"}</small></span>
          <em><i class="fas ${stateIcon}"></i></em>
        </button>
        <button type="button" class="lfg-zone-boss-button${bossAvailable ? " is-available" : ""}" data-action="zone-boss" data-zone="${zone.id}" ${(unlocked && bossAvailable) ? "" : 'disabled'}>
          <i class="fas fa-bullseye"></i><span>${bossLabel}</span>
        </button>
      </article>`;
    }).join("");
  }

  updateCastButton() {
    const progress = zoneProgress(this.profile, this.zoneId);
    const label = this.root?.querySelector('[data-role="cast-label"]');
    const button = this.root?.querySelector('[data-action="start"]');
    if (!label || !button) return;
    const bossAvailableNow = progress.complete && progress.boss && (progress.boss.periode === this.period || progress.boss.periode === "toujours");
    if (bossAvailableNow && !progress.bossCaught) {
      label.textContent = `Pêcher ou faire apparaître ${progress.boss.nom}`;
      button.classList.add("is-boss-ready");
      const icon = button.querySelector("i");
      if (icon) icon.className = "fas fa-crown";
    } else {
      label.textContent = `Lancer la ligne (${this.period === "jour" ? "jour" : "nuit"})`;
      button.classList.remove("is-boss-ready");
      const icon = button.querySelector("i");
      if (icon) icon.className = `fas ${this.period === "jour" ? "fa-sun" : "fa-moon"}`;
    }
  }

  renderProfileSummary() {
    const summary = profileSummary(this.profile);
    const target = this.root?.querySelector('[data-role="profile-summary"]');
    if (target) target.innerHTML = `<span><i class="fas fa-fish"></i><strong>${summary.total}</strong> prises</span><span><i class="fas fa-book-open"></i><strong>${summary.unique}/${POISSONS.length}</strong> espèces</span><span><i class="fas fa-map"></i><strong>${summary.zones}/${ZONES.length}</strong> zones</span><span><i class="fas fa-crown"></i><strong>${summary.bosses}/${ZONES.length}</strong> boss</span><span><i class="fas fa-trophy"></i><strong>${summary.score}</strong> score</span><button type="button" class="lfg-profile-talents" data-action="nav" data-view="talents" title="Ouvrir les arbres de talents"><i class="fas fa-wand-magic-sparkles"></i><strong>${summary.mastery}</strong><small>maîtrise</small></button>`;
    const count = this.root?.querySelector('[data-role="catalog-count"]');
    if (count) count.textContent = `${summary.unique}/${POISSONS.length}`;
  }

  start() {
    if (this.status !== "intro") return;
    const zone = zoneById(this.zoneId);
    if (!isZoneUnlocked(this.profile, zone.index)) {
      this.zoneId = ZONES[0].id;
      ui.notifications?.warn("Cette zone n’est plus débloquée pour ce profil. Retour au Rostland.");
      this.renderHome();
      return;
    }
    this.targetFish = weightedFish(this.zoneId, this.period, this.profile);
    this.bossPhase = 0;
    if (this.targetFish.boss) this.showBossAppearance();
    else this.beginFight();
  }

  startBoss(zoneId = this.zoneId) {
    if (this.status !== "intro") return;
    const zone = zoneById(zoneId);
    if (!isZoneUnlocked(this.profile, zone.index)) {
      ui.notifications?.warn(`La zone ${zone.name} n’est pas encore débloquée.`);
      return;
    }
    const progress = zoneProgress(this.profile, zone.id);
    if (!progress.complete || !progress.boss) {
      ui.notifications?.warn(`Le boss de ${zone.name} n’apparaîtra qu’une fois toutes les espèces ordinaires découvertes.`);
      return;
    }
    if (!(progress.boss.periode === this.period || progress.boss.periode === "toujours")) {
      ui.notifications?.warn(`Le boss de ${zone.name} n’apparaît que de ${progress.boss.periode}.`);
      return;
    }
    this.zoneId = zone.id;
    this.targetFish = progress.boss;
    this.bossPhase = 0;
    this.showBossAppearance();
  }

  showBossAppearance() {
    this.status = "boss-intro";
    const overlay = this.root.querySelector('[data-role="boss-appearance"]');
    overlay.hidden = false;
    overlay.innerHTML = `<div class="lfg-boss-splash"><span>Une présence colossale remue les eaux…</span>${fishIllustration(this.targetFish, { large: true, mode: "full" })}<h3>${escapeHtml(this.targetFish.nom)}</h3><strong>Boss de ${escapeHtml(this.targetFish.zone)}</strong><div class="lfg-boss-phase-pips"><i></i><i></i><i></i></div></div>`;
    playTone(92, 0.55, "sawtooth", 0.035);
    playTone(146, 0.42, "triangle", 0.035, 0.24);
    this.root.querySelector(".lfg-shell")?.classList.add("lfg-boss-arrival");
    this.startTimer = window.setTimeout(() => {
      if (!this.root) return;
      overlay.hidden = true;
      this.root.querySelector(".lfg-shell")?.classList.remove("lfg-boss-arrival");
      this.beginFight();
    }, 1850);
  }

  beginFight() {
    const config = gameConfigFor(this.targetFish, this.bossPhase, this.profile);
    this.status = "playing";
    this.progress = this.targetFish.boss ? Math.max(0.22, config.initialProgress - 0.08 + config.bossPhaseStartBonus) : config.initialProgress;
    const halfZone = config.zoneHeight / 2;
    const startCenter = this.targetFish.boss ? 0.50 : randomBetween(0.42, 0.58);
    this.playerY = clamp(startCenter, halfZone, 1 - halfZone);
    this.playerVelocity = 0;
    this.fishY = clamp(this.playerY + randomBetween(-config.zoneHeight * 0.12, config.zoneHeight * 0.12), 0.05, 0.95);
    this.fishVelocity = 0;
    this.fishTarget = this.fishY;
    this.graceRemaining = (this.targetFish.boss ? 2.25 : Math.max(0.95, 1.35 - this.targetFish.difficulte * 0.07)) + config.graceBonus;
    this.insideStreak = 0;
    this.predictionReady = config.prediction;
    this.targetTimer = this.graceRemaining + randomBetween(config.targetMin, config.targetMax);
    this.inside = true;
    this.pressed = false;
    this.root.querySelector(".lfg-intro-panel").hidden = true;
    this.root.querySelector(".lfg-result-panel").hidden = true;
    this.root.querySelector(".lfg-game-panel").hidden = false;
    this.root.querySelector('[data-role="difficulty-label"]').innerHTML = `<strong>${config.label}</strong>${difficultyStars(this.targetFish.difficulte)}<small>Zone ${this.targetFish.zoneIndex + 1}</small>`;
    this.root.querySelector('[data-role="game-difficulty"]').innerHTML = `${difficultyStars(this.targetFish.difficulte)} ${periodBadge(this.period)}`;
    this.root.querySelector('[data-role="game-zone"]').textContent = this.targetFish.zone;
    this.root.querySelector('[data-role="encounter-title"]').textContent = this.targetFish.boss ? this.targetFish.nom : "Quelque chose a mordu !";
    this.root.querySelector('[data-role="mystery-art"]').innerHTML = fishIllustration(this.targetFish, { locked: !this.targetFish.boss, mode: this.targetFish.boss ? "full" : "preview" });
    this.currentZoneHeight = config.zoneHeight;
    this.root.querySelector('[data-role="catch-zone"]').style.height = `${this.currentZoneHeight * 100}%`;
    const scene = this.root.querySelector('[data-role="game-scene"]');
    const zone = zoneById(this.zoneId);
    scene.style.setProperty("--game-scene", `url('${this.period === "jour" ? zone.imageJour : zone.imageNuit}')`);
    scene.classList.toggle("is-boss-fight", this.targetFish.boss);
    this.renderBossBars();
    this.lastFrame = performance.now();
    playTone(230, 0.08, "triangle", 0.035);
    playTone(340, 0.09, "triangle", 0.03, 0.07);
    this.raf = requestAnimationFrame((time) => this.tick(time));
  }

  renderBossBars() {
    const target = this.root?.querySelector('[data-role="boss-bars"]');
    if (!target) return;
    if (!this.targetFish?.boss) {
      target.hidden = true;
      target.innerHTML = "";
      return;
    }
    target.hidden = false;
    target.innerHTML = `<span><i class="fas fa-crown"></i> Résistance du boss — phase ${this.bossPhase + 1}/3</span><div>${Array.from({ length: 3 }, (_, index) => {
      const value = index < this.bossPhase ? 100 : index === this.bossPhase ? this.progress * 100 : 0;
      return `<b class="${index < this.bossPhase ? "is-cleared" : index === this.bossPhase ? "is-active" : ""}"><i style="width:${value}%"></i></b>`;
    }).join("")}</div>`;
  }

  goHome() {
    if (!this.root) return;
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.startTimer);
    this.raf = null;
    this.pressed = false;
    this.status = "intro";
    this.targetFish = null;
    this.bossPhase = 0;
    const shell = this.root.querySelector(".lfg-shell");
    shell?.classList.remove("lfg-victory", "lfg-defeat", "lfg-boss-victory", "lfg-boss-arrival");
    this.root.querySelector('[data-role="boss-appearance"]').hidden = true;
    this.root.querySelector(".lfg-game-panel").hidden = true;
    this.root.querySelector(".lfg-result-panel").hidden = true;
    this.root.querySelector(".lfg-intro-panel").hidden = false;
    this.root.querySelector(".lfg-result-panel").classList.remove("is-success", "is-failure", "is-boss-success");
    this.switchView("peche");
    this.renderProfileSummary();
    this.renderHome();
  }

  restart() {
    const panel = this.root.querySelector(".lfg-result-panel");
    const shell = this.root.querySelector(".lfg-shell");
    const retryBoss = this.targetFish?.boss ? this.targetFish : null;
    panel.hidden = true;
    panel.classList.remove("is-success", "is-failure", "is-boss-success");
    shell.classList.remove("lfg-victory", "lfg-defeat", "lfg-boss-victory");
    this.root.querySelector(".lfg-intro-panel").hidden = false;
    this.status = "intro";
    this.targetFish = null;
    this.bossPhase = 0;
    this.renderProfileSummary();
    this.renderHome();
    if (retryBoss) {
      this.zoneId = retryBoss.zoneId;
      this.targetFish = retryBoss;
      this.showBossAppearance();
      return;
    }
    this.start();
  }

  tap() {
    if (this.status !== "playing") return;
    const config = gameConfigFor(this.targetFish, this.bossPhase, this.profile);
    this.playerVelocity = clamp(this.playerVelocity + config.tapImpulse, -0.82, 0.92);
    const now = performance.now();
    if (now - this.lastTap > 55) {
      playTone(190 + Math.random() * 35, 0.045, "sine", 0.018);
      this.createRipple();
      this.lastTap = now;
    }
  }

  createRipple() {
    const button = this.root?.querySelector('[data-action="reel"]');
    if (!button) return;
    const ripple = document.createElement("span");
    ripple.className = "lfg-click-ripple";
    ripple.style.setProperty("--x", `${randomBetween(25, 75)}%`);
    ripple.style.setProperty("--y", `${randomBetween(25, 75)}%`);
    button.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 650);
  }

  consumePrediction() {
    if (!this.predictionReady) return false;
    this.predictionReady = false;
    const lane = this.root?.querySelector('[data-role="lane"]');
    lane?.classList.remove("lfg-prediction-flash");
    if (lane) void lane.offsetWidth;
    lane?.classList.add("lfg-prediction-flash");
    playTone(520, 0.10, "sine", 0.025);
    return true;
  }


  cancelBrutalMove(config) {
    if (this.predictionReady) return this.consumePrediction();
    if (config.anomalyNullifyChance > 0 && Math.random() < config.anomalyNullifyChance) {
      const lane = this.root?.querySelector('[data-role="lane"]');
      lane?.classList.remove("lfg-anomaly-flash");
      if (lane) void lane.offsetWidth;
      lane?.classList.add("lfg-anomaly-flash");
      playTone(700, 0.08, "triangle", 0.02);
      return true;
    }
    return false;
  }

  tick(time) {
    if (this.status !== "playing") return;
    const dt = Math.min((time - this.lastFrame) / 1000, 0.04);
    this.lastFrame = time;
    this.update(dt, time);
    this.renderState();
    if (this.status === "playing") this.raf = requestAnimationFrame((next) => this.tick(next));
  }

  update(dt, time) {
    const config = gameConfigFor(this.targetFish, this.bossPhase, this.profile);
    this.graceRemaining = Math.max(0, this.graceRemaining - dt);
    const inGrace = this.graceRemaining > 0;

    if (!inGrace) {
      this.targetTimer -= dt;
      if (this.targetTimer <= 0) {
        const edgeBias = Math.random();
        this.fishTarget = edgeBias < 0.22 ? randomBetween(0.06, 0.22) : edgeBias > 0.78 ? randomBetween(0.78, 0.94) : randomBetween(0.14, 0.86);
        this.targetTimer = randomBetween(config.targetMin, config.targetMax);
        const burstChance = (this.targetFish.boss ? 0.40 : this.targetFish.difficulte === 5 ? 0.46 : this.targetFish.difficulte >= 4 ? 0.30 : 0.10) * (1 - config.suddenReduction);
        if (Math.random() < burstChance) {
          if (!this.cancelBrutalMove(config)) this.fishVelocity += Math.sign(this.fishTarget - this.fishY) * randomBetween(0.12, this.targetFish.boss ? 0.30 : 0.28);
        }
      }

      const feintChance = (this.targetFish.boss ? 0.24 : 0.10 + this.targetFish.difficulte * 0.035) * (1 - config.suddenReduction) * config.feintScale * dt;
      if (Math.random() < feintChance) {
        if (!this.cancelBrutalMove(config)) this.fishVelocity += randomBetween(-0.24, 0.24) * (this.targetFish.boss ? 1.10 : 0.80 + this.targetFish.difficulte * 0.12);
      }
      const driftChance = (this.targetFish.boss ? 0.14 : 0.05 + this.targetFish.difficulte * 0.02) * config.driftScale * dt;
      if (Math.random() < driftChance) {
        this.fishTarget = clamp(this.fishTarget + randomBetween(-0.22, 0.22), 0.08, 0.92);
      }
      const fishDirection = Math.sign(this.fishTarget - this.fishY);
      this.fishVelocity += fishDirection * config.fishAcceleration * dt;
      this.fishVelocity *= Math.pow(config.fishDrag, dt * 60);
      this.fishVelocity = clamp(this.fishVelocity, -config.fishMaxSpeed, config.fishMaxSpeed);
      this.fishY += this.fishVelocity * dt + Math.sin(time * 0.008) * config.wobble * dt;
    } else {
      this.fishVelocity *= Math.pow(0.82, dt * 60);
      this.fishY += (this.playerY - this.fishY) * Math.min(1, dt * 5.5);
    }

    if (this.fishY <= 0.035 || this.fishY >= 0.965) {
      this.fishY = clamp(this.fishY, 0.035, 0.965);
      this.fishVelocity *= -0.55;
      this.fishTarget = randomBetween(0.18, 0.82);
    }

    if (this.pressed) this.playerVelocity += config.holdLift * dt;
    this.playerVelocity -= config.gravity * dt;
    const preliminaryHalfZone = config.zoneHeight / 2;
    if (!inGrace && config.pursuitAssist > 0 && Math.abs(this.fishY - this.playerY) > preliminaryHalfZone * 0.93) {
      this.playerVelocity += Math.sign(this.fishY - this.playerY) * config.pursuitAssist * dt;
    }
    this.playerVelocity *= Math.pow(0.986, dt * 60);
    this.playerVelocity = clamp(this.playerVelocity, -0.78, 0.88);
    this.playerY += this.playerVelocity * dt;
    const focusZoneScale = config.focusZoneBonus > 0 && this.insideStreak >= 1 ? 1 + config.focusZoneBonus : 1;
    this.currentZoneHeight = clamp(config.zoneHeight * focusZoneScale, config.zoneHeight, 0.52);
    const halfZone = this.currentZoneHeight / 2;
    const minY = halfZone;
    const maxY = 1 - halfZone;
    if (this.playerY <= minY || this.playerY >= maxY) {
      this.playerY = clamp(this.playerY, minY, maxY);
      this.playerVelocity *= -0.28;
    }

    this.inside = Math.abs(this.fishY - this.playerY) <= halfZone * 0.93;
    this.insideStreak = this.inside ? this.insideStreak + dt : 0;
    const focusBonus = config.focusMastery && this.insideStreak >= 1.3 ? 1.18 : 1;
    const finishingBonus = this.progress >= 0.70 ? config.finishingGainScale : 1;
    const recoveryLossScale = this.progress < 0.30 ? config.lowProgressLossScale : 1;
    if (this.inside) this.progress += dt * config.gain * focusBonus * finishingBonus;
    else if (!inGrace) this.progress -= dt * config.loss * recoveryLossScale;
    this.progress = clamp(this.progress, 0, 1);
    if (this.progress >= 1) {
      if (this.targetFish.boss && this.bossPhase < 2) this.advanceBossPhase();
      else this.win();
    } else if (this.progress <= 0) this.lose();
  }

  advanceBossPhase() {
    this.bossPhase += 1;
    const config = gameConfigFor(this.targetFish, this.bossPhase, this.profile);
    this.progress = 0.24 + config.bossPhaseStartBonus;
    this.fishY = this.playerY;
    this.fishVelocity = 0;
    this.fishTarget = this.fishY;
    this.insideStreak = 0;
    this.graceRemaining = 1.45 + config.graceBonus;
    this.targetTimer = this.graceRemaining + randomBetween(config.targetMin, config.targetMax);
    this.currentZoneHeight = config.zoneHeight;
    this.root.querySelector('[data-role="catch-zone"]').style.height = `${this.currentZoneHeight * 100}%`;
    const lane = this.root.querySelector('[data-role="lane"]');
    lane.classList.remove("lfg-boss-phase-burst");
    void lane.offsetWidth;
    lane.classList.add("lfg-boss-phase-burst");
    this.renderBossBars();
    playTone(170, 0.16, "sawtooth", 0.04);
    playTone(260 + this.bossPhase * 80, 0.20, "triangle", 0.04, 0.10);
    ui.notifications?.info(`Le boss entre dans sa phase ${this.bossPhase + 1} !`);
  }

  renderState() {
    const fish = this.root?.querySelector('[data-role="fish"]');
    const zone = this.root?.querySelector('[data-role="catch-zone"]');
    const progress = this.root?.querySelector('[data-role="progress"]');
    const lane = this.root?.querySelector('[data-role="lane"]');
    if (!fish || !zone || !progress || !lane) return;
    fish.style.bottom = `calc(${this.fishY * 100}% - 18px)`;
    fish.style.setProperty("--fish-tilt", `${clamp(-this.fishVelocity * 36, -22, 22)}deg`);
    fish.classList.toggle("is-boss", Boolean(this.targetFish?.boss));
    zone.style.height = `${this.currentZoneHeight * 100}%`;
    zone.style.bottom = `calc(${this.playerY * 100}% - ${zone.offsetHeight / 2}px)`;
    progress.style.height = `${this.progress * 100}%`;
    lane.classList.toggle("is-catching", this.inside);
    lane.classList.toggle("is-missing", !this.inside && this.graceRemaining <= 0);
    lane.classList.toggle("is-grace", this.graceRemaining > 0);
    if (this.targetFish?.boss) this.renderBossBars();
  }

  async win() {
    if (this.status !== "playing") return;
    this.status = "saving";
    cancelAnimationFrame(this.raf);
    this.raf = null;
    const result = rollCatch(this.targetFish, this.period, this.profile);
    try {
      this.profile = await recordCatch(result);
    } catch (error) {
      console.error(`${MODULE_ID} | Impossible d’enregistrer la prise`, error);
      this.status = "save-error";
      ui.notifications?.error("Hameçons & Couronnes : la capture n’a pas pu être enregistrée. Aucun point n’a été ajouté.");
      if (this.root) this.showSaveError(result);
      return;
    }

    this.status = "won";
    lastCatch = { ...result };
    if (result.boss) {
      playTone(260, 0.18, "triangle", 0.045);
      playTone(520, 0.20, "triangle", 0.045, 0.12);
      playTone(780, 0.30, "sine", 0.05, 0.28);
    } else {
      playTone(420, 0.12, "triangle", 0.04);
      playTone(620, 0.14, "triangle", 0.04, 0.10);
      playTone(840, 0.18, "sine", 0.035, 0.21);
    }
    if (this.root) {
      this.showResult(true, result);
      this.renderProfileSummary();
    }
    if (result.trophyUnlocked) {
      const trophy = BOSS_TROPHIES_BY_ID.get(result.trophyId);
      if (trophy) ui.notifications?.info(`Trophée débloqué : ${trophy.name} — ${trophy.effect}`);
    }
    await announceCatch(result);
    Hooks.callAll("lightFishingCaught", result);
    if (result.boss) Hooks.callAll("lightFishingBossCaught", result);
  }

  async lose() {
    if (this.status !== "playing") return;
    this.status = "lost";
    cancelAnimationFrame(this.raf);
    this.raf = null;
    playTone(260, 0.12, "sawtooth", 0.025);
    playTone(170, 0.20, "sawtooth", 0.02, 0.10);
    const hadStreak = this.profile.currentStreak > 0;
    const nextProfile = normalizeProfile(this.profile);
    nextProfile.currentStreak = 0;
    if (this.root) this.showResult(false, null);
    Hooks.callAll("lightFishingEscaped", { fishId: this.targetFish?.id, zoneId: this.zoneId, period: this.period, difficulty: this.targetFish?.difficulte, boss: Boolean(this.targetFish?.boss), userId: game.user.id, userName: game.user.name, timestamp: Date.now() });
    if (hadStreak) {
      try { this.profile = await saveProfile(game.user, nextProfile); }
      catch (error) {
        this.profile = getProfile();
        console.warn(`${MODULE_ID} | Impossible de réinitialiser la série`, error);
        ui.notifications?.warn("La série de captures n’a pas pu être réinitialisée dans le profil.");
      }
      if (this.root) this.renderProfileSummary();
    } else this.profile = nextProfile;
  }

  showSaveError(result) {
    if (!this.root) return;
    this.root.querySelector(".lfg-game-panel").hidden = true;
    const panel = this.root.querySelector(".lfg-result-panel");
    const title = panel?.querySelector('[data-role="result-title"]');
    const body = panel?.querySelector('[data-role="result-body"]');
    if (!panel || !title || !body) return;
    panel.hidden = false;
    panel.classList.remove("is-success", "is-boss-success");
    panel.classList.add("is-failure");
    title.textContent = "Capture non enregistrée";
    const fish = POISSONS_PAR_ID.get(result?.fishId) ?? this.targetFish;
    body.innerHTML = `<div class="lfg-save-error-card">${fishIllustration(fish, { large: true, mode: "preview" })}<p><strong>La prise a bien été remportée, mais Foundry n’a pas pu sauvegarder le profil.</strong></p><span>Aucun score, point de maîtrise ou enregistrement du catalogue n’a été ajouté. Vérifiez vos droits puis relancez la ligne.</span></div>`;
  }

  showResult(success, result) {
    this.root.querySelector(".lfg-game-panel").hidden = true;
    const panel = this.root.querySelector(".lfg-result-panel");
    const title = panel.querySelector('[data-role="result-title"]');
    const body = panel.querySelector('[data-role="result-body"]');
    const shell = this.root.querySelector(".lfg-shell");
    panel.hidden = false;
    panel.classList.toggle("is-success", success);
    panel.classList.toggle("is-failure", !success);
    panel.classList.toggle("is-boss-success", Boolean(success && result?.boss));
    shell.classList.toggle("lfg-victory", success);
    shell.classList.toggle("lfg-defeat", !success);
    shell.classList.toggle("lfg-boss-victory", Boolean(success && result?.boss));

    if (success) {
      const fish = POISSONS_PAR_ID.get(result.fishId);
      const speciesRecord = this.profile.especes[result.fishId];
      title.textContent = result.boss ? "Boss capturé !" : "Poisson attrapé !";
      body.innerHTML = `<div class="lfg-catch-showcase lfg-rarity-border-${rarityClass(result.rarity)}${result.boss ? " is-boss-catch" : ""}"><div class="lfg-catch-art">${fishIllustration(fish, { large: true, mode: "full" })}</div><div class="lfg-catch-info"><div class="lfg-catch-heading"><div class="lfg-catch-name">${escapeHtml(result.name)}</div><span class="lfg-catch-status ${result.isNew ? "is-new" : "is-known"}" title="${result.isNew ? "Nouvelle espèce ajoutée au catalogue" : "Espèce déjà pêchée"}"><i class="fas ${result.isNew ? "fa-star" : "fa-check"}"></i>${result.isNew ? "Nouveauté" : "Déjà pêché"}</span></div>${result.miracle ? `<div class="lfg-miracle-banner"><i class="fas fa-star"></i> Pêche miraculeuse : récompenses doublées !</div>` : ""}${result.trophyUnlocked && BOSS_TROPHIES_BY_ID.get(result.trophyId) ? (() => { const trophy = BOSS_TROPHIES_BY_ID.get(result.trophyId); return `<div class="lfg-trophy-unlock-banner"><i class="fas ${trophy.icon}"></i><div><small>Nouveau trophée débloqué</small><strong>${escapeHtml(trophy.name)}</strong><span>${escapeHtml(trophy.effect)}</span></div></div>`; })() : ""}<div class="lfg-catch-tags">${rarityBadge(result.rarity)}${periodBadge(result.period)}<span><i class="fas fa-map-location-dot"></i>${escapeHtml(result.zone)}</span></div>${difficultyStars(result.difficulty)}<p>${escapeHtml(fish.description)}</p><div class="lfg-result-stats"><span><i class="fas fa-weight-hanging"></i>Poids<strong>${result.weight.toFixed(2)} kg</strong></span><span><i class="fas fa-trophy"></i>Score<strong>+${result.score}</strong></span><span><i class="fas fa-wand-magic-sparkles"></i>Maîtrise<strong>+${result.masteryGain}</strong></span><span><i class="fas fa-ruler-vertical"></i>Record de l’espèce<strong>${speciesRecord.record.toFixed(2)} kg</strong></span></div></div></div>`;
      this.spawnConfetti(result.boss ? 70 : 28, result.boss);
    } else {
      title.textContent = this.targetFish?.boss ? "Le boss s’est échappé…" : "Le poisson s’est échappé…";
      body.innerHTML = `<div class="lfg-escaped-card">${fishIllustration(this.targetFish, { locked: !this.targetFish?.boss, large: true, mode: "full" })}<p>La ligne s’est détendue au pire moment. Reprenez votre souffle et retentez votre chance.</p><span>${escapeHtml(this.targetFish.zone)} · ${escapeHtml(PERIODES[this.period].nom)} · Difficulté ${this.targetFish.difficulte}/5${this.targetFish.boss ? ` · phase ${this.bossPhase + 1}/3` : ""}</span></div>`;
    }
  }

  renderCatalogue() {
    const grid = this.root?.querySelector('[data-role="catalog-grid"]');
    if (!grid) return;
    const discovered = this.profile.especes ?? {};
    const query = this.catalogFilters.search.trim().toLocaleLowerCase("fr");
    const filtered = POISSONS.filter((fish) => {
      const isDiscovered = Boolean(discovered[fish.id]);
      if (this.catalogFilters.zone !== "toutes" && fish.zoneId !== this.catalogFilters.zone) return false;
      if (this.catalogFilters.rarity !== "toutes" && fish.rarete !== this.catalogFilters.rarity) return false;
      if (this.catalogFilters.period !== "toutes") {
        const periodMatches = this.catalogFilters.period === "toujours"
          ? fish.periode === "toujours"
          : fish.periode === this.catalogFilters.period || fish.periode === "toujours";
        if (!periodMatches) return false;
      }
      if (this.catalogFilters.status === "decouverts" && !isDiscovered) return false;
      if (this.catalogFilters.status === "inconnus" && isDiscovered) return false;
      if (query && (!isDiscovered || !`${fish.nom} ${fish.zone}`.toLocaleLowerCase("fr").includes(query))) return false;
      return true;
    });

    grid.innerHTML = filtered.map((fish) => {
      const record = discovered[fish.id];
      const zone = zoneById(fish.zoneId);
      const zoneUnlocked = isZoneUnlocked(this.profile, zone.index);
      const bossUnlocked = !fish.boss || zoneProgress(this.profile, fish.zoneId).complete;
      const locked = !record;
      const mysteryText = !zoneUnlocked ? "Zone verrouillée" : fish.boss && !bossUnlocked ? "Boss encore endormi" : "À découvrir";
      return `<button type="button" class="lfg-catalog-card${locked ? " is-locked" : ""}${fish.boss ? " is-boss-card" : ""} lfg-rarity-card-${rarityClass(fish.rarete)}" data-action="fish-detail" data-fish-id="${fish.id}"><div class="lfg-catalog-art">${fishIllustration(fish, { locked, mode: "preview", useFullSource: !locked })}<span class="lfg-catalog-number">#${String(POISSONS.indexOf(fish) + 1).padStart(3, "0")}</span>${fish.boss ? '<span class="lfg-boss-corner"><i class="fas fa-crown"></i></span>' : ""}${record ? '<span class="lfg-caught-corner" title="Déjà pêché" aria-label="Déjà pêché"><i class="fas fa-check"></i></span>' : ""}</div><div class="lfg-catalog-card-body"><strong>${locked ? (fish.boss && bossUnlocked ? "Boss inconnu" : "Espèce inconnue") : escapeHtml(fish.nom)}</strong><span><i class="fas ${zone.icon}"></i>${escapeHtml(fish.zone)}</span><div>${locked ? `<span class="lfg-lock"><i class="fas fa-lock"></i> ${mysteryText}</span>${periodBadge(fish.periode)}` : `${rarityBadge(fish.rarete)}${periodBadge(fish.periode)}${difficultyStars(fish.difficulte)}<small>${record.nombre} prise${record.nombre > 1 ? "s" : ""} · record ${record.record.toFixed(2)} kg</small>`}</div></div></button>`;
    }).join("") || `<div class="lfg-empty-state"><i class="fas fa-fish"></i><strong>Aucun poisson ne correspond à ces filtres.</strong><span>Ils ont probablement monté un syndicat.</span></div>`;

    const summary = profileSummary(this.profile);
    const ring = this.root.querySelector('[data-role="completion-ring"]');
    ring?.style.setProperty("--completion", `${summary.completion * 3.6}deg`);
    if (ring) ring.querySelector("strong").textContent = `${summary.completion} %`;
  }

  showFishDetail(fishId) {
    const fish = POISSONS_PAR_ID.get(fishId);
    if (!fish) return;
    const detail = this.root.querySelector('[data-role="fish-detail"]');
    const record = this.profile.especes?.[fishId];
    const locked = !record;
    const progress = zoneProgress(this.profile, fish.zoneId);
    detail.hidden = false;
    let mystery = "Cette silhouette n’a pas encore été ajoutée à votre album. Pêchez dans la zone correspondante pour la découvrir.";
    if (!isZoneUnlocked(this.profile, fish.zoneIndex)) mystery = "Cette zone n’est pas encore accessible. Progressez dans la zone précédente pour la débloquer.";
    if (fish.boss && !progress.complete) mystery = `Le boss restera caché jusqu’à ce que les ${progress.total} espèces ordinaires de cette zone aient été découvertes.`;
    detail.innerHTML = `<div class="lfg-detail-backdrop" data-action="close-detail"></div><article class="lfg-detail-card lfg-rarity-border-${rarityClass(fish.rarete)}${fish.boss ? " is-boss-detail" : ""}"><button type="button" data-action="close-detail" class="lfg-detail-close"><i class="fas fa-xmark"></i></button><div class="lfg-detail-art">${fishIllustration(fish, { locked, large: true, mode: "full" })}</div><div class="lfg-detail-content"><span class="lfg-kicker">${escapeHtml(fish.zone)}</span><h3>${locked ? (fish.boss ? "Boss inconnu" : "Espèce inconnue") : escapeHtml(fish.nom)}</h3>${locked ? `<p>${escapeHtml(mystery)}</p><div class="lfg-detail-mystery"><i class="fas fa-lock"></i>Difficulté, rareté et poids inconnus</div>${periodBadge(fish.periode)}` : `${rarityBadge(fish.rarete)} ${periodBadge(fish.periode)} ${difficultyStars(fish.difficulte)}<p>${escapeHtml(fish.description)}</p><dl><div><dt>Poids possible</dt><dd>${fish.min.toFixed(2)} à ${fish.max.toFixed(2)} kg</dd></div><div><dt>Vos captures</dt><dd>${record.nombre}</dd></div><div><dt>Votre record</dt><dd>${record.record.toFixed(2)} kg</dd></div><div><dt>Valeur de base</dt><dd>${fish.pointsBase} points</dd></div>${fish.boss ? `<div><dt>Phases de capture</dt><dd>${fish.phases}</dd></div>` : ""}</dl>`}</div></article>`;
  }

  hideFishDetail() {
    const detail = this.root?.querySelector('[data-role="fish-detail"]');
    if (detail) detail.hidden = true;
  }

  selectTrophy(trophyId) {
    if (!BOSS_TROPHIES_BY_ID.has(trophyId)) return;
    this.selectedTrophyId = trophyId;
    this.hideTalentTooltip();
    this.renderTalents();
  }

  setTalentPanel(panel) {
    this.talentPanel = panel === "trophies" ? "trophies" : "trees";
    this.hideTalentTooltip();
    this.renderTalents();
  }

  renderTalents() {
    const target = this.root?.querySelector('[data-role="talent-trees"]');
    const trophyTarget = this.root?.querySelector('[data-role="trophy-wave"]');
    const wallet = this.root?.querySelector('[data-role="talent-wallet"]');
    const treePanel = this.root?.querySelector('[data-role="talent-tree-panel"]');
    const trophyPanel = this.root?.querySelector('[data-role="trophy-panel"]');
    if (!target || !trophyTarget || !wallet || !treePanel || !trophyPanel) return;

    const available = masteryAvailable(this.profile);
    const spent = masterySpent(this.profile);
    const unlockedTrophies = trophyCount(this.profile);
    wallet.innerHTML = `<span title="Points de maîtrise disponibles"><i class="fas fa-wand-magic-sparkles"></i><strong>${available}</strong><small>disponibles</small></span><span title="Points investis"><i class="fas fa-gem"></i><strong>${spent}</strong><small>investis</small></span><span title="Pouvoirs de boss débloqués"><i class="fas fa-crown"></i><strong>${unlockedTrophies}/${BOSS_TROPHIES.length}</strong><small>trophées</small></span>`;

    this.root.querySelectorAll('[data-action="talent-panel"]').forEach((button) => {
      button.classList.toggle("is-active", button.dataset.panel === this.talentPanel);
      button.setAttribute("aria-selected", button.dataset.panel === this.talentPanel ? "true" : "false");
    });
    const tabCount = this.root.querySelector('[data-role="trophy-tab-count"]');
    if (tabCount) tabCount.textContent = `${unlockedTrophies}/${BOSS_TROPHIES.length}`;
    treePanel.hidden = this.talentPanel !== "trees";
    trophyPanel.hidden = this.talentPanel !== "trophies";

    target.innerHTML = TALENT_TREES.map((tree) => {
      const invested = branchRanks(this.profile, tree.id);
      const nodes = tree.talents.map((talent) => {
        const rank = talentRank(this.profile, talent.id);
        const maxed = rank >= talent.maxRank;
        const unlocked = talentUnlocked(this.profile, { ...talent, treeId: tree.id });
        const cost = maxed ? 0 : talentCost(talent, rank);
        const affordable = available >= cost;
        const disabled = maxed || !unlocked || !affordable;
        const state = maxed ? "is-maxed" : !unlocked ? "is-locked" : affordable ? "is-buyable" : "is-expensive";
        const pips = Array.from({ length: talent.maxRank }, (_, index) => `<i class="${index < rank ? "is-filled" : ""}"></i>`).join("");
        return `<button type="button" class="lfg-talent-node ${state} pos-${talent.position}" data-action="talent-buy" data-talent-id="${talent.id}" aria-label="${escapeHtml(talent.name)}, rang ${rank} sur ${talent.maxRank}" ${disabled ? 'aria-disabled="true"' : ""}><span class="lfg-talent-icon"><i class="fas ${talent.icon}"></i>${!unlocked ? '<b class="fas fa-lock"></b>' : ""}</span><span class="lfg-talent-ranks">${pips}</span>${!maxed && unlocked ? `<em><i class="fas fa-wand-magic-sparkles"></i>${cost}</em>` : ""}</button>`;
      }).join("");
      return `<section class="lfg-talent-tree is-${tree.accent}"><header><span><i class="fas ${tree.icon}"></i></span><div><h4>${escapeHtml(tree.name)}</h4><p>${escapeHtml(tree.summary)}</p></div><strong>${invested}<small>rangs</small></strong></header><div class="lfg-talent-branch"><div class="lfg-talent-lines" aria-hidden="true"></div>${nodes}</div></section>`;
    }).join("");

    const trophyProgress = this.root.querySelector('[data-role="trophy-progress"]');
    if (trophyProgress) trophyProgress.innerHTML = `<i class="fas fa-water"></i> ${unlockedTrophies}/${BOSS_TROPHIES.length} empreintes acquises`;

    if (!BOSS_TROPHIES_BY_ID.has(this.selectedTrophyId)) this.selectedTrophyId = BOSS_TROPHIES[0]?.id ?? null;
    const selectedTrophy = BOSS_TROPHIES_BY_ID.get(this.selectedTrophyId) ?? BOSS_TROPHIES[0];
    const waveOffsets = [0, -8, -14, -8, 0, 8, 14, 8, 0];
    const rows = [BOSS_TROPHIES.slice(0, 9), BOSS_TROPHIES.slice(9, 18)];
    trophyTarget.innerHTML = `<div class="lfg-wave-summary"><span><i class="fas fa-crown"></i><strong>${unlockedTrophies}</strong><small>/ ${BOSS_TROPHIES.length}</small></span><div><strong>La Vague des Trophées</strong><small>Chaque médaillon est indépendant</small></div></div>${rows.map((row, rowIndex) => `<div class="lfg-trophy-wave-row is-row-${rowIndex + 1}"><svg class="lfg-trophy-wave-line" viewBox="0 0 900 80" preserveAspectRatio="none" aria-hidden="true"><path d="M0,40 C100,5 200,5 300,40 S500,75 600,40 S800,5 900,40"/></svg><div class="lfg-trophy-wave-nodes">${row.map((trophy, index) => {
      const unlocked = hasBossTrophy(this.profile, trophy.id);
      const selected = trophy.id === this.selectedTrophyId;
      const zone = zoneById(trophy.zoneId);
      const offset = waveOffsets[index] * (rowIndex === 1 ? -1 : 1);
      return `<button type="button" class="lfg-trophy-node ${unlocked ? "is-unlocked" : "is-locked"}${selected ? " is-selected" : ""}" data-action="trophy-select" data-trophy-id="${trophy.id}" style="--wave-y:${offset}px" aria-pressed="${selected ? "true" : "false"}" aria-label="${escapeHtml(unlocked ? trophy.name : `Trophée verrouillé — ${zone.name}`)}"><span><i class="fas ${unlocked ? trophy.icon : "fa-lock"}"></i></span><small>${escapeHtml(zone.name)}</small>${unlocked ? '<b class="fas fa-check"></b>' : ""}</button>`;
    }).join("")}</div></div>`).join("")}`;

    const trophyDetail = this.root.querySelector('[data-role="trophy-detail"]');
    if (trophyDetail && selectedTrophy) {
      const unlocked = hasBossTrophy(this.profile, selectedTrophy.id);
      const boss = BOSS_PAR_ZONE.get(selectedTrophy.zoneId);
      const zone = zoneById(selectedTrophy.zoneId);
      trophyDetail.innerHTML = unlocked
        ? `<div class="lfg-trophy-detail-head"><span><i class="fas ${selectedTrophy.icon}"></i></span><div><small>${escapeHtml(zone.name)}</small><h4>${escapeHtml(selectedTrophy.name)}</h4></div><em><i class="fas fa-check"></i> Acquis</em></div><p>${escapeHtml(selectedTrophy.lore)}</p><div class="lfg-trophy-detail-effect"><small>Pouvoir permanent</small><strong>${escapeHtml(selectedTrophy.effect)}</strong></div><div class="lfg-trophy-detail-boss"><i class="fas fa-crown"></i><span>Hérité de <strong>${escapeHtml(boss?.nom ?? zone.name)}</strong></span></div>`
        : `<div class="lfg-trophy-detail-head is-locked"><span><i class="fas fa-lock"></i></span><div><small>${escapeHtml(zone.name)}</small><h4>Trophée inconnu</h4></div><em>Verrouillé</em></div><p>Terrassez <strong>${escapeHtml(boss?.nom ?? "le boss de cette zone")}</strong> pour révéler son pouvoir. Aucun autre trophée n’est requis.</p><div class="lfg-trophy-detail-effect is-locked"><small>Condition</small><strong>Vaincre le boss de cette zone</strong></div><div class="lfg-trophy-detail-boss"><i class="fas fa-water"></i><span>Cette empreinte peut être obtenue indépendamment des 17 autres.</span></div>`;
    }
  }

  talentTooltipContent(talent) {
    const rank = talentRank(this.profile, talent.id);
    const maxed = rank >= talent.maxRank;
    const unlocked = talentUnlocked(this.profile, talent);
    const nextRank = Math.min(talent.maxRank, rank + 1);
    const requirement = talent.requires ? TALENTS_BY_ID.get(talent.requires.id) : null;
    const requirementText = !unlocked
      ? `${talent.branchRequired && branchRanks(this.profile, talent.treeId) < talent.branchRequired ? `${talent.branchRequired} rangs requis dans cet arbre` : `${requirement?.name ?? "Talent précédent"} rang ${talent.requires?.rank ?? 1} requis`}`
      : "";
    const cost = maxed ? 0 : talentCost(talent, rank);
    return `<div class="lfg-tooltip-head"><span><i class="fas ${talent.icon}"></i></span><div><strong>${escapeHtml(talent.name)}</strong><small>${escapeHtml(talent.treeName)}</small></div><em>${rank}/${talent.maxRank}</em></div><p>${escapeHtml(talent.description)}</p><div class="lfg-tooltip-effect"><span>Effet actuel</span><strong>${rank ? escapeHtml(talent.effect(rank)) : "Non appris"}</strong></div>${!maxed ? `<div class="lfg-tooltip-effect is-next"><span>Rang suivant</span><strong>${escapeHtml(talent.effect(nextRank))}</strong></div>` : ""}${requirementText ? `<div class="lfg-tooltip-lock"><i class="fas fa-lock"></i>${escapeHtml(requirementText)}</div>` : !maxed ? `<div class="lfg-tooltip-cost"><i class="fas fa-wand-magic-sparkles"></i><strong>${cost}</strong> points de maîtrise</div>` : `<div class="lfg-tooltip-max"><i class="fas fa-crown"></i>Talent au rang maximal</div>`}`;
  }

  trophyTooltipContent(trophy) {
    const unlocked = hasBossTrophy(this.profile, trophy.id);
    const boss = BOSS_PAR_ZONE.get(trophy.zoneId);
    const zone = zoneById(trophy.zoneId);
    if (!unlocked) {
      return `<div class="lfg-tooltip-head"><span><i class="fas fa-lock"></i></span><div><strong>Trophée inconnu</strong><small>${escapeHtml(zone.name)}</small></div><em>Verrouillé</em></div><p>Terrassez <strong>${escapeHtml(boss?.nom ?? "le boss de cette zone")}</strong> pour révéler ce pouvoir. Aucun autre trophée n’est requis.</p><div class="lfg-tooltip-lock"><i class="fas fa-crown"></i>Victoire contre ce boss requise</div>`;
    }
    return `<div class="lfg-tooltip-head is-trophy"><span><i class="fas ${trophy.icon}"></i></span><div><strong>${escapeHtml(trophy.name)}</strong><small>${escapeHtml(boss?.nom ?? zone.name)}</small></div><em>Acquis</em></div><p>${escapeHtml(trophy.lore)}</p><div class="lfg-tooltip-effect is-trophy"><span>Pouvoir permanent</span><strong>${escapeHtml(trophy.effect)}</strong></div><div class="lfg-tooltip-max"><i class="fas fa-crown"></i>Actif automatiquement sur ce profil</div>`;
  }

  showTalentTooltip(node) {
    const talent = TALENTS_BY_ID.get(node?.dataset?.talentId);
    const trophy = BOSS_TROPHIES_BY_ID.get(node?.dataset?.trophyId);
    const tooltip = this.root?.querySelector('[data-role="talent-tooltip"]');
    if ((!talent && !trophy) || !tooltip) return;
    tooltip.innerHTML = trophy ? this.trophyTooltipContent(trophy) : this.talentTooltipContent(talent);
    tooltip.hidden = false;
    tooltip.style.left = "0px";
    tooltip.style.top = "0px";
    const rect = node.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const margin = 12;
    let left = rect.right + margin;
    if (left + tooltipRect.width > window.innerWidth - margin) left = rect.left - tooltipRect.width - margin;
    left = clamp(left, margin, window.innerWidth - tooltipRect.width - margin);
    let top = rect.top + rect.height / 2 - tooltipRect.height / 2;
    top = clamp(top, margin, window.innerHeight - tooltipRect.height - margin);
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  hideTalentTooltip() {
    const tooltip = this.root?.querySelector('[data-role="talent-tooltip"]');
    if (tooltip) tooltip.hidden = true;
  }

  showInternalConfirm({ title, content, confirmLabel = "Confirmer", cancelLabel = "Annuler", danger = false }) {
    const overlay = this.root?.querySelector('[data-role="confirm-overlay"]');
    if (!overlay) return Promise.resolve(false);

    // Résout d’abord une éventuelle ancienne confirmation. Son résolveur masque
    // l’overlay ; l’ordre inverse rendait parfois la nouvelle fenêtre invisible.
    this.pendingConfirmResolver?.(false);
    overlay.querySelector('[data-role="confirm-title"]').textContent = title ?? "Confirmation";
    overlay.querySelector('[data-role="confirm-body"]').innerHTML = content ?? "";
    const cancelButton = overlay.querySelector('.lfg-confirm-actions [data-action="confirm-cancel"]');
    const confirmButton = overlay.querySelector('.lfg-confirm-actions [data-action="confirm-accept"]');
    if (cancelButton) cancelButton.textContent = cancelLabel;
    if (confirmButton) {
      confirmButton.textContent = confirmLabel;
      confirmButton.classList.toggle('danger', Boolean(danger));
    }
    overlay.hidden = false;
    return new Promise((resolve) => {
      this.pendingConfirmResolver = (value) => {
        overlay.hidden = true;
        this.pendingConfirmResolver = null;
        resolve(Boolean(value));
      };
    });
  }

  resolveInternalConfirm(value) {
    if (typeof this.pendingConfirmResolver === 'function') this.pendingConfirmResolver(Boolean(value));
  }

  async buyTalent(talentId) {
    if (this.pendingTalentSave) return;
    const talent = TALENTS_BY_ID.get(talentId);
    if (!talent) return;
    const rank = talentRank(this.profile, talentId);
    if (rank >= talent.maxRank) return;
    if (!talentUnlocked(this.profile, talent)) {
      ui.notifications?.warn("Ce talent n’est pas encore accessible.");
      return;
    }
    const cost = talentCost(talent, rank);
    if (masteryAvailable(this.profile) < cost) {
      ui.notifications?.warn("Vous n’avez pas assez de points de maîtrise.");
      return;
    }
    const previousTalents = { ...this.profile.talents };
    this.profile.talents[talentId] = rank + 1;
    this.pendingTalentSave = true;
    try {
      this.profile = await saveProfile(game.user, this.profile);
      playTone(620, 0.10, "triangle", 0.035);
      playTone(820, 0.14, "sine", 0.03, 0.08);
      this.hideTalentTooltip();
      this.renderTalents();
      this.renderProfileSummary();
      ui.notifications?.info(`${talent.name} passe au rang ${rank + 1}.`);
    } catch (error) {
      this.profile.talents = previousTalents;
      console.error(`${MODULE_ID} | Achat de talent impossible`, error);
      ui.notifications?.error("Le talent n’a pas pu être enregistré.");
    } finally {
      this.pendingTalentSave = false;
    }
  }

  async resetTalents() {
    if (this.pendingTalentSave) return;
    const spent = masterySpent(this.profile);
    if (!spent) {
      ui.notifications?.info("Aucun talent n’a encore été acheté.");
      return;
    }
    const confirmed = await confirmResetDialog({
      title: "Réinitialiser les talents",
      content: `<p>Réinitialiser tous vos talents et récupérer <strong>${spent} points de maîtrise</strong> ? Votre score et votre catalogue ne seront pas modifiés.</p>`,
      confirmLabel: "Réinitialiser",
      cancelLabel: "Retour",
      danger: true
    });
    if (!confirmed) return;
    const previousTalents = { ...this.profile.talents };
    this.profile.talents = {};
    this.pendingTalentSave = true;
    try {
      this.profile = await saveProfile(game.user, this.profile);
      this.hideTalentTooltip();
      this.renderTalents();
      this.renderProfileSummary();
      ui.notifications?.info(`${spent} points de maîtrise ont été remboursés.`);
    } catch (error) {
      this.profile.talents = previousTalents;
      console.error(`${MODULE_ID} | Réinitialisation des talents impossible`, error);
      ui.notifications?.error("Impossible de réinitialiser les talents.");
    } finally {
      this.pendingTalentSave = false;
    }
  }

  renderLeaderboard() {
    const target = this.root?.querySelector('[data-role="leaderboard"]');
    if (!target) return;
    const rows = leaderboardRows();
    target.innerHTML = `<div class="lfg-podium">${rows.slice(0, 3).map((row, index) => `<div class="lfg-podium-place place-${index + 1}"><div class="lfg-medal"><i class="fas fa-${index === 0 ? "crown" : "medal"}"></i></div><strong>${escapeHtml(row.user.name)}</strong><span>${row.score} pts</span><small>${row.unique} espèces · ${row.bosses} boss</small></div>`).join("")}</div><div class="lfg-ranking-table"><div class="lfg-ranking-head"><span>Rang</span><span>Pêcheur</span><span>Score</span><span>Prises</span><span>Album</span><span>Boss</span><span>Record</span></div>${rows.map((row, index) => `<div class="lfg-ranking-row${row.user.id === game.user.id ? " is-me" : ""}"><span class="lfg-rank">${index + 1}</span><span class="lfg-player"><i class="fas fa-user"></i><strong>${escapeHtml(row.user.name)}</strong>${row.user.isGM ? "<em>MJ</em>" : ""}</span><span><strong>${row.score}</strong> pts</span><span>${row.total}</span><span>${row.unique}/${POISSONS.length}</span><span>${row.bosses}/${ZONES.length}</span><span>${row.record ? `${row.record.weight.toFixed(2)} kg<small>${escapeHtml(row.record.name)}</small>` : "—"}</span></div>`).join("")}</div>`;
  }


  renderAdmin() {
    const target = this.root?.querySelector('[data-role="admin-panel"]');
    if (!target || !game.user?.isGM) return;
    const users = game.users.contents;
    const selected = users.find((user) => user.id === this.adminSelection) ?? users[0] ?? game.user;
    this.adminSelection = selected?.id ?? "";
    const profile = getProfile(selected);
    const summary = profileSummary(profile);
    target.innerHTML = `<div class="lfg-admin-toolbar">
      <label><span>Profil ciblé</span><select data-admin-select="user">${users.map((user) => `<option value="${user.id}" ${user.id === this.adminSelection ? "selected" : ""}>${escapeHtml(user.name)}${user.isGM ? " (MJ)" : ""}</option>`).join("")}</select></label>
      <button type="button" class="lfg-secondary" data-action="admin-refresh"><i class="fas fa-rotate"></i> Rafraîchir</button>
    </div>
    <div class="lfg-admin-stats">
      <span><strong>${summary.score}</strong><small>score</small></span>
      <span><strong>${summary.mastery}</strong><small>maîtrise disponible</small></span>
      <span><strong>${summary.total}</strong><small>prises</small></span>
      <span><strong>${summary.unique}/${POISSONS.length}</strong><small>espèces</small></span>
      <span><strong>${summary.bosses}/${ZONES.length}</strong><small>boss</small></span>
    </div>
    <div class="lfg-admin-grid">
      <section class="lfg-admin-card">
        <h4>Gérer les points</h4>
        <p>Modifiez le score de classement ou le capital de maîtrise gagné.</p>
        <label><span>Ressource</span><select data-role="admin-resource"><option value="score">Score de classement</option><option value="mastery">Points de maîtrise gagnés</option></select></label>
        <label><span>Montant</span><input type="number" data-role="admin-points-value" value="100" step="1"></label>
        <div class="lfg-admin-actions">
          <button type="button" class="lfg-primary" data-action="admin-points" data-mode="add">Ajouter</button>
          <button type="button" class="lfg-secondary" data-action="admin-points" data-mode="remove">Retirer</button>
          <button type="button" class="lfg-secondary" data-action="admin-points" data-mode="set">Définir</button>
        </div>
      </section>
      <section class="lfg-admin-card">
        <h4>Réinitialisation</h4>
        <p>Réinitialisez le profil ciblé ou tous les profils de pêche du monde.</p>
        <div class="lfg-admin-actions lfg-admin-actions-stack">
          <button type="button" class="lfg-secondary" data-action="admin-reset" data-scope="selected">Réinitialiser ce profil</button>
          <button type="button" class="lfg-secondary danger" data-action="admin-reset" data-scope="all">Réinitialiser tous les profils</button>
        </div>
      </section>
    </div>`;
  }

  async adjustAdminPoints(mode = "add") {
    if (!game.user?.isGM || this.pendingAdminAction) return;
    const user = game.users.get(this.adminSelection);
    if (!user) {
      ui.notifications?.error("Le profil ciblé est introuvable.");
      return;
    }

    this.pendingAdminAction = true;
    try {
      const input = this.root?.querySelector('[data-role="admin-points-value"]');
      const amount = Math.round(Number(input?.value) || 0);
      const profile = getProfile(user);
      const resource = this.root?.querySelector('[data-role="admin-resource"]')?.value === "mastery" ? "masteryEarned" : "score";
      const minimum = resource === "masteryEarned" ? masterySpent(profile) : 0;
      if (mode === "set") profile[resource] = Math.max(minimum, amount);
      if (mode === "add") profile[resource] = Math.max(minimum, (Number(profile[resource]) || 0) + Math.max(0, amount));
      if (mode === "remove") profile[resource] = Math.max(minimum, (Number(profile[resource]) || 0) - Math.max(0, amount));
      await saveProfile(user, profile);
      ui.notifications?.info(`Profil de ${user.name} mis à jour.`);
      this.refreshAfterAdminChange();
    } catch (error) {
      console.error(`${MODULE_ID} | Échec de la modification des points`, error);
      ui.notifications?.error(`Impossible de modifier les points : ${error.message ?? error}`);
    } finally {
      this.pendingAdminAction = false;
    }
  }

  async resetAdminProfile(scope = "selected") {
    if (!game.user?.isGM || this.pendingAdminAction) return;
    this.pendingAdminAction = true;

    try {
      if (scope === "all") {
        const confirmed = await confirmResetDialog({
          title: "Réinitialiser tous les profils",
          content: "<p>Voulez-vous vraiment effacer les profils de pêche de tous les joueurs ? Cette action est irréversible.</p>",
          confirmLabel: "Tout réinitialiser",
          cancelLabel: "Annuler",
          danger: true
        });
        if (!confirmed) return;

        const results = await Promise.allSettled(game.users.contents.map((user) => resetProfile(user)));
        const failures = results
          .map((result, index) => ({ result, user: game.users.contents[index] }))
          .filter(({ result }) => result.status === "rejected");

        if (failures.length) {
          failures.forEach(({ result, user }) => console.error(`${MODULE_ID} | Échec du reset pour ${user.name}`, result.reason));
          throw new Error(`${failures.length} profil${failures.length > 1 ? "s" : ""} n’ont pas pu être réinitialisés.`);
        }
        lastCatch = null;
        ui.notifications?.warn("Tous les profils de pêche ont été réinitialisés.");
      } else {
        const user = game.users.get(this.adminSelection);
        if (!user) throw new Error("Le profil ciblé est introuvable.");
        const confirmed = await confirmResetDialog({
          title: "Réinitialiser un profil",
          content: `<p>Effacer le profil de pêche de <strong>${escapeHtml(user.name)}</strong> ? Cette action est irréversible.</p>`,
          confirmLabel: "Réinitialiser",
          cancelLabel: "Annuler",
          danger: true
        });
        if (!confirmed) return;
        await resetProfile(user);
        if (user.id === game.user.id) lastCatch = null;
        ui.notifications?.warn(`Le profil de pêche de ${user.name} a été réinitialisé.`);
      }

      this.refreshAfterAdminChange();
      Hooks.callAll(`${MODULE_ID}.profileReset`, { scope, userId: scope === "selected" ? this.adminSelection : null });
    } catch (error) {
      console.error(`${MODULE_ID} | Échec de la réinitialisation des profils`, error);
      ui.notifications?.error(`Réinitialisation impossible : ${error.message ?? error}`);
    } finally {
      this.pendingAdminAction = false;
    }
  }

  refreshAfterAdminChange() {
    this.profile = getProfile();
    this.renderAdmin();
    this.renderLeaderboard();
    this.renderProfileSummary();
    if (this.currentView === "peche") this.renderHome();
    if (this.currentView === "catalogue") this.renderCatalogue();
    if (this.currentView === "talents") this.renderTalents();
  }

  spawnConfetti(count = 28, boss = false) {
    const shell = this.root?.querySelector(".lfg-shell");
    if (!shell) return;
    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement("i");
      particle.className = `lfg-confetti${boss ? " is-boss" : ""}`;
      particle.style.setProperty("--left", `${randomBetween(4, 96)}%`);
      particle.style.setProperty("--delay", `${randomBetween(0, 0.75)}s`);
      particle.style.setProperty("--drift", `${randomBetween(-150, 150)}px`);
      particle.style.setProperty("--spin", `${randomBetween(180, 980)}deg`);
      shell.appendChild(particle);
      window.setTimeout(() => particle.remove(), boss ? 3000 : 2200);
    }
  }

  close() {
    if (!this.root) {
      if (activeGame === this) activeGame = null;
      return;
    }
    this.resolveInternalConfirm(false);
    this.status = "closed";
    this.pressed = false;
    cancelAnimationFrame(this.raf);
    window.clearTimeout(this.startTimer);
    this.raf = null;
    this.abortController.abort();
    const root = this.root;
    root.classList.remove("is-open");
    window.setTimeout(() => root.remove(), 180);
    this.root = null;
    if (activeGame === this) activeGame = null;
  }
}

function openFishingGame(options = {}) {
  activeGame?.close();
  activeGame = new FishingGame(options);
  activeGame.open();
  return activeGame;
}

function readLauncherPosition() {
  try {
    const raw = setting("launcherPosition", "");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Number.isFinite(parsed?.left) || !Number.isFinite(parsed?.top)) return null;
    return { left: parsed.left, top: parsed.top };
  } catch (_error) {
    return null;
  }
}

function applyLauncherPosition(button, position = readLauncherPosition()) {
  if (!button || !position) return;
  const margin = 8;
  const width = button.offsetWidth || 48;
  const height = button.offsetHeight || 48;
  const left = clamp(position.left, margin, Math.max(margin, window.innerWidth - width - margin));
  const top = clamp(position.top, margin, Math.max(margin, window.innerHeight - height - margin));
  button.style.left = `${left}px`;
  button.style.top = `${top}px`;
  button.style.right = "auto";
  button.style.bottom = "auto";
}

function makeLauncherDraggable(button) {
  launcherAbortController?.abort();
  launcherAbortController = new AbortController();
  const signal = launcherAbortController.signal;
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startY = 0;
  let originLeft = 0;
  let originTop = 0;
  let suppressClick = false;

  button.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const rect = button.getBoundingClientRect();
    dragging = true;
    moved = false;
    startX = event.clientX;
    startY = event.clientY;
    originLeft = rect.left;
    originTop = rect.top;
    button.setPointerCapture?.(event.pointerId);
    button.classList.add("is-dragging");
  }, { signal });

  button.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!moved && Math.hypot(dx, dy) < 5) return;
    moved = true;
    event.preventDefault();
    applyLauncherPosition(button, { left: originLeft + dx, top: originTop + dy });
  }, { signal });

  const finishDrag = async (event) => {
    if (!dragging) return;
    dragging = false;
    button.releasePointerCapture?.(event.pointerId);
    button.classList.remove("is-dragging");
    if (!moved) return;
    suppressClick = true;
    const rect = button.getBoundingClientRect();
    try {
      await game.settings.set(MODULE_ID, "launcherPosition", JSON.stringify({ left: Math.round(rect.left), top: Math.round(rect.top) }));
    } catch (error) {
      console.warn(`${MODULE_ID} | Impossible d’enregistrer la position du bouton`, error);
    }
    window.setTimeout(() => { suppressClick = false; }, 80);
  };

  button.addEventListener("pointerup", finishDrag, { signal });
  button.addEventListener("pointercancel", finishDrag, { signal });
  button.addEventListener("click", (event) => {
    if (suppressClick) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    openFishingGame();
  }, { signal });

  window.addEventListener("resize", () => applyLauncherPosition(button), { signal });
}

function ensureLauncher() {
  const existing = document.querySelector("#lfg-launcher");
  const enabled = setting("showLauncher", true);
  if (!enabled) {
    launcherAbortController?.abort();
    launcherAbortController = null;
    existing?.remove();
    return;
  }
  if (existing) {
    applyLauncherPosition(existing);
    if (!launcherAbortController || launcherAbortController.signal.aborted) makeLauncherDraggable(existing);
    return;
  }
  const button = document.createElement("button");
  button.id = "lfg-launcher";
  button.type = "button";
  button.className = "lfg-launcher";
  button.title = "Ouvrir Hameçons & Couronnes — faites glisser pour déplacer";
  button.setAttribute("aria-label", "Ouvrir Hameçons & Couronnes. Bouton déplaçable.");
  button.innerHTML = '<span class="lfg-launcher-wave"></span><i class="fas fa-fish-fins"></i>';
  document.body.appendChild(button);
  applyLauncherPosition(button);
  makeLauncherDraggable(button);
}

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "showLauncher", {
    name: "Afficher le bouton de pêche",
    hint: "Affiche un petit bouton flottant permettant d’ouvrir Hameçons & Couronnes.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: ensureLauncher
  });
  game.settings.register(MODULE_ID, "launcherPosition", {
    name: "Position du bouton de pêche",
    hint: "Position mémorisée du bouton flottant pour ce navigateur.",
    scope: "client",
    config: false,
    type: String,
    default: ""
  });
  game.settings.register(MODULE_ID, "chatResults", {
    name: "Publier les prises dans le chat",
    hint: "Annonce les poissons et les boss capturés dans le chat de Foundry.",
    scope: "world",
    config: true,
    restricted: true,
    type: Boolean,
    default: true
  });
  game.settings.register(MODULE_ID, "sound", {
    name: "Activer les sons",
    hint: "Joue de petits sons synthétiques sans ajouter de fichiers audio lourds au module.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });
  game.settings.register(MODULE_ID, "defaultZone", {
    name: "Zone de pêche par défaut",
    hint: "Zone présélectionnée lors de l’ouverture du mini-jeu, si elle a été débloquée.",
    scope: "client",
    config: true,
    type: String,
    choices: Object.fromEntries(ZONES.map((zone) => [zone.id, zone.name])),
    default: ZONES[0].id
  });
  game.settings.register(MODULE_ID, "defaultPeriod", {
    name: "Période de pêche par défaut",
    hint: "Utilise automatiquement l’heure locale, ou force toujours l’écran de jour ou de nuit.",
    scope: "client",
    config: true,
    type: String,
    choices: { auto: "Automatique selon l’heure", jour: "Jour", nuit: "Nuit" },
    default: "auto"
  });
});

Hooks.on("updateUser", (user) => {
  if (!activeGame?.root) return;
  if (user.id === game.user.id) {
    activeGame.profile = getProfile();
    activeGame.renderProfileSummary();
    if (activeGame.currentView === "peche" && activeGame.status === "intro") activeGame.renderHome();
    if (activeGame.currentView === "catalogue") activeGame.renderCatalogue();
    if (activeGame.currentView === "talents") activeGame.renderTalents();
  }
  if (activeGame.currentView === "classement") activeGame.renderLeaderboard();
  if (activeGame.currentView === "admin" && game.user?.isGM) activeGame.renderAdmin();
});

Hooks.once("ready", () => {
  const module = game.modules.get(MODULE_ID);
  if (module) {
    module.api = {
      open: openFishingGame,
      close: () => activeGame?.close(),
      openCatalogue: () => openFishingGame({ view: "catalogue" }),
      openTalents: () => openFishingGame({ view: "talents" }),
      openTrophies: () => {
        const instance = openFishingGame({ view: "talents" });
        instance.talentPanel = "trophies";
        instance.renderTalents();
        return instance;
      },
      openLeaderboard: () => openFishingGame({ view: "classement" }),
      getLastCatch: () => lastCatch ? { ...lastCatch } : null,
      getProfile: () => clone(getProfile()),
      getTalents: () => {
        const profile = getProfile();
        return {
          available: masteryAvailable(profile),
          spent: masterySpent(profile),
          trees: TALENT_TREES.map((tree) => ({
            id: tree.id,
            name: tree.name,
            ranks: branchRanks(profile, tree.id),
            talents: tree.talents.map((talent) => ({ id: talent.id, name: talent.name, rank: talentRank(profile, talent.id), maxRank: talent.maxRank }))
          }))
        };
      },
      getTrophies: () => {
        const profile = getProfile();
        return BOSS_TROPHIES.map((trophy) => ({
          id: trophy.id,
          zoneId: trophy.zoneId,
          name: trophy.name,
          effect: trophy.effect,
          unlocked: hasBossTrophy(profile, trophy.id)
        }));
      },
      getZoneProgress: (zoneId) => clone(zoneProgress(getProfile(), zoneId)),
      resetProfile: async (userId = game.user.id) => {
        if (!game.user?.isGM) throw new Error("Réservé au MJ.");
        const user = game.users.get(userId);
        await resetProfile(user);
        if (user?.id === game.user.id) lastCatch = null;
        return clone(getProfile(user));
      },
      fish: clone(POISSONS),
      zones: clone(ZONES),
      habitats: clone(HABITATS)
    };
  }
  ensureLauncher();
  void diagnoseIllustrationAssets();
  console.log(`${MODULE_ID} | Hameçons & Couronnes v${module?.version ?? ASSET_CACHE_VERSION} prêt : ${POISSONS.length} espèces, ${ZONES.length} zones et ${ZONES.length} boss chargés.`);
});
