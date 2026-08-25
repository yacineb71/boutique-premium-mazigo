# Audit de palette MAZIGHO

La palette de référence est désormais centralisée autour de l’ivoire `#f8f5ef`, du charbon `#211e1b`, du terracotta `#b65f3f`, du sable `#ede7de` et du texte secondaire `#6d6259`.

## Composants partagés vérifiés

`Header.tsx`, `Footer.tsx`, `Newsletter.tsx`, `NavigationLoader.tsx`, `ProductReview.tsx`, `PrivateRoute.tsx`, les cartes shadcn et les états de formulaire utilisent soit les tokens globaux, soit des accents terracotta explicites. Les anciennes classes Tailwind froides sont remappées dans `index.css` pour les composants historiques encore présents.

## Modules administratifs vérifiés

Les routes `/admin`, `/admin/products`, `/admin/categories`, `/admin/orders`, `/admin/customers`, `/admin/promotions`, `/admin/reviews` et `/admin/settings` ont été contrôlées en desktop et mobile. Le dashboard utilise également une palette Chart.js terracotta/sable/charbon. Les en-têtes Catégories et Promotions empilent leur bouton sur mobile afin d’éviter tout chevauchement.

## Pages publiques vérifiées

Les routes `/`, `/shop`, `/product/1`, `/cart`, `/checkout`, `/about` et `/contact` ont été contrôlées en desktop, tablette et mobile après harmonisation. Le parcours recherche, tri, panier et checkout est conservé.
