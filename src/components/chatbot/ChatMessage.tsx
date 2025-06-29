import { RiRobot3Line } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import { LoadingDots } from "./LoadingDots";
import { cn } from "@/lib/utils";
interface ChatItemProps {
  isBot: boolean;
  message: string;
  isLoading?: boolean;
  isError?: boolean;
}

export function ChatMessage({
  isBot,
  message,
  isLoading,
  isError,
}: ChatItemProps) {
  return (
    <div
      className={`flex gap-2 ${isBot ? "justify-start" : "justify-end"} ${
        isLoading ? "items-center" : "items-start"
      } `}
    >
      {isBot && (
        <div className="flex items-center justify-center bg-primary text-white rounded-full p-2 shadow-md">
          <RiRobot3Line />
        </div>
      )}
      {isLoading ? (
        <LoadingDots />
      ) : (
        <div
          className={cn(
            "py-1 px-2 rounded-lg max-w-2/3 text-wrap break-words prose",
            isBot ? "bg-gray-200" : "bg-primary/80 text-primary-foreground",
            isError ? "bg-red-100 text-red-800" : ""
          )}
        >
          <ReactMarkdown>{message}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
