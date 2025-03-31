import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { FaUserAlt } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { userProfileOptions } from "@/config/constants";
import Link from "next/link";

export function AuthDialog() {
  const t = useTranslations();
  var isLoggedIn = false; // Replace with actual authentication logic
  
  if (isLoggedIn) {
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center h-fit text-sm rounded-r-none font-medium border-r-2 ">
            {"User name"} <ChevronDown className="size-6 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {userProfileOptions.map((opt) => (
            <DropdownMenuItem key={opt.title}>
              <Link href={opt.href}>{opt.title}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
  }


  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size={"lg"}>
          <FaUserAlt className="size-6 mr-2 text-primary" />
          {t("Account")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
      </DialogContent>
    </Dialog>
  );
}
