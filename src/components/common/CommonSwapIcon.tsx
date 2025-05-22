import { cn } from "@/lib/utils";
import React from "react";
import { IconType } from "react-icons/lib";
import { toast } from "sonner";

type CommonSwapIconProps = {
  className?: string;
  defaultValue?: boolean;
  Icon: IconType;
  activeColor: string;
  inactiveColor: string;
  activeMessage?: string;
  inactiveMessage?: string;
  onStatusChange?: (isActive: boolean) => void;
};

export default function CommonSwapIcon(props: CommonSwapIconProps) {
  const {
    className,
    Icon,
    activeColor,
    inactiveColor,
    inactiveMessage,
    activeMessage,
    defaultValue
  } = props;
  
  const [isActive, setIsActive] = React.useState(defaultValue ?? false);
  const handleClick = () => {

    const status = !isActive;

    if (status) {
      if (activeMessage) {
        toast.success(activeMessage);
      }
    } else {
      if (inactiveMessage) {
        toast.error(inactiveMessage);
      }
    }
    props.onStatusChange?.(status);

    setIsActive(status);
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
