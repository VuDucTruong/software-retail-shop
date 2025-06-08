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

type Props = {
    form: ReturnType<typeof useForm<ChangePassword>>;
    onSubmit?: () => void;
}

export default function EmailSection(props: Props) {
  const { form } = props;
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => {
        props.onSubmit?.();
      })}>
        <Card>
          <CardHeader>
            <CardTitle>Forgot password</CardTitle>
            <CardDescription>
              Please enter your email address for the verification process, we will send you a verification code to reset your password.
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
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

          </CardContent>
          <CardFooter>
            <Button className="w-full h-10" type="submit">Continue</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
