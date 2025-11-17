import React, {
  createContext,
  useState,
  useContext,
  useEffect, // 1. Importar o useEffect
} from "react";
import { auth, db } from "../firebase/config"; // 2. Importar o auth e o db
import { onAuthStateChanged } from "firebase/auth"; // 3. Importar o listener de auth
import { collection, query, where, getDocs, limit } from "firebase/firestore"; // 4. Importar funções do Firestore

// Define o formato do ticket (pegue da sua TicketScreen)
interface Ticket {
  id: string;
  // ...coloque os outros campos: origin, destination, status, etc.
  [key: string]: any; // Permite outros campos
}

// Define o que o contexto armazena
interface ITicketContext {
  activeTicket: Ticket | null;
  setActiveTicket: (ticket: Ticket | null) => void;
  isLoadingTicket: boolean;
  checkActiveTicket: (userId: string) => void; // Função para buscar ticket
}

// Cria o contexto
const TicketContext = createContext<ITicketContext | undefined>(undefined);

// Cria o "Provedor" que vai envolver seu app
export const TicketProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [isLoadingTicket, setIsLoadingTicket] = useState(true);

  // 5. ADICIONAR O LISTENER DE AUTENTICAÇÃO
  useEffect(() => {
    // Isso roda uma vez quando o app abre
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário está logado.
        // Vamos verificar se ele tem um ticket ativo no Firestore
        console.log("Usuário logado, verificando ticket ativo...");
        checkActiveTicket(user.uid);
      } else {
        // Usuário está deslogado.
        // ESTA É A CORREÇÃO: Limpar o ticket!
        console.log("Usuário deslogado, limpando ticket.");
        setActiveTicket(null);
        setIsLoadingTicket(false);
      }
    });

    // Limpa o listener quando o componente for desmontado
    return () => unsubscribe();
  }, []); // O array vazio [] faz isso rodar só uma vez

  // 6. MELHORAR O checkActiveTicket
  const checkActiveTicket = async (userId: string) => {
    if (!userId) {
      setIsLoadingTicket(false);
      return;
    }
    setIsLoadingTicket(true);
    try {
      // Procura por um ticket no Firestore que seja deste usuário
      // e que esteja com o status de "Pagamento Aprovado"
      const ticketsRef = collection(db, "tickets");
      const q = query(
        ticketsRef,
        where("userId", "==", userId),
        where("status", "==", "Pagamento Aprovado"),
        limit(1) // Pega só o primeiro que encontrar
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Encontramos um ticket ativo!
        const ticketDoc = querySnapshot.docs[0];
        console.log("Ticket ativo encontrado no Firestore:", ticketDoc.id);
        setActiveTicket(ticketDoc.data() as Ticket);
      } else {
        // Nenhum ticket ativo encontrado
        console.log("Nenhum ticket ativo no Firestore.");
        setActiveTicket(null);
      }
    } catch (error) {
      console.error("Erro ao verificar ticket ativo:", error);
      setActiveTicket(null);
    } finally {
      setIsLoadingTicket(false);
    }
  };

  return (
    <TicketContext.Provider
      value={{
        activeTicket,
        setActiveTicket,
        isLoadingTicket,
        checkActiveTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useTicket = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error("useTicket deve ser usado dentro de um TicketProvider");
  }
  return context;
};
