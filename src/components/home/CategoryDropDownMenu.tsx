import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { CgDetailsMore } from "react-icons/cg";
import { Button } from "../ui/button";

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
