import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { FaUserAlt } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { userProfileOptions } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DialogTitle } from "@radix-ui/react-dialog";
import LoginTab from "./LoginTab";
import RegisterTab from "./RegisterTab";
var isLoggedIn = false; // Replace with actual authentication logic
export function AuthDialog() {
  const t = useTranslations();

  if (isLoggedIn) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={"lg"} className="flex items-center p-2 h-full">
            <div className="relative size-10">
              <Image
                alt="Avatar"
                src={"https://randomuser.me/api/portraits/men/1.jpg"}
                fill
                className="object-cover rounded-full"
              />
            </div>
            Username
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" alignOffset={-5}>
          {userProfileOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.title}
              className="group hover:font-medium"
            >
              <opt.icon className="group-hover:text-primary" />{" "}
              <Link className="group-hover:text-primary" href={opt.href}>
                {t(opt.title)}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size={"lg"}>
          <FaUserAlt className="size-6 mr-2 text-primary" />
          {t("Account")}
        </Button>
      </DialogTrigger>

      <DialogContent >
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login">
          <TabsList className="[&>*]:text-xl w-100">
            <TabsTrigger value="login">{t("Login")}</TabsTrigger>
            <TabsTrigger value="register">{t("Register")}</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginTab isReset={false} />
          </TabsContent>
          <TabsContent className="max-h-1/2" value="register">
            <RegisterTab isReset={false} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
