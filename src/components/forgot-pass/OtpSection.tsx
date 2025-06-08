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

type Props = {
    form: ReturnType<typeof useForm<ChangePassword>>;
    onSubmit?: () => void;
}

export default function OtpSection(props: Props) {
  const { form } = props;
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => {
        props.onSubmit?.();
      })}>
        <Card>
          <CardHeader>
            <CardTitle>Verification</CardTitle>
            <CardDescription>
            Please enter the OTP code sent to your email to verify your identity.
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
                      <CommonOTPInput onChange={field.onChange} value={field.value} itemClassName="size-14 text-lg text-primary font-medium"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center gap-2">
            <Button className="w-full h-10" type="submit">Verify</Button>

            <ResendOTPBtn onResend={()=>{}} />
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
