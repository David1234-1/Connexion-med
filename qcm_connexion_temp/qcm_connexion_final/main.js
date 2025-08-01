import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCqGSBrsJ-7PIpfjAM58gD8h4VcY793rWQ",
  authDomain: "studyhub-proje.firebaseapp.com",
  projectId: "studyhub-proje",
  storageBucket: "studyhub-proje.firebasestorage.app",
  messagingSenderId: "359347355393",
  appId: "1:359347355393:web:8c05ede417c10c272d6500",
  measurementId: "G-DMQJNJW9S0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");
const googleBtn = document.getElementById("google-btn");
const logoutBtn = document.getElementById("logout-btn");
const forgotBtn = document.getElementById("forgot-btn");
const userDiv = document.getElementById("user-div");
const authDiv = document.getElementById("auth-div");
const userNameSpan = document.getElementById("user-name");

loginBtn.onclick = () => {
  if (!email.value || !password.value) {
    alert("Merci de remplir email et mot de passe");
    return;
  }
  signInWithEmailAndPassword(auth, email.value, password.value)
    .catch(err => alert("Erreur de connexion : " + err.message));
};

registerBtn.onclick = () => {
  if (!email.value || !password.value) {
    alert("Merci de remplir email et mot de passe");
    return;
  }
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(userCredential => {
      sendEmailVerification(userCredential.user)
        .then(() => alert("Email de vérification envoyé. Vérifiez votre boîte mail."));
    })
    .catch(err => alert("Erreur d'inscription : " + err.message));
};

logoutBtn.onclick = () => {
  signOut(auth);
};

googleBtn.onclick = () => {
  signInWithPopup(auth, provider)
    .catch(err => alert("Erreur Google : " + err.message));
};

forgotBtn.onclick = () => {
  if (!email.value) {
    alert("Entrez votre e-mail pour réinitialiser le mot de passe.");
    return;
  }
  sendPasswordResetEmail(auth, email.value)
    .then(() => alert("Lien de réinitialisation envoyé à ton e-mail."))
    .catch(err => alert("Erreur : " + err.message));
};

onAuthStateChanged(auth, user => {
  if (user) {
    userDiv.style.display = "block";
    authDiv.style.display = "none";
    userNameSpan.innerText = user.displayName || user.email;
    if (!user.emailVerified) {
      alert("⚠️ Ton e-mail n'est pas vérifié. Vérifie ta boîte mail.");
    }
  } else {
    userDiv.style.display = "none";
    authDiv.style.display = "block";
    email.value = "";
    password.value = "";
  }
});