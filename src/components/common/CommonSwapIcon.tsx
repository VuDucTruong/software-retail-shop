import { cn } from "@/lib/utils";
import React from "react";
import { IconType } from "react-icons/lib";
import { toast } from "sonner";

type CommonSwapIconProps = {
  className?: string;
  Icon: IconType;
  activeColor: string;
  inactiveColor: string;
  activeMessage?: string;
  inactiveMessage?: string;
};

export default function CommonSwapIcon(props: CommonSwapIconProps) {
  const {
    className,
    Icon,
    activeColor,
    inactiveColor,
    inactiveMessage,
    activeMessage,
  } = props;

  const [isActive, setIsActive] = React.useState(false);
  const handleClick = () => {
    if (!isActive) {
      if (activeMessage) {
        toast.success(activeMessage);
      }
    } else {
      if (inactiveMessage) {
        toast.error(inactiveMessage);
      }
    }

    setIsActive(!isActive);
  };
  return (
    <Icon
      onClick={handleClick}
      className={cn(
        className,
        "size-6 transition-colors cursor-pointer",
        isActive ? activeColor : inactiveColor
      )}
    />
  );
}
