import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChangePassword } from "@/api";

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
