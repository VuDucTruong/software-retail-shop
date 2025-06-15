import { motion } from "framer-motion";
import { RefreshCcw, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ChatMessage } from "./ChatMessage";

type Message = { isBot: boolean; message: string; isLoading?: boolean };
type ChatBoxProps = {
  isOpen: boolean;
}
export default function ChatBox({isOpen}: ChatBoxProps) {
  const t = useTranslations();
  
  const [messages, setMessages] = React.useState<Message[]>([
    { isBot: true, message: t('Hello') },
  ]);
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const sendMessage = async () => {
    const message = inputRef.current?.value || "";
    if (!message.trim()) return;

    const userMessage: Message = { isBot: false, message: message };
    setMessages((prev) => [...prev, userMessage]);
    inputRef.current!.value = "";
    setLoading(true);

    // Push tạm một tin nhắn bot rỗng đang loading
    setMessages((prev) => [
      ...prev,
      { isBot: true, message: "", isLoading: true },
    ]);

    const res = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message}),
    });

    const reader = res.body?.getReader();
    if (!reader) {
      setLoading(false);
      return;
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      // Cập nhật tin nhắn bot cuối cùng
      setMessages((prev) => {
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];

        if (lastMessage.isBot) {
          updated[updated.length - 1] = {
            ...lastMessage,
            message: lastMessage.message + chunk,
          };
        }

        return updated;
      });
    }

    // Sau khi stream xong ➔ remove isLoading
    setMessages((prev) => {
      const updated = [...prev];
      const lastMessage = updated[updated.length - 1];

      if (lastMessage.isBot) {
        updated[updated.length - 1] = {
          ...lastMessage,
          isLoading: false,
        };
      }

      return updated;
    });

    setLoading(false);
  };

  return (
    <motion.div
      initial={false} 
      animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className={`${isOpen ? "visible": "invisible"} fixed bottom-28 right-6 w-1/3 max-h-2/3 flex flex-col gap-4 p-4 rounded-md border border-border bg-gradient-to-b from-teal-100 to-blue-100 overflow-hidden z-50 shadow-lg` }
    >
      <div className="w-full border-b-2 border-border flex items-center justify-between pb-2">
        <h3 className="text-primary  ">
          {t("chat_ai")}
        </h3>

        <Button disabled={loading} onClick={()=>{
          setMessages([{ isBot: true, message: "Hello" }]);
          setLoading(false);
        }} variant="ghost" className="hover:bg-primary/30"><RefreshCcw/></Button>
      </div>

      <div className="flex-1 flex flex-col gap-2 my-4 overflow-y-auto h-72">
        {messages.map((message, index) => (
          <ChatMessage key={index} {...message} />
        ))}
      </div>

      <div className="flex items-start gap-2 pb-2">
        <Textarea
          placeholder={t("chat_ai_placeholder")}
          className="flex-1 max-h-20 resize-none border-black"
          maxLength={300}
          ref={inputRef}
        />
        <Button variant={"outline"} onClick={sendMessage} disabled={loading}>
          <Send />
        </Button>
      </div>
    </motion.div>
  );
}
