import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { CgDetailsMore } from "react-icons/cg";

export default function CategoryDropDownMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" className="w-50 justify-start text-left border-2">
          <CgDetailsMore />
          <span className="text-ellipsis overflow-hidden whitespace-nowrap">
            Categories
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-100 min-w-50">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
