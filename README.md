FerryFlow v3 - TypeScript + Firebase + Mercado Pago (Checkout) integration (demo)

Frontend (Expo) + Backend (Firebase Functions) included.

Quick start (frontend):
1. unzip and enter folder
2. npm install
3. npm start

Firebase Cloud Functions (checkout):
1. cd functions
2. npm install
3. set MERCADOPAGO_ACCESS_TOKEN in environment or functions/.env (see functions/README)
4. firebase deploy --only functions

Notes:
- The frontend PurchaseScreen calls the Cloud Function createPreference which returns init_point and ticketId.
- A webhook function (mpWebhook) is included in functions to update payment status in Firestore (you must configure webhook URL in Mercado Pago dashboard).
- Replace placeholders and check CORS/security before production.
