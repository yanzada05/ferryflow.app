Functions for FerryFlow (Mercado Pago integration)
1. Set your MERCADOPAGO_ACCESS_TOKEN as environment variable:
   export MERCADOPAGO_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
2. Deploy:
   firebase deploy --only functions
Notes:
- createPreference: create Mercado Pago preference and returns init_point and preference id.
- mpWebhook: webhook endpoint to receive Mercado Pago notifications (you must configure in Mercado Pago dashboard).
