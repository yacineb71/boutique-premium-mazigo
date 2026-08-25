# Stripe et TWINT — prérequis vérifiés

**Date de vérification :** 26 août 2026

Stripe indique que TWINT est un moyen de paiement utilisé en Suisse, présenté en CHF, pris en charge par Stripe Checkout. Les comptes Stripe situés en Suisse peuvent accepter TWINT, sous réserve de l’activation du moyen de paiement et de la validation des exigences d’intégration. Les clients sont redirigés vers l’application TWINT sur mobile ou utilisent un QR code sur ordinateur. Le montant maximal documenté est de 5 000 CHF.

Pour l’onboarding TWINT, Stripe demande notamment un site fonctionnel et accessible, un nom ou une forme juridique, une adresse commerciale complète, un moyen de contact, une destination de livraison suisse pour les biens physiques et des prix affichés en CHF au plus tard au checkout. Le compte doit également avoir le moyen TWINT activé dans les paramètres Stripe ; la capacité peut rester en attente tant que la vérification de conformité n’est pas terminée.

MAZIGHO transmet actuellement `payment_method_types: ["card", "twint"]` à Stripe Checkout et utilise la devise `chf`. L’endpoint applicatif signé `/api/stripe/webhook` est prévu pour les événements `checkout.session.completed` et `checkout.session.async_payment_succeeded`.

Le panneau Manus distingue le sandbox réclamable, désormais expiré pour ce projet, de l’utilisation d’un sandbox Stripe propre avec des clés de test. Les clés de test et le secret webhook doivent rester dans les Secrets du projet ; aucune clé live ne doit être utilisée pour la validation sandbox. Le test de paiement réel demeure à effectuer depuis un compte Stripe de test actif.

## Références officielles

[1]: https://docs.stripe.com/payments/twint — Stripe, « TWINT payments ».

[2]: https://docs.stripe.com/payments/twint/accept-a-payment — Stripe, « TWINT payments — Accept a payment ».

[3]: https://stripe.com/payment-method/twint — Stripe, « TWINT payment method ».
