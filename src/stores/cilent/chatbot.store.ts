
import { ApiError } from "@/api/client/base_client";
import { extractDataFromInnerAPI } from "@/lib/utils";
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
    set((state => ({
      status: "loading",
      messages: [...state.messages, message],
      error: null,
    })));

    try {
      const res = await fetch("/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message }),
      });
      
      const respond = await extractDataFromInnerAPI(res);

      set((state) => ({
        status: "success",
        messages: [...state.messages, JSON.parse(respond).text],
      }));

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
