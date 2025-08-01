// Système d'authentification StudyHub avec Firebase
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.authOverlay = document.getElementById('auth-overlay');
    this.loginBtn = document.getElementById('login-btn');
    this.logoutBtn = document.getElementById('logout-btn');
    this.userInfo = document.getElementById('user-info');
    this.userName = document.getElementById('user-name');
    
    // Attendre que Firebase soit chargé
    this.waitForFirebase().then(() => {
      this.init();
    });
  }

  async waitForFirebase() {
    while (!window.Firebase) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  init() {
    this.setupEventListeners();
    this.setupAuthStateListener();
  }

  setupEventListeners() {
    // Boutons d'authentification (pour le tableau de bord)
    this.loginBtn?.addEventListener('click', () => this.showAuthModal());
    this.logoutBtn?.addEventListener('click', () => this.logout());
    
    // Gestion des onglets d'authentification (pour la page de connexion)
    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchAuthTab(tab.dataset.tab));
    });
    
    // Formulaires d'authentification
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const resetPasswordForm = document.getElementById('reset-password-form');
    
    loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
    registerForm?.addEventListener('submit', (e) => this.handleRegister(e));
    resetPasswordForm?.addEventListener('submit', (e) => this.handleResetPassword(e));
    
    // Lien mot de passe oublié
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    forgotPasswordLink?.addEventListener('click', (e) => {
      e.preventDefault();
      this.showResetPasswordForm();
    });
    
    // Bouton retour à la connexion
    const backToLoginBtn = document.getElementById('back-to-login');
    backToLoginBtn?.addEventListener('click', () => this.showLoginForm());
    
    // Fermeture de la modal (si elle existe)
    this.authOverlay?.addEventListener('click', (e) => {
      if (e.target === this.authOverlay) {
        this.hideAuthModal();
      }
    });
    
    // Boutons Google
    const googleBtns = document.querySelectorAll('.btn-google');
    googleBtns.forEach(btn => {
      btn.addEventListener('click', () => this.handleGoogleAuth());
    });
  }

  setupAuthStateListener() {
    const { auth } = window.Firebase;
    
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.currentUser = {
          id: user.uid,
          name: user.displayName || user.email,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: user.metadata.creationTime
        };
        this.updateUI();
        await this.syncUserData();
        
        // Vérifier si nous sommes sur la page de connexion
        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
          // Rediriger vers le tableau de bord
          window.location.href = 'dashboard.html';
        } else {
          NotificationManager.show('Connexion réussie !', 'success');
        }
      } else {
        this.currentUser = null;
        this.updateUI();
        
        // Vérifier si nous sommes sur le tableau de bord
        if (window.location.pathname.includes('dashboard.html')) {
          // Rediriger vers la page de connexion
          window.location.href = 'index.html';
        } else {
          NotificationManager.show('Déconnexion réussie', 'info');
        }
      }
    });
  }

  showAuthModal() {
    if (this.authOverlay) {
      this.authOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  hideAuthModal() {
    if (this.authOverlay) {
      this.authOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  switchAuthTab(tab) {
    // Masquer tous les formulaires
    document.querySelectorAll('.auth-form').forEach(form => {
      form.classList.remove('active');
    });
    
    // Désactiver tous les onglets
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Afficher le formulaire sélectionné
    const targetForm = document.getElementById(tab + '-form');
    if (targetForm) {
      targetForm.classList.add('active');
    }
    
    // Activer l'onglet sélectionné
    const targetTab = document.querySelector(`[data-tab="${tab}"]`);
    if (targetTab) {
      targetTab.classList.add('active');
    }
  }

  showResetPasswordForm() {
    this.switchAuthTab('reset-password');
  }

  showLoginForm() {
    this.switchAuthTab('login');
  }

  async handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email')?.value;
    const password = document.getElementById('login-password')?.value;
    
    if (!email || !password) {
      NotificationManager.show('Veuillez remplir tous les champs', 'error');
      return;
    }
    
    try {
      await this.login(email, password);
    } catch (error) {
      NotificationManager.show(`Erreur de connexion: ${error.message}`, 'error');
    }
  }

  async handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name')?.value;
    const email = document.getElementById('register-email')?.value;
    const password = document.getElementById('register-password')?.value;
    const confirmPassword = document.getElementById('register-confirm-password')?.value;
    
    if (!name || !email || !password || !confirmPassword) {
      NotificationManager.show('Veuillez remplir tous les champs', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      NotificationManager.show('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    
    if (password.length < 6) {
      NotificationManager.show('Le mot de passe doit contenir au moins 6 caractères', 'error');
      return;
    }
    
    if (!this.isValidEmail(email)) {
      NotificationManager.show('Adresse email invalide', 'error');
      return;
    }
    
    try {
      await this.register(name, email, password);
    } catch (error) {
      NotificationManager.show(`Erreur d'inscription: ${error.message}`, 'error');
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async handleResetPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('reset-email')?.value;
    
    if (!email) {
      NotificationManager.show('Veuillez entrer votre adresse email', 'error');
      return;
    }
    
    if (!this.isValidEmail(email)) {
      NotificationManager.show('Adresse email invalide', 'error');
      return;
    }
    
    try {
      await this.resetPassword(email);
      NotificationManager.show('Lien de réinitialisation envoyé à votre email', 'success');
      this.showLoginForm();
    } catch (error) {
      NotificationManager.show(`Erreur: ${error.message}`, 'error');
    }
  }

  async login(email, password) {
    const { auth } = window.Firebase;
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (!user.emailVerified) {
        NotificationManager.show('⚠️ Votre email n\'est pas vérifié. Vérifiez votre boîte mail.', 'warning');
      }
      
      return user;
    } catch (error) {
      let errorMessage = 'Erreur de connexion';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte trouvé avec cette adresse email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Adresse email invalide';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Ce compte a été désactivé';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Trop de tentatives. Réessayez plus tard';
          break;
        default:
          errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async register(name, email, password) {
    const { auth } = window.Firebase;
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Mettre à jour le nom d'affichage
      await updateProfile(user, {
        displayName: name
      });
      
      // Envoyer l'email de vérification
      await sendEmailVerification(user);
      
      NotificationManager.show('Compte créé avec succès ! Vérifiez votre email pour confirmer votre compte.', 'success');
      
      return user;
    } catch (error) {
      let errorMessage = 'Erreur d\'inscription';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Cette adresse email est déjà utilisée';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Adresse email invalide';
          break;
        case 'auth/weak-password':
          errorMessage = 'Le mot de passe est trop faible';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'L\'inscription par email est désactivée';
          break;
        default:
          errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async resetPassword(email) {
    const { auth } = window.Firebase;
    return await sendPasswordResetEmail(auth, email);
  }

  async handleGoogleAuth() {
    const { auth } = window.Firebase;
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      let errorMessage = 'Erreur de connexion Google';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Connexion annulée';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup bloqué. Autorisez les popups pour ce site';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Connexion annulée';
          break;
        default:
          errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  }

  async logout() {
    const { auth } = window.Firebase;
    await signOut(auth);
  }

  updateUI() {
    if (this.currentUser) {
      // Utilisateur connecté
      if (this.userInfo) {
        this.userInfo.classList.remove('hidden');
      }
      if (this.loginBtn) {
        this.loginBtn.classList.add('hidden');
      }
      if (this.userName) {
        this.userName.textContent = this.currentUser.name;
      }
    } else {
      // Utilisateur déconnecté
      if (this.userInfo) {
        this.userInfo.classList.add('hidden');
      }
      if (this.loginBtn) {
        this.loginBtn.classList.remove('hidden');
      }
      if (this.userName) {
        this.userName.textContent = '';
      }
    }
  }

  async syncUserData() {
    if (!this.currentUser) return;
    
    try {
      const { db } = window.Firebase;
      const userRef = doc(db, 'users', this.currentUser.id);
      
      // Vérifier si l'utilisateur existe déjà
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Créer un nouveau document utilisateur
        await setDoc(userRef, {
          name: this.currentUser.name,
          email: this.currentUser.email,
          photoURL: this.currentUser.photoURL,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
          preferences: {
            theme: 'light',
            notifications: true
          }
        });
      } else {
        // Mettre à jour la dernière connexion
        await updateDoc(userRef, {
          lastLogin: serverTimestamp(),
          name: this.currentUser.name,
          photoURL: this.currentUser.photoURL
        });
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation des données utilisateur:', error);
    }
  }

  async saveUserDataToCloud(data) {
    if (!this.currentUser) return;
    
    try {
      const { db } = window.Firebase;
      const userRef = doc(db, 'users', this.currentUser.id);
      
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données:', error);
      throw error;
    }
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async getUserData() {
    if (!this.currentUser) return null;
    
    try {
      const { db } = window.Firebase;
      const userRef = doc(db, 'users', this.currentUser.id);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
      return null;
    }
  }
}

// Initialiser le gestionnaire d'authentification
let authManager;

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
  authManager = new AuthManager();
});

// Fonction globale pour la connexion Google (utilisée dans index.html)
window.signInWithGoogle = function() {
  if (authManager) {
    authManager.handleGoogleAuth().catch(error => {
      NotificationManager.show(error.message, 'error');
    });
  }
};