# Nexure - Site Portfolio

Site minimalista e elegante para a Nexure, com sistema de gerenciamento de projetos em tempo real.

## 🚀 Configuração do Firebase

Para que os projetos apareçam para todos os visitantes (não apenas no seu computador), você precisa configurar o Firebase:

### 1. Criar projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em "Criar projeto"
3. Digite o nome: `nexure-site`
4. Siga os passos (pode desabilitar o Google Analytics)

### 2. Configurar Firestore Database

1. No painel do Firebase, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Escolha a localização mais próxima (ex: us-central1)

### 3. Configurar Storage (para imagens)

1. No painel do Firebase, clique em "Storage"
2. Clique em "Começar"
3. Escolha "Iniciar no modo de teste"
4. Escolha a mesma localização do Firestore

### 4. Obter credenciais

1. No painel do Firebase, clique na engrenagem ⚙️
2. Clique em "Configurações do projeto"
3. Role para baixo até "Seus aplicativos"
4. Clique em "Adicionar app" → "Web"
5. Digite um nome: `nexure-web`
6. Clique em "Registrar app"
7. Copie as credenciais que aparecem

### 5. Atualizar arquivo de configuração

Substitua as credenciais no arquivo `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "SUA_API_KEY_AQUI",
  authDomain: "nexure-site.firebaseapp.com",
  projectId: "nexure-site",
  storageBucket: "nexure-site.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};
```

### 6. Configurar regras de segurança

No Firestore Database → Regras, substitua por:

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

No Storage → Regras, substitua por:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

## 📁 Estrutura do Projeto

```
nexure/
├── index.html          # Página principal
├── style.css           # Estilos
├── script.js           # JavaScript principal
├── firebase-config.js  # Configuração do Firebase
├── logo.png           # Logo da empresa
├── marca.png          # Marca d'água
└── README.md          # Este arquivo
```

## 🔧 Funcionalidades

- **Design responsivo** e minimalista
- **Sistema admin** para gerenciar projetos
- **Upload de imagens** com marca d'água automática
- **Carrossel de imagens** nos projetos
- **Modo focus** para destaque visual
- **Busca em tempo real** nos projetos
- **Contatos editáveis** via painel admin

## 🌐 Hospedagem

O site está configurado para funcionar no GitHub Pages. Após configurar o Firebase:

1. Faça commit das alterações
2. Push para o GitHub
3. Ative o GitHub Pages nas configurações do repositório
4. O site estará disponível em: `https://seu-usuario.github.io/nexure`

## 🔐 Acesso Admin

- **Senha**: `nexure2024`
- Acesse a seção "Admin" no menu
- Digite a senha para gerenciar projetos e contatos

## 📝 Notas

- Os projetos são salvos no Firebase Firestore
- As imagens são convertidas para base64 (não usa Storage ainda)
- O sistema funciona offline com fallback para localStorage
- Todos os visitantes verão os mesmos projetos em tempo real

## 🛠️ Próximas Melhorias

- [ ] Upload de imagens para Firebase Storage
- [ ] Sistema de autenticação mais seguro
- [ ] Backup automático dos dados
- [ ] Analytics e métricas
- [ ] SEO otimizado 