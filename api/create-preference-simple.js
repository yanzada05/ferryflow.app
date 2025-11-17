import { MercadoPagoConfig, Preference } from "mercadopago";
// ADICIONE AS IMPORTAÇÕES DO FIREBASE
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// --- INÍCIO: CONFIGURAÇÃO DO FIREBASE ---
// (Copie isso do seu app ou de outro lugar. Use variáveis de ambiente!)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Inicializa o Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
// --- FIM: CONFIGURAÇÃO DO FIREBASE ---

// Configuração do Mercado Pago (você já tem isso)
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  // CORS (você já tem isso)
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
    // Pegue TODOS os dados do corpo
    const { userId, scheduleId, time, date, vehicleType, price, passengers } =
      req.body;

    // Validações (você já tem isso)
    if (!userId || !scheduleId || !time || !price || !passengers) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Gera o ticketId (você já tem isso)
    const ticketId = `ticket_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // --- INÍCIO: LÓGICA DO FIREBASE (A PARTE QUE FALTA) ---
    // 1. Prepare os dados do ticket
    const ticketData = {
      id: ticketId, // Salva o ID dentro do documento
      userId,
      scheduleId,
      time,
      date,
      vehicleType,
      passengers, // { adults: 1, children: 0 }
      totalPrice: parseFloat(price),
      origin: "Ponta da Espera", // Você pode adicionar isso
      destination: "Cujupe", // Você pode adicionar isso
      status: "Aguardando Pagamento", // Status inicial
      createdAt: new Date().toISOString(),
    };

    // 2. Crie a referência do documento no Firebase
    const ticketDocRef = doc(db, "tickets", ticketId);

    // 3. Salve o documento no Firebase USANDO setDoc
    await setDoc(ticketDocRef, ticketData);
    // --- FIM: LÓGICA DO FIREBASE ---

    // --- INÍCIO: LÓGICA DO MERCADO PAGO (você já tem isso) ---
    // (O ticket agora existe no Firebase, podemos criar o pagamento)
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
        external_reference: ticketId, // Correto: vincula o pagamento ao ID do ticket
        notification_url: `https://${process.env.VERCEL_URL}/api/webhook`, // Correto: seu webhook vai ATUALIZAR o status para "Pagamento Aprovado"
        metadata: {
          // Correto: envia dados para o webhook
          userId,
          scheduleId,
          time,
          date,
          vehicleType,
        },
      },
    });
    // --- FIM: LÓGICA DO MERCADO PAGO ---

    // Resposta de sucesso (você já tem isso)
    return res.status(200).json({
      success: true,
      ticketId,
      preferenceId: preferenceData.id,
      init_point: preferenceData.init_point,
      sandbox_init_point: preferenceData.sandbox_init_point,
    });
  } catch (error) {
    console.error("Erro ao criar preferência ou ticket:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
      details: error.cause?.message || "No details",
    });
  }
}
