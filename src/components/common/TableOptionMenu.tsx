import { MoreVerticalIcon } from "lucide-react";
import React from "react";
import CommonConfirmDialog from "./CommonConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Action = {
  label: string;
  onClick: () => void;
  confirm?: {
    title: string;
    description: string;
  };
};

type Props = {
  actions: Action[];
};

export default function TableOptionMenu({ actions }: Props) {
  return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex size-8" size="icon">
            <MoreVerticalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-40">
          {actions.map((action, index) => (
            <React.Fragment key={index}>
              {action.confirm ? (
                <DropdownMenuItem asChild>
                  <CommonConfirmDialog
                    onConfirm={action.onClick}
                    triggerName={action.label}
                    title={action.confirm.title}
                    description={action.confirm.description}
                  />
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={action.onClick}>
                  {action.label}
                </DropdownMenuItem>
              )}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
  );
}
