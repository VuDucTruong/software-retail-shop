import { RiRobot3Line } from "react-icons/ri";
import ReactMarkdown from "react-markdown";
import { LoadingDots } from "./LoadingDots";
interface ChatItemProps {
  isBot: boolean;
  message: string;
  isLoading?: boolean;
}

export function ChatMessage({ isBot, message, isLoading }: ChatItemProps) {
  return (
    <div
      className={`flex gap-2 ${
        isBot ? "justify-start" : "justify-end"
      } ${isLoading ? 'items-center': "items-start"} `}
    >
      {isBot && (
        <div className="flex items-center justify-center bg-primary text-white rounded-full p-2 shadow-md">
          <RiRobot3Line />
        </div>
      )}
      {isLoading ? (
          <LoadingDots />
      ) : (
        <ReactMarkdown
          className={`py-1 px-2 rounded-lg max-w-2/3 text-wrap break-words prose ${
            isBot ? "bg-gray-200" : "bg-primary text-primary-foreground"
          }`}
        >
          {message}
        </ReactMarkdown>
      )}
    </div>
  );
}
