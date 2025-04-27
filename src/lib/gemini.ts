import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateChatResponse(userInput: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: [],
  });

  const result = await chat.sendMessage(userInput);
  const response = await result.response;
  return response.text();
}
