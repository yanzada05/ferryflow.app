import { MercadoPagoConfig, Preference } from "mercadopago";
import admin from "firebase-admin";

// Inicializa Firebase Admin com JSON completo
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT || "{}"
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, scheduleId, time, date, vehicleType, price } = req.body;

    // Validações
    if (!userId || !scheduleId || !time || !price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Criar ticket no Firestore
    const ticketRef = await db.collection("tickets").add({
      userId,
      scheduleId,
      time,
      date: date || new Date().toISOString(),
      vehicleType: vehicleType || "car",
      price,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const ticketId = ticketRef.id;

    // Criar preferência no Mercado Pago
    const preference = new Preference(client);

    const preferenceData = await preference.create({
      body: {
        items: [
          {
            title: `Passagem Ferry - ${time}`,
            description: `Agendamento para ${date || "hoje"}`,
            quantity: 1,
            unit_price: parseFloat(price),
            currency_id: "BRL",
          },
        ],
        back_urls: {
          success: `myapp://payment/success?ticketId=${ticketId}`,
          failure: `myapp://payment/failure?ticketId=${ticketId}`,
          pending: `myapp://payment/pending?ticketId=${ticketId}`,
        },
        auto_return: "approved",
        external_reference: ticketId,
        notification_url: `https://${process.env.VERCEL_URL}/api/webhook`,
      },
    });

    // Atualizar ticket com ID da preferência
    await ticketRef.update({
      preferenceId: preferenceData.id,
    });

    return res.status(200).json({
      ticketId,
      preferenceId: preferenceData.id,
      init_point: preferenceData.init_point,
      sandbox_init_point: preferenceData.sandbox_init_point,
    });
  } catch (error) {
    console.error("Error creating preference:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
