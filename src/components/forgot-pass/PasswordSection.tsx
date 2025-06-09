import { ChangePassword } from "@/api";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useTranslations } from "next-intl";

type Props = {
    form: ReturnType<typeof useForm<ChangePassword>>;
    onSubmit?: () => void;
}

export default function PasswordSection(props: Props) {
  const { form } = props;
  const t = useTranslations();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {
        props.onSubmit?.();
      })}>
        <Card>
          <CardHeader>
            <CardTitle>{t('Reset_password')}</CardTitle>
            <CardDescription className="whitespace-pre-line">
              {t("Input.change_password_hint")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>{t("new_password")}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} value={field.value ?? ""} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>{t('confirm_password')}</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} value={field.value ?? ""} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full h-10" type="submit">{t('Continue')}</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
