# 🔧 Como resolver: Projetos não aparecem para outros visitantes

## ❌ Problema Atual
Os projetos estão sendo salvos no localStorage do seu navegador, que é local para cada computador. Por isso, quando você adiciona um projeto, ele só aparece no seu computador.

## ✅ Solução: Firebase (Banco de dados na nuvem)

### Passo 1: Criar conta no Firebase
1. Acesse: https://console.firebase.google.com
2. Faça login com sua conta Google
3. Clique em "Criar projeto"
4. Nome: `nexure-site`
5. Desabilite o Google Analytics (opcional)
6. Clique em "Criar projeto"

### Passo 2: Configurar Firestore Database
1. No painel do Firebase, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (permite leitura/escrita)
4. Localização: escolha a mais próxima (ex: us-central1)
5. Clique em "Próximo" e depois "Ativar"

### Passo 3: Obter credenciais
1. No painel do Firebase, clique na engrenagem ⚙️ (Configurações)
2. Clique em "Configurações do projeto"
3. Role para baixo até "Seus aplicativos"
4. Clique em "Adicionar app" → ícone da web 🌐
5. Nome do app: `nexure-web`
6. Clique em "Registrar app"
7. **COPIE as credenciais que aparecem** (você vai precisar delas)

### Passo 4: Atualizar o arquivo firebase-config.js
Substitua todo o conteúdo do arquivo `firebase-config.js` por:

```javascript
// Configuração do Firebase
const firebaseConfig = {
  apiKey: "COLE_SUA_API_KEY_AQUI",
  authDomain: "nexure-site.firebaseapp.com",
  projectId: "nexure-site",
  storageBucket: "nexure-site.appspot.com",
  messagingSenderId: "COLE_SEU_SENDER_ID_AQUI",
  appId: "COLE_SEU_APP_ID_AQUI"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar serviços
const db = firebase.firestore();
const storage = firebase.storage();
```

### Passo 5: Adicionar scripts do Firebase no HTML
No arquivo `index.html`, antes da linha `</body>`, adicione:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.1/firebase-storage-compat.js"></script>
<script src="firebase-config.js"></script>
<script src="script.js"></script>
```

### Passo 6: Configurar regras de segurança
1. No Firestore Database, clique na aba "Regras"
2. Substitua as regras por:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projetos/{document} {
      allow read, write: if true;
    }
  }
}
```
3. Clique em "Publicar"

### Passo 7: Testar
1. Salve todos os arquivos
2. Recarregue a página
3. Vá na seção Admin e adicione um projeto
4. Abra o site em outro navegador ou computador
5. O projeto deve aparecer para todos!

## 🎯 Resultado
- ✅ Projetos salvos na nuvem
- ✅ Aparecem para todos os visitantes
- ✅ Atualizações em tempo real
- ✅ Funciona no GitHub Pages

## 🔍 Verificar se funcionou
1. Abra o console do navegador (F12)
2. Se aparecer "⚠️ Usando modo temporário", ainda não está configurado
3. Se não aparecer nada, está funcionando com Firebase real

## 🆘 Se der erro
- Verifique se as credenciais estão corretas
- Confirme se o Firestore está ativo
- Verifique se as regras de segurança estão publicadas
- Teste em modo incógnito

## 💡 Dica
O Firebase tem um plano gratuito generoso que deve ser suficiente para o site da Nexure. Se precisar de mais recursos no futuro, pode fazer upgrade. 