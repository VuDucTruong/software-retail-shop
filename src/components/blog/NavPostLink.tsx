import { ArrowLeftCircle } from "lucide-react";
import clsx from "clsx";
import ThreeDButton from "../ThreeDButton";
import Link from "next/link";

interface NavPostLinkProps {
  direction: "prev" | "next";
  title: string;
  id: number;
}

export default function NavPostLink({ direction, title,id }: NavPostLinkProps) {
  const isPrev = direction === "prev";

  return (
    <Link href={`/blog/${id}`}>
        <ThreeDButton>
        <div
      className={clsx(
        "flex flex-col gap-2",
        isPrev ? "items-start" : "items-end"
      )}
    >
      <div
        className={clsx(
          "text-sm flex gap-2 items-center",
          isPrev ? "flex-row-reverse" : "flex-row"
        )}
      >
        {isPrev ? "Bài trước" : "Bài sau"}
        <ArrowLeftCircle className={isPrev ? "" : "rotate-180"} />
      </div>
      <div className={isPrev ? "text-start" : "text-end"}>{title}</div>
    </div>
    </ThreeDButton>
    </Link>
  );
}
