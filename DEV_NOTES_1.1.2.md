# Hameçons & Couronnes — 1.1.2

## Stabilisation

- sérialisation des écritures de profil par utilisateur pour éviter les collisions de sauvegarde côté client ;
- captures enregistrées via une mutation appliquée au profil le plus récent au moment de l'écriture ;
- version du schéma de profil centralisée ;
- commentaire de migration corrigé : le schéma v6 n'est plus présenté comme une migration 1.2.x ;
- cache des illustrations identifié en 1.1.2-dev ;
- manifeste et installateur local marqués explicitement comme version de développement ;
- aucun ZIP de release stable n'est référencé par le manifeste de développement.

## Compatibilité

- Foundry VTT 14 ;
- vérifié jusqu'à 14.365 ;
- données de profils existantes conservées par la normalisation/migration actuelle.

## À valider avant 1.1.2 stable

- capture normale et boss ;
- achat et reset de talents ;
- modification de points via l'administration MJ ;
- reset individuel et global ;
- catalogue, classement et launcher ;
- chargement des 144 illustrations et miniatures.
