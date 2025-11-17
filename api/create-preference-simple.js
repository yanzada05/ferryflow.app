import { MercadoPagoConfig, Preference } from "mercadopago";

// Configuração do Mercado Pago (SEM Firebase)
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
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

    // Gera um ticketId temporário (depois você salva no Firestore via webhook)
    const ticketId = `ticket_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Criar preferência no Mercado Pago
    const preference = new Preference(client);

    const preferenceData = await preference.create({
      body: {
        items: [
          {
            title: `Passagem Ferry - ${time}`,
            description: `Agendamento para ${date}`,
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
        metadata: {
          userId,
          scheduleId,
          time,
          date,
          vehicleType,
        },
      },
    });

    return res.status(200).json({
      success: true,
      ticketId,
      preferenceId: preferenceData.id,
      init_point: preferenceData.init_point,
      sandbox_init_point: preferenceData.sandbox_init_point,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
      details: error.cause?.message || "No details",
    });
  }
}
