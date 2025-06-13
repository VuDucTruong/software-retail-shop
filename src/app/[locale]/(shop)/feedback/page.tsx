"use client";
import { Ticket } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTicketToast } from "@/hooks/use-ticket-toast";
import { useAuthDialogStore } from "@/stores/auth.dialog.store";
import { useAuthStore } from "@/stores/auth.store";
import { useTicketStore } from "@/stores/cilent/ticket.store";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

export default function FeedbackPage() {
  const t = useTranslations();
  const user = useAuthStore((state) => state.user);
  const onOpenChange = useAuthDialogStore((state) => state.onOpenChange);
  const [createTicket, lastAction, error, status] = useTicketStore(
    useShallow((state) => [
      state.createTicket,
      state.lastAction,
      state.error,
      state.status,
    ])
  );
  const form = useForm<Ticket>({
    defaultValues: {
      fullName: "",
      email: "",
      feedback: "",
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      onOpenChange(true);
      return;
    }

    form.handleSubmit((data) => {
      createTicket(data);
    })();
  };

  useTicketToast({
    status,
    lastAction,
    errorMessage: error || undefined,
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.profile.fullName || "",
        email: user.email || "",
        feedback: "",
      });
    }
  }, [user, form]);

  return (
    <div className="min-h-screen flex main-container gap-4 items-center **:text-lg">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="!text-4xl">
            {t("send_support_ticket")}
          </CardTitle>
          <CardDescription className="text-lg whitespace-pre-line">
            {t("support_ticket_description")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <FormField
                name="fullName"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t("your_name")}</FormLabel>
                      <FormControl>
                        <Input {...field} required className="!py-6 !text-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          required
                          className="!py-6 !text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                name="feedback"
                control={form.control}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t("your_message")}</FormLabel>
                      <FormControl>
                        <Textarea
                          minLength={10}
                          {...field}
                          required
                          className=" !text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <div className="flex justify-end">
                <Button className="w-fit !px-8 !py-6" type="submit">
                  {t("Send")} <Send className="size-5"/>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="flex-1 relative">
        <Image
          src="/ticket_img.png"
          alt="Ticket Image"
          width={500}
          height={500}
          className="object-cover rounded-lg"
        />
      </div>
    </div>
  );
}
