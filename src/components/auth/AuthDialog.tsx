import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useClientUserStore } from "@/stores/cilent/client.user.store";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { FaHeart, FaShareAlt, FaUserAlt } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "@/i18n/navigation";
import { useLoginToast } from "@/hooks/use-login-toast";
import { useShallow } from "zustand/shallow";
import { stat } from "fs";
import { Skeleton } from "../ui/skeleton";

export function AuthDialog() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const userProfileOptions = [
    {
      key: "profile",
      icon: FaUserAlt,
      title: "Account",
      onClick: () => {
        router.push("/user/profile");
      },
    },
    {
      key: "favorite",
      icon: FaHeart,
      title: "my_favorites",
      onClick: () => {
        router.push("/user/wishlist");
      },
    },
    {
      key: "logout",
      icon: LogOut,
      title: "Đăng xuất",
      onClick: () => {
        logout();
      },
    },
  ];
  const t = useTranslations();

  const [getMe, user, isAuthenticated, status, lastAction, error] =
    useAuthStore(
      useShallow((state) => [
        state.getMe,
        state.user,
        state.isAuthenticated,
        state.status,
        state.lastAction,
        state.error,
      ])
    );

  useLoginToast({ status, lastAction, errorMessage: error || undefined });

  useEffect(() => {
    getMe();
  }, []);

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={"lg"}
            className="flex items-center p-2 h-full"
          >
            <div className="relative size-10">
              <Image
                alt="Avatar"
                src={user.profile.imageUrl}
                fill
                className="object-cover rounded-full"
              />
            </div>
            {user.profile.fullName}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" alignOffset={-5}>
          {userProfileOptions.map((opt) => (
            <DropdownMenuItem
              key={opt.title}
              onClick={opt.onClick}
              className="group hover:font-medium"
            >
              <opt.icon className="group-hover:text-primary" />{" "}
              <div className="group-hover:text-primary">{t(opt.title)}</div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }


  if(status === "loading" && lastAction === "getMe" || status === "idle") {
    return <Skeleton className="w-26 h-14" />;

  }

  return (
    <div className="flex items-center gap-1 rounded-lg shadow-xs border border-border px-4 py-2">
      <FaUserAlt className="size-6 text-primary mr-2" />

      <Link href={"/login"}>
        {" "}
        <Button variant={"link"} className="px-0">
          Đăng nhập
        </Button>
      </Link>
      {"/"}
      <Link href={"/register"}>
        {" "}
        <Button variant={"link"} className="px-0">
          Đăng kí
        </Button>
      </Link>
    </div>
  );

  
}
