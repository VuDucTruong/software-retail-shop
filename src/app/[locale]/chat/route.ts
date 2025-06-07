import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function generateSystemPrompt(locale: string): string {
  const langInstruction =
    locale === "vi"
      ? "Hãy luôn trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu và thân thiện."
      : locale === "en"
      ? "Always respond in English, clearly and in a friendly tone."
      : `Always respond in the language of locale: ${locale}.`;

  return `
You are a friendly and professional digital assistant for an online store that sells all kinds of digital software products — including educational apps, productivity tools, desktop software, web platforms, SaaS services, game software, and software configurations.

Answer every question related to software products completely and helpfully, including recommendations, usage tips, technical configurations, and troubleshooting related to software.

If the question is not related to software products at all (such as hardware specs, physical devices, or unrelated topics), politely say you do not have information on those topics.

${langInstruction}

Do not make up answers. If you don't know something related to software, say you don't have the information.
  `.trim();
}

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const {pathname} = req.nextUrl;
  const locale = pathname.split("/")[1] || "en";

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const systemPrompt = generateSystemPrompt(locale);

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
    ],
  });

  const result = await chat.sendMessageStream(message);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        controller.enqueue(encoder.encode(chunk.text()));
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
