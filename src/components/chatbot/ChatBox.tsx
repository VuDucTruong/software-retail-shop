import { motion } from "framer-motion";
import { RefreshCcw, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ChatMessage } from "./ChatMessage";
import { useChatbotStore } from "@/stores/cilent/chatbot.store";
import { useShallow } from "zustand/shallow";


type ChatBoxProps = {
  isOpen: boolean;
};
export default function ChatBox({ isOpen }: ChatBoxProps) {
  const t = useTranslations();

  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const [messages, status, generateResponse,clearMessages] = useChatbotStore(
    useShallow((state) => [
      state.messages,
      state.status,
      state.generateResponse,
      state.clearMessages
    ])
  );

  const chatMessages:string[] = [
    t('chatbot_welcome_message'),
    ...messages,
  ]

  const sendMessage = () => {
    const message = inputRef.current?.value.trim();
    if (!message) return;
    
    generateResponse(message);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <motion.div
      initial={false}
      animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className={`${
        isOpen ? "visible" : "invisible"
      } fixed bottom-28 right-6 w-1/3 max-h-2/3 flex flex-col gap-4 p-4 rounded-md border border-border bg-gradient-to-b from-teal-100 to-blue-100 overflow-hidden z-50 shadow-lg`}
    >
      <div className="w-full border-b-2 border-border flex items-center justify-between pb-2">
        <h3 className="text-primary  ">{t("chat_ai")}</h3>

        <Button
          disabled={status === "loading"}
          onClick={() => {
            clearMessages();
          }}
          variant="ghost"
          className="hover:bg-primary/30"
        >
          <RefreshCcw />
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-2 my-4 overflow-y-auto h-72">
        {chatMessages.map((message, index) => (
          <ChatMessage
            key={index}
            isBot={index % 2 !== 1}
            message={message}
            isLoading={status === "loading" && index === chatMessages.length - 1 && index % 2 !== 1}
            isError={status === "error" && index === chatMessages.length - 1 && index % 2 !== 1}
          />
        ))}
      </div>

      <div className="flex items-start gap-2 pb-2">
        <Textarea
          placeholder={t("chat_ai_placeholder")}
          className="flex-1 !text-[16px] max-h-20 resize-none border-black"
          maxLength={300}
          ref={inputRef}
        />
        <Button
          variant={"outline"}
          onClick={sendMessage}
          disabled={status === "loading"}
        >
          <Send />
        </Button>
      </div>
    </motion.div>
  );
}
