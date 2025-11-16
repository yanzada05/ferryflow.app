export default function handler(req, res) {
  const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT;
  let serviceAccountValid = false;

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      serviceAccountValid = !!(
        sa.private_key &&
        sa.client_email &&
        sa.project_id
      );
    }
  } catch (e) {
    serviceAccountValid = false;
  }

  const env = {
    mercadopago: process.env.MERCADOPAGO_ACCESS_TOKEN ? "OK ✅" : "MISSING ❌",
    firebase_service_account: hasServiceAccount ? "OK ✅" : "MISSING ❌",
    firebase_service_account_valid: serviceAccountValid
      ? "VALID ✅"
      : "INVALID ❌",
    // Variáveis antigas (não usadas mais)
    firebase_project_old: process.env.FIREBASE_PROJECT_ID || "Not used",
    firebase_key_old: process.env.FIREBASE_PRIVATE_KEY?.length || "Not used",
  };

  return res.status(200).json(env);
}
