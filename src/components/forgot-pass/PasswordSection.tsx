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

export default function PasswordSection(props: Props) {
  const { form } = props;
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => {
        props.onSubmit?.();
      })}>
        <Card>
          <CardHeader>
            <CardTitle>Đổi mật khẩu</CardTitle>
            <CardDescription>
              Nhập mật khẩu mới của bạn. Mật khẩu phải có từ 6-40 kí tự
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
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
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full h-10" type="submit">Save password</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
