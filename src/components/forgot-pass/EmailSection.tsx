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

export default function EmailSection(props: Props) {
  const { form } = props;
  const t = useTranslations();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {
        props.onSubmit?.();
      })}>
        <Card>
          <CardHeader>
            <CardTitle>{t('Forgot_password')}</CardTitle>
            <CardDescription>
              {t('forgot_password_email_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} value={field.value ?? ""} required />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

          </CardContent>
          <CardFooter>
            <Button className="w-full h-10" type="submit">{t("Continue")}</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
