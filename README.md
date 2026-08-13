# 🎣 Hameçons & Couronnes

Mini-jeu de pêche complet en français pour **Foundry VTT 14**.

## Version 1.0.0 — première release publique stable

Cette version publique reprend l’ensemble des correctifs et contenus validés pendant les versions de développement 1.3.x :

- 18 zones progressives inspirées de Kingmaker ;
- 144 poissons d’eau douce, dont 18 boss ;
- cycles jour/nuit, catalogue, classement et trois arbres de talents ;
- illustrations intégrales dans le catalogue, les captures, les échecs et les combats de boss ;
- difficultés différenciées selon la rareté et la progression des zones ;
- profils réparés et migrés automatiquement ;
- manifeste GitHub compatible avec l’installation par URL et The Forge.

> Les numéros 1.3.x correspondaient aux builds internes de développement. La première version publique stable est publiée sous le numéro 1.0.0.

## Installation par manifeste

Dans Foundry VTT, ouvrez **Add-on Modules**, puis **Install Module** et collez :

```text
https://raw.githubusercontent.com/Saurusius/hamecons-et-couronnes/main/module.json
```

## Installation manuelle

Téléchargez le ZIP de la release GitHub et extrayez son contenu dans :

```text
FoundryVTT/Data/modules/light-fishing-minigame/
```

Le fichier `module.json` doit se trouver directement dans ce dossier.



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

Ouvrir le classement :

```js
game.modules.get("light-fishing-minigame").api.openLeaderboard();
```

## Données et migration

Les prises, talents et progressions sont enregistrés dans les flags du profil Foundry de chaque joueur. La version 1.3.5 normalise automatiquement les anciennes données : nombres stockés sous forme de texte, espèces retirées, talents obsolètes et records incomplets ne bloquent plus l’interface.

## Bouton flottant

Le bouton d’ouverture peut être déplacé par glisser-déposer. Sa position est mémorisée séparément pour chaque joueur et chaque navigateur.

## Historique des builds de développement

## Mise à jour 1.3.9

- Le visuel du boss dans la bannière de combat est désormais correctement contenu dans son cadre sans déborder sur les lignes.
- Les difficultés des poissons sont normalisées par rareté : Commun 1, Peu commun 2, Rare 3, Épique 4, Légendaire 5, Boss 5.
- La progression des zones continue d'augmenter la difficulté réelle du mini-jeu grâce à l'échelle par zone déjà utilisée en jeu.

## Mise à jour 1.3.8

- Les illustrations des boss utilisent désormais la planche complète dans l'apparition et sur l'écran d'échec.
- Le bouton **Relancer la ligne** relance désormais correctement un affrontement de boss au lieu de partir sur une prise normale.

## Mise à jour 1.3.7

- Les vignettes du catalogue utilisent désormais la planche complète pour éviter les poissons tronqués.
- Les images affichées lorsqu’un poisson ou un boss s’échappe utilisent aussi l’illustration complète.
- La vitesse de progression de capture a été réduite de 50 % pour rendre la barre moins nerveuse.

## Mise à jour 1.3.6

- Reconstruction du rendu des illustrations avec des classes isolées des styles de Foundry.
- Résolution des chemins via la route active de Foundry, y compris derrière un préfixe ou un proxy.
- Renouvellement forcé du cache des images.
- Repli automatique de la miniature vers l’illustration complète en cas d’échec.
- État d’erreur visible au lieu d’une zone vide.
- Correction du contrôle de déploiement local : le dossier attendu est `assets/fish-preview`.

## Historique des builds de développement


