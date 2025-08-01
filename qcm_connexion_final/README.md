# StudyHub - Plateforme de Révision Intelligente

Une application web complète de révision avec système d'authentification Firebase et fonctionnalités QCM avancées.

## 🚀 Fonctionnalités

### 🔐 Système d'Authentification
- **Connexion/Inscription** avec email et mot de passe
- **Connexion Google** intégrée
- **Réinitialisation de mot de passe** par email
- **Vérification d'email** pour les nouveaux comptes
- **Protection des routes** - redirection automatique

### 📚 Fonctionnalités d'Apprentissage
- **QCM Dynamiques** - Création et passage de quiz personnalisés
- **Flashcards Interactives** - Système de révision par cartes
- **Import de Documents** - Support PDF et Word
- **IA Assistant** - Chat intelligent pour les questions
- **Résumés Automatiques** - Génération de résumés
- **Statistiques Détaillées** - Suivi des progrès

### 🎨 Interface Utilisateur
- **Design Moderne** - Interface responsive et intuitive
- **Thème Sombre/Clair** - Basculement automatique
- **Animations Fluides** - Transitions et effets visuels
- **Mobile-First** - Optimisé pour tous les appareils

## 📁 Structure du Projet

```
qcm_connexion_final/
├── index.html              # Page de connexion/inscription
├── dashboard.html          # Tableau de bord principal
├── assets/
│   ├── style.css          # Styles CSS complets
│   └── logo.png           # Logo de l'application
├── pages/
│   ├── qcm.html           # Page QCM
│   ├── flashcards.html    # Page Flashcards
│   ├── resumes.html       # Page Résumés
│   ├── import.html        # Page Import
│   ├── ai-chat.html       # Page IA Assistant
│   └── statistics.html    # Page Statistiques
├── scripts/
│   ├── auth.js            # Gestion de l'authentification
│   ├── main.js            # Script principal
│   ├── qcm.js             # Logique QCM
│   ├── flashcards.js      # Logique Flashcards
│   ├── ai-service.js      # Service IA
│   ├── document-processor.js # Traitement de documents
│   ├── cloud-sync.js      # Synchronisation cloud
│   └── notification-manager.js # Gestion des notifications
├── config.js              # Configuration Firebase
└── README.md              # Ce fichier
```

## 🔧 Configuration

### Prérequis
- Serveur web (Apache, Nginx, ou serveur de développement)
- Connexion Internet (pour Firebase et CDN)

### Installation
1. **Télécharger** le projet
2. **Extraire** les fichiers dans votre serveur web
3. **Ouvrir** `index.html` dans un navigateur

### Configuration Firebase
L'application utilise Firebase pour l'authentification et le stockage. La configuration est déjà incluse dans le code.

## 🎯 Utilisation

### Première Utilisation
1. **Ouvrir** l'application dans votre navigateur
2. **Créer un compte** ou se connecter avec Google
3. **Vérifier votre email** (si inscription par email)
4. **Accéder au tableau de bord**

### Navigation
- **Page de Connexion** (`index.html`) - Authentification
- **Tableau de Bord** (`dashboard.html`) - Vue d'ensemble
- **QCM** - Création et passage de quiz
- **Flashcards** - Système de révision
- **Import** - Import de documents
- **IA Assistant** - Chat intelligent
- **Statistiques** - Suivi des progrès

## 🔒 Sécurité

- **Authentification Firebase** - Sécurisé et fiable
- **Validation des données** - Côté client et serveur
- **Protection CSRF** - Tokens de sécurité
- **Chiffrement** - Données sensibles protégées

## 📱 Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge (versions récentes)
- **Appareils** : Desktop, tablette, mobile
- **Systèmes** : Windows, macOS, Linux, iOS, Android

## 🛠️ Technologies Utilisées

- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **Authentification** : Firebase Auth
- **Base de données** : Firestore
- **Stockage** : Firebase Storage
- **IA** : OpenAI API
- **UI/UX** : Font Awesome, Google Fonts
- **PDF** : PDF.js

## 🚀 Déploiement

### Hébergement Local
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js
npx serve .

# Avec PHP
php -S localhost:8000
```

### Hébergement en Ligne
- **Netlify** - Déploiement gratuit
- **Vercel** - Déploiement automatique
- **Firebase Hosting** - Intégration native
- **GitHub Pages** - Hébergement statique

## 📞 Support

Pour toute question ou problème :
1. Vérifier la console du navigateur pour les erreurs
2. S'assurer que Firebase est correctement configuré
3. Vérifier la connexion Internet

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**StudyHub** - Votre plateforme de révision intelligente et interactive ! 🎓