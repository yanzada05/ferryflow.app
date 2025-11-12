# 🚢 FerryFlow v3

Sistema de compra de passagens de ferry com integração ao Mercado Pago.

## 📱 Sobre o Projeto

FerryFlow é um aplicativo mobile desenvolvido com React Native (Expo) que permite:

- Compra de passagens de ferry
- Agendamento de horários
- Acompanhamento de status em tempo real
- Pagamento via Mercado Pago

## 🛠️ Tecnologias

- **Frontend:** React Native + Expo
- **Backend:** Firebase Functions
- **Banco de Dados:** Firestore
- **Autenticação:** Firebase Auth
- **Pagamentos:** Mercado Pago
- **Linguagem:** TypeScript

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI
- Conta Firebase
- Conta Mercado Pago

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/yanzada05/ferryflow.app.git
cd ferryflow.app
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
# Crie um arquivo .env na raiz do projeto
cp .env.example .env
```

4. Adicione suas credenciais no arquivo `.env`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=sua_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=seu_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

5. Inicie o projeto:

```bash
npm start
```

## ⚙️ Firebase Functions (Backend)

### Deploy das Functions

1. Entre na pasta functions:

```bash
cd functions
npm install
```

2. Configure o token do Mercado Pago:

```bash
# Crie um arquivo .env em functions/
echo "MERCADOPAGO_ACCESS_TOKEN=seu_token_aqui" > .env
```

3. Faça o deploy:

```bash
firebase deploy --only functions
```

### Webhook do Mercado Pago

Configure o webhook no painel do Mercado Pago apontando para:

```
https://sua-regiao-seu-projeto.cloudfunctions.net/mpWebhook
```

## 📂 Estrutura do Projeto

```
ferryflow.app/
├── src/
│   ├── screens/        # Telas do app
│   ├── components/     # Componentes reutilizáveis
│   ├── firebase/       # Configuração Firebase
│   └── theme/          # Tema e estilos
├── functions/          # Firebase Functions
├── .env               # Variáveis de ambiente (não commitar!)
└── package.json
```

## 🔐 Segurança

⚠️ **IMPORTANTE:**

- Nunca commite o arquivo `.env` no Git
- Configure regras de segurança do Firestore
- Valide dados no backend antes de processar pagamentos

## Licença

Este projeto está sob a licença MIT.

## Autor

Yan - [GitHub](https://github.com/yanzada05)

## 🤝 Contribuindo

Contribuições são bem-vindas!
