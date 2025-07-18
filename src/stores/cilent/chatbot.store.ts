
import { ApiError } from "@/api/client/base_client";
import { extractDataFromInnerAPI, getOrCreateChatId } from "@/lib/utils";
import { create } from "zustand";



type ChatbotState = {
  error: string | null;
  messages: string[];
  status: "idle" | "loading" | "error" | "success";
};

type ChatbotAction = {
  generateResponse: (message: string) => Promise<void>;
  clearMessages: () => void;
};

type ChatbotStore = ChatbotState & ChatbotAction;

const initialState: ChatbotState = {
  error: null,
  messages: [],
  status: "idle",
};

export const useChatbotStore = create<ChatbotStore>((set) => ({
  ...initialState,
  generateResponse: async (message) => {
    const chatId = getOrCreateChatId();
    set((state => ({
      status: "loading",
      messages: [...state.messages, message, ""],
      error: null,
    })));

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message, chatId: chatId}),
      });
      
      const respond = await extractDataFromInnerAPI(res);

      set((state) => {
        const newMessages = [...state.messages];
        newMessages[newMessages.length - 1] = JSON.parse(respond).text; // Update the last message with the response
        return {
          status: "success",
          messages: newMessages,
          error: null,
        };
      });

      // Handle the response as needed
    } catch (error) {
      set((state) => ({
        status: "error",
        error: ApiError.getMessage(error),
        messages: [...state.messages, message, ApiError.getMessage(error)],
      }));
    }
  },
  clearMessages: () => set({ ...initialState }),
}));
