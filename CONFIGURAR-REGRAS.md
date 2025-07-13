# 🔧 Configurar Regras de Segurança - Firebase

## ⚠️ IMPORTANTE: Configure as regras agora!

Para que o site funcione corretamente, você precisa configurar as regras de segurança no Firebase.

## 📋 Passo a Passo:

### 1. Acesse o Firebase Console
- Vá para: https://console.firebase.google.com
- Faça login e selecione o projeto `nexure-site`

### 2. Configurar Firestore Database
1. No menu lateral, clique em **"Firestore Database"**
2. Clique na aba **"Regras"**
3. Substitua as regras existentes por:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projetos/{document} {
      allow read, write: if true;
    }
    match /estatisticas/{document} {
      allow read, write: if true;
    }
  }
}
```

4. Clique em **"Publicar"**

### 3. Configurar Storage (opcional)
1. No menu lateral, clique em **"Storage"**
2. Clique na aba **"Regras"**
3. Substitua as regras por:

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

4. Clique em **"Publicar"**

## ✅ Como verificar se funcionou:

1. **Abra o site** no seu navegador
2. **Abra o console** (F12)
3. **Procure por**: `✅ Firebase configurado com sucesso!`
4. **Vá na seção Admin** e adicione um projeto
5. **Abra o site em modo incógnito** ou outro navegador
6. **Verifique se o projeto aparece** para outros visitantes

## 🎯 Resultado esperado:

- ✅ Projetos salvos na nuvem
- ✅ Aparecem para todos os visitantes
- ✅ Estatísticas funcionando
- ✅ Atualizações em tempo real

## 🆘 Se der erro:

**Erro comum**: "Missing or insufficient permissions"
- **Solução**: Verifique se as regras foram publicadas corretamente
- **Verifique**: Se copiou as regras exatamente como mostrado acima

**Erro**: "Firebase not initialized"
- **Solução**: Recarregue a página
- **Verifique**: Se os scripts do Firebase estão carregando

## 🚀 Próximos passos:

1. Configure as regras (5 minutos)
2. Teste localmente
3. Publique no GitHub Pages
4. Site funcionando para todos! 🎉

**Tempo total**: ~5 minutos para configurar as regras 