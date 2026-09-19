# Workflow Git — Hameçons & Couronnes

Le dépôt suit le modèle de travail de Ravel :

- `master` : branche stable / production. Aucun développement direct dessus.
- `dev` : branche d'intégration permanente. Toutes les corrections et fonctionnalités validées y arrivent.
- `feature/*` : nouvelles fonctionnalités, créées depuis `dev`, puis fusionnées vers `dev`.
- `fix/*` : corrections, créées depuis `dev`, puis fusionnées vers `dev`.

## Convention de commits

Les commits utilisent un préfixe court et explicite :

- `feat:` nouvelle fonctionnalité ;
- `fix:` correction de bug ;
- `data:` contenu / données de jeu ;
- `ui:` interface ou présentation ;
- `docs:` documentation ;
- `ci:` GitHub Actions / automatisation ;
- `refactor:` restructuration sans changement fonctionnel ;
- `chore:` maintenance technique ;
- `release:` préparation ou publication d'une version.

Un scope optionnel est accepté, par exemple :
`feat(fishing): add legendary catch animation`

Exemples :
`fix: prevent duplicate fish rewards`
`data: rebalance Glenebon boss weights`
`ci: expose dev to master promotion action`

Les commits de merge générés par GitHub sont acceptés automatiquement.

## Publication

L'action **Promote dev to master** est déclenchée manuellement depuis GitHub Actions.

Elle :
1. valide le manifeste ;
2. vérifie la syntaxe JavaScript ;
3. contrôle les données essentielles (18 zones, 144 poissons, IDs uniques, un boss par zone) ;
4. refuse la publication si `master` a divergé ;
5. avance `master` exactement sur le commit validé de `dev`.

Ainsi, aucun commit de développement n'est reconstruit ou modifié au moment de la promotion : le même commit testé sur `dev` devient stable.
