import { MercadoPagoConfig, Payment } from "mercadopago";
import admin from "firebase-admin";

// Inicializa Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

const db = admin.firestore();

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { type, data } = req.body;

    console.log("Webhook received:", { type, data });

    // Verifica se é uma notificação de pagamento
    if (type === "payment") {
      const paymentId = data.id;

      // Busca informações do pagamento
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });

      const ticketId = paymentInfo.external_reference;
      const status = paymentInfo.status;

      console.log("Payment info:", { ticketId, status });

      if (!ticketId) {
        return res.status(400).json({ error: "Missing ticket ID" });
      }

      // Mapeia status do Mercado Pago para status interno
      const statusMap = {
        approved: "paid",
        pending: "pending",
        rejected: "failed",
        cancelled: "cancelled",
        refunded: "refunded",
      };

      const ticketStatus = statusMap[status] || "pending";

      // Atualiza o ticket no Firestore
      await db
        .collection("tickets")
        .doc(ticketId)
        .update({
          paymentStatus: ticketStatus,
          paymentId: paymentId,
          status: ticketStatus === "paid" ? "confirmed" : ticketStatus,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      console.log("Ticket updated:", ticketId);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
