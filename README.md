# 🎣 Hameçons & Couronnes

**Hameçons & Couronnes** est un mini-jeu de pêche complet en français pour **Foundry VTT 14**.

> **Pêchez. Explorez. Affrontez les monstres des eaux.**

## Version 1.1.2 — Stabilisation

La 1.1.2 conserve le gameplay de la 1.1.1 et renforce la stabilité des profils et des sauvegardes.

La version comprend notamment :

- **18 zones** progressives inspirées de Kingmaker ;
- **144 poissons d’eau douce**, dont **18 boss** ;
- alternance **jour / nuit** ;
- catalogue, records et classement ;
- trois arbres de talents ;
- **La Vague des Trophées**, avec 18 pouvoirs permanents indépendants débloqués par les boss ;
- boss en trois phases rééquilibrés ;
- difficulté différenciée selon la rareté et la progression des zones ;
- illustrations intégrales des poissons et placeholder enluminé pour les espèces inconnues ;
- migration automatique des anciens profils.

### La Vague des Trophées

Chaque boss possède son propre trophée. Les trophées sont **indépendants** : il n'est pas nécessaire de vaincre les boss dans un ordre précis.

Lorsqu'un boss est vaincu pour la première fois, son pouvoir permanent est débloqué. Les anciens profils récupèrent automatiquement les trophées correspondant aux boss déjà vaincus.

L'interface 1.1.1 remplace le sphérier circulaire par **deux vagues de neuf trophées**, accompagnées d'un panneau de détail lisible.

## 📦 Installation

### Méthode recommandée — depuis Foundry VTT

Dans **Modules complémentaires**, choisissez **Installer un module**, puis collez cette adresse dans le champ **URL du manifeste** :

```text
https://github.com/Saurusius/hamecons-et-couronnes/releases/latest/download/module.json
```

Foundry téléchargera automatiquement le ZIP correspondant à la dernière version stable publiée. Cette méthode permet également à Foundry de **détecter les futures mises à jour du module**.

### Installation manuelle

La dernière release est toujours disponible ici :

```text
https://github.com/Saurusius/hamecons-et-couronnes/releases/latest
```

Téléchargez le fichier `hamecons-et-couronnes-vX.Y.Z.zip`, puis extrayez son contenu dans :

```text
FoundryVTT/Data/modules/light-fishing-minigame/
```

Le fichier `module.json` doit se trouver directement dans ce dossier. Relancez ensuite Foundry VTT et activez **Hameçons & Couronnes** dans votre monde.

## Macros et API

Ouvrir le module :

```js
game.modules.get("light-fishing-minigame").api.open();
```

Ouvrir directement le catalogue :

```js
game.modules.get("light-fishing-minigame").api.openCatalogue();
```

Ouvrir les talents :

```js
game.modules.get("light-fishing-minigame").api.openTalents();
```

Ouvrir directement La Vague des Trophées :

```js
game.modules.get("light-fishing-minigame").api.openTrophies();
```

Lire les trophées du profil :

```js
game.modules.get("light-fishing-minigame").api.getTrophies();
```

Ouvrir le classement :

```js
game.modules.get("light-fishing-minigame").api.openLeaderboard();
```

## Données et migration

Les prises, records, talents et trophées sont enregistrés dans les flags du profil Foundry de chaque joueur. La migration de la 1.1.x conserve les données existantes et débloque rétroactivement les trophées des boss déjà capturés.

## Bouton flottant

Le bouton d’ouverture peut être déplacé par glisser-déposer. Sa position est mémorisée séparément pour chaque joueur et chaque navigateur.

## Releases

Chaque version publique possède une release GitHub contenant son ZIP installable et son `module.json`. Le manifeste stable `releases/latest/download/module.json` pointe toujours vers la dernière release publiée et permet les mises à jour automatiques dans Foundry.

Les notes détaillées sont disponibles dans les fichiers `RELEASE_NOTES_*.md` et sur la page **Releases** du dépôt.

## Licence

MIT — voir `LICENSE`.
