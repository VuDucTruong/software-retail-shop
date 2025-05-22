import { useTranslations } from "next-intl";
import Image from "next/image";
import { LoginForm } from "./LoginForm";

export default function LoginTab() {
  const t = useTranslations();

  return (
    <div className="flex flex-row gap-4">
      <div className="flex flex-col justify-start gap-2 max-w-xl">
        <p className="italic text-muted-foreground mb-6">
          {t("login_description")}
        </p>

        <LoginForm />

        <div className="flex items-center gap-1 my-2">
          <div className="w-full h-px bg-slate-400 rounded-full"></div>
          <div className="whitespace-nowrap text-muted-foreground font-medium">
            {t("login_with")}
          </div>
          <div className="w-full h-px bg-slate-400 rounded-full"></div>
        </div>
        <Image
          className="cursor-pointer self-center"
          alt="Google"
          src="/google.png"
          width={50}
          height={50}
        />
      </div>

      <Image
        alt="Login"
        className="rounded-xl"
        src="/login.jpg"
        width={500}
        height={500}
      />
    </div>
  );
}
