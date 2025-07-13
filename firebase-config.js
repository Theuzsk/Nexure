// Configuração do Firebase - Nexure Site
const firebaseConfig = {
  apiKey: "AIzaSyCjI0ZED7RMcDgVvn9wGSkFwQlw4HpvcoY",
  authDomain: "nexure-site.firebaseapp.com",
  projectId: "nexure-site",
  storageBucket: "nexure-site.firebasestorage.app",
  messagingSenderId: "230583205609",
  appId: "1:230583205609:web:ff879a34a9d3d99312ba78"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar serviços
const db = firebase.firestore();
const storage = firebase.storage();

console.log('✅ Firebase configurado com sucesso!'); 