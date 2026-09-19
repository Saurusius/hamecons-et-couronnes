# Workflow Git — Hameçons & Couronnes

Le dépôt suit désormais le modèle de Ravel :

- `master` : branche stable / production. Ne pas développer directement dessus.
- `dev` : branche d'intégration permanente. Toutes les corrections et fonctionnalités validées y arrivent.
- `feature/*` : nouvelles fonctionnalités, créées depuis `dev`, puis PR vers `dev`.
- `fix/*` : corrections, créées depuis `dev`, puis PR vers `dev`.

## Publication

L'action **Promote dev to master** est déclenchée manuellement depuis GitHub Actions.

Elle :
1. valide le manifeste ;
2. vérifie la syntaxe JavaScript ;
3. contrôle les données essentielles (18 zones, 144 poissons, IDs uniques, un boss par zone) ;
4. refuse la publication si `master` a divergé ;
5. avance `master` exactement sur le commit validé de `dev`.

Ainsi, aucun commit de développement n'est reconstruit ou modifié au moment de la promotion : le même commit testé sur `dev` devient stable.
