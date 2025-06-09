import { ChangePassword } from "@/api";
import { useForm } from "react-hook-form";
import ResendOTPBtn from "../auth/ResendOTPBtn";
import CommonOTPInput from "../common/CommonOTPInput";
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
  FormMessage
} from "../ui/form";
import { useTranslations } from "next-intl";

type Props = {
    form: ReturnType<typeof useForm<ChangePassword>>;
    onSubmit?: () => void;
    onResend?: () => void;
}

export default function OtpSection(props: Props) {
  const { form } = props;
  const t = useTranslations();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {
        props.onSubmit?.();
      })}>
        <Card>
          <CardHeader>
            <CardTitle>{t("Verification")}</CardTitle>
            <CardDescription>
              {t("forgot_password_otp_description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center gap-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <CommonOTPInput onChange={field.onChange} value={field.value ?? ""} itemClassName="size-14 text-lg text-primary font-medium"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center gap-2">
            <Button className="w-full h-10" type="submit">{t("Verify")}</Button>

            <ResendOTPBtn onResend={()=>{
              props.onResend?.();
            }} />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
