# Recherche d’intégration AliExpress

Date de consultation : 25 août 2026.

## Constats officiels

La page AliExpress Open Platform présente une plateforme développeur avec des API pour plusieurs domaines e-commerce et une documentation dédiée aux développeurs Overseas, Affiliate et DropShippers. La documentation Global APIs indique que l’autorisation suit OAuth 2.0 : une application doit être autorisée par le vendeur avant l’appel des API, puis les access tokens et refresh tokens doivent être conservés de manière sécurisée. Elle liste notamment des API de produits, catégories, images, livraison, commandes et gestion produit.

La documentation API expose une catégorie `AE-Dropshipper`, ainsi que les familles `AE-Affiliate`, produits, logistique, commandes et transactions. La page API indique que la création du token passe par un code OAuth et un appkey/appSecret, avec des erreurs possibles `InvalidAppkey`, `InvalidCode` et `AUTH_TYPE_UNSUPPORTED`.

Le portail officiel Affiliate décrit un parcours plus accessible : choisir des produits, générer des liens de suivi, promouvoir les produits et recevoir une commission. Il mentionne une Affiliate API pour interroger les détails produit et les données de commande, ainsi que des pushes serveur-à-serveur pour les commandes. Cette voie est adaptée à l’affiliation et à la redirection vers AliExpress, pas à une boutique MAZIGHO qui encaisse directement et automatise le fulfillment.

## URLs officielles consultées

- https://openservice.aliexpress.com/
- https://openservice.aliexpress.com/doc/doc.htm
- https://openservice.aliexpress.com/doc/api.htm?cid=20894
- https://portals.aliexpress.com/affiportals/web/portals.htm

## Conclusion opérationnelle

AliExpress propose bien des APIs officielles, mais l’accès dépend de l’inscription développeur, de la création/validation d’une application et de l’autorisation du compte vendeur ou affilié. Il ne faut pas commencer par coder une intégration directe avec des clés inventées ou un scraping du site. Pour MAZIGHO, la progression la moins risquée est d’abord un import manuel contrôlé par URL/CSV dans l’admin, puis un connecteur tiers spécialisé si l’automatisation des commandes devient nécessaire, et enfin l’API officielle uniquement après obtention des identifiants et vérification des droits.
