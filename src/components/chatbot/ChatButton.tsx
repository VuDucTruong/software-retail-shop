"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Chatbox from "./ChatBox";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { Button } from "../ui/button";
export default function ChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-12 right-6 size-14 bg-primary flex items-center justify-center text-white p-4 rounded-full shadow-lg z-50"
      >
        <TbMessageChatbotFilled size={24} />
      </motion.button>
      
      <Chatbox isOpen={open}/>

      
    </>
  );
}
