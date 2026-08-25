# Validation interactions et thème

La boutique `/shop` conserve la grille, la recherche, les catégories et le sélecteur de tri après ajout des interactions de carte. Les cartes disposent d’une élévation au survol, d’un zoom doux de l’illustration et d’un lien « Voir le produit » révélé au survol ou au focus clavier.

Le Header desktop affiche le bouton icône lune/soleil avec `aria-label` et `aria-pressed`. Le menu mobile conserve sa structure et le contrôle de thème est prévu dans son panneau. Les captures desktop et mobile montrent que le bouton menu, la recherche d’accueil et les contrôles boutique restent lisibles.

Le test d’intégration du ThemeProvider vérifie le changement clair/sombre, la classe `dark` sur le document et l’écriture de `theme=dark` dans `localStorage`. La suite compte 34 tests passants, le typage est valide et le build de production est réussi. La capture dédiée du thème sombre confirme le hero et la boutique en charbon/terracotta, mais a révélé que le Header conserve un fond clair opaque et un contraste insuffisant. Ce point est corrigé dans la passe suivante avec des overrides pour les classes d’opacité du Header et ses bordures.

## Audit sombre complémentaire

La capture après correctif confirme que le Header adopte le fond charbon, que le logo, les liens, les icônes et le bouton de compte restent lisibles, et que la fiche produit conserve un contraste satisfaisant entre titre ivoire, prix terracotta et fond charbon. Elle affiche désormais un état neutre sans note ni compteur lorsque les avis authentifiés sont absents.

Le panier sombre affiche correctement l’état vide, l’illustration, le titre ivoire, le texte secondaire et l’action de retour. Le checkout sombre conserve également une hiérarchie lisible entre l’étape, le titre, l’explication et le lien de continuation.

La capture de `/admin` sans session authentifiée redirige vers l’accueil, ce qui confirme le garde d’accès ; le dashboard admin ne peut pas être visuellement audité dans cette session non connectée. Les tests de route guard couvrent les états d’authentification et de rôle.

La capture mobile 390×844 avec menu ouvert confirme que les liens, les univers, le panier, le compte et le bouton « Thème clair » restent visibles et utilisables sur fond charbon. L’assertion navigateur confirme la présence du contrôle par son libellé ARIA.
