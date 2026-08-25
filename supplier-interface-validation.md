# Validation de l’interface fournisseur

- Desktop 1280×720 : sidebar admin visible, catalogue lisible, recherche et panneau de configuration fournisseur correctement structurés.
- Mobile 390×844 : header admin compact, titre lisible, tableau utilisable avec défilement horizontal implicite et panneau de configuration empilé sous la liste.
- Sécurité : la page reste sous `PrivateRoute`/`adminProcedure`; les métadonnées fournisseur ne sont pas présentes dans les réponses publiques du catalogue.
- Limite : la capture ne saisit pas de données fournisseur réelles ; elle vérifie le rendu de l’écran et les contrôles d’accès.

La capture tablette 768×1024 confirme que le header admin se compacte correctement, que les colonnes restent lisibles et que le panneau de configuration reste accessible sous le catalogue. Les captures desktop, tablette et mobile ont été réalisées dans la session admin du projet.
