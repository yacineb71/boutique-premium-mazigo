# Configuration Netlify Forms - MAZIGHO

## 📋 Instructions de Déploiement

Ce guide explique comment déployer le site MAZIGHO sur Netlify avec le formulaire de contact fonctionnel.

### Étape 1 : Connecter votre dépôt GitHub à Netlify

1. Allez sur [netlify.com](https://netlify.com)
2. Cliquez sur **"New site from Git"**
3. Sélectionnez **GitHub** et autorisez Netlify
4. Sélectionnez le dépôt **MAZIGHO**
5. Cliquez sur **"Deploy site"**

### Étape 2 : Configuration de Build

Netlify détectera automatiquement la configuration Vite. Vérifiez les paramètres :

- **Build command** : `pnpm build`
- **Publish directory** : `dist`

### Étape 3 : Activer Netlify Forms

Une fois le site déployé, Netlify détectera automatiquement le formulaire de contact grâce aux attributs :
- `data-netlify="true"`
- `name="contact"`

Le formulaire sera disponible dans le dashboard Netlify sous **Forms** → **contact**.

### Étape 4 : Configurer les Notifications (Optionnel)

Pour recevoir les soumissions par email :

1. Allez dans **Site settings** → **Forms**
2. Cliquez sur le formulaire **"contact"**
3. Ajoutez votre adresse email pour les notifications
4. Configurez les emails de confirmation (optionnel)

### Étape 5 : Tester le Formulaire

1. Accédez à votre site déployé
2. Allez à la page **Contact**
3. Remplissez et soumettez le formulaire
4. Vérifiez que la soumission apparaît dans le dashboard Netlify

## 🔧 Détails Techniques

### Formulaire HTML

Le formulaire utilise les attributs Netlify Forms standard :

```html
<form 
  name="contact"
  method="POST"
  data-netlify="true"
>
  <input type="hidden" name="form-name" value="contact" />
  <!-- Champs du formulaire -->
</form>
```

### Champs du Formulaire

- **name** : Nom complet (obligatoire)
- **email** : Adresse email (obligatoire)
- **subject** : Sujet du message (optionnel)
- **message** : Contenu du message (obligatoire)

### Gestion des Erreurs

Le formulaire affiche des messages de succès/erreur via la bibliothèque **Sonner** :
- ✅ Succès : "Message envoyé avec succès !"
- ❌ Erreur : "Une erreur s'est produite lors de l'envoi"

## 📊 Accéder aux Soumissions

Dans le dashboard Netlify :

1. Allez dans **Forms**
2. Cliquez sur **contact**
3. Consultez toutes les soumissions reçues
4. Exportez les données en CSV si nécessaire

## 🚀 Déploiement Automatique

Chaque commit sur la branche `main` déclenche un nouveau déploiement automatique sur Netlify.

## ⚠️ Notes Importantes

- Le formulaire ne fonctionne que sur **Netlify** (pas en développement local)
- Les soumissions sont stockées dans le dashboard Netlify pendant 30 jours par défaut
- Pour une conservation plus longue, configurez une intégration avec un service externe (Zapier, Make, etc.)

## 📧 Intégrations Recommandées

Pour améliorer la gestion des soumissions :

- **Zapier** : Envoyer les soumissions à Google Sheets, Slack, etc.
- **Make** : Automatiser les workflows
- **SendGrid** : Envoyer des emails personnalisés
- **Discord** : Recevoir les notifications sur Discord

## 🆘 Dépannage

### Le formulaire ne s'envoie pas

1. Vérifiez que le site est déployé sur Netlify
2. Vérifiez les attributs `data-netlify="true"` et `name="contact"`
3. Vérifiez la console du navigateur pour les erreurs
4. Attendez quelques minutes après le déploiement

### Les soumissions n'apparaissent pas

1. Vérifiez que le formulaire a l'attribut `name="contact"`
2. Vérifiez dans le dashboard Netlify → Forms
3. Vérifiez que le formulaire a été soumis (pas de refresh de page)

## 📞 Support

Pour plus d'informations sur Netlify Forms :
- [Documentation Netlify Forms](https://docs.netlify.com/forms/overview/)
- [Netlify Support](https://support.netlify.com/)
