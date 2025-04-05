export type CommentItemProps = {
  id: string;
  avatarUrl: string;
  username: string;
  content: string;
  timestamp: string;
  isOwner?: boolean;
  replies?: CommentItemProps[];
  onReply?: (reply: CommentItemProps) => void;
  onDelete?: (id: string) => void;
};
