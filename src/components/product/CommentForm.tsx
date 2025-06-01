"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from "next-intl"
import { MdOutlineSend } from "react-icons/md"
import { useAuthStore } from "@/stores/auth.store"
import { useAuthDialogStore } from "@/stores/auth.dialog.store"

type CommentFormProps = {
  onSubmit?: (data: string) => void
}

export function CommentForm({ onSubmit }: CommentFormProps) {
 

  const t = useTranslations();

  const FormSchema = z.object({
    comment: z
      .string()
      .min(10, {
        message: t('Input.error_comment_min_length'),
      })
      .max(500, {
        message: t('Input.error_comment_max_length'),
      }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      comment: "",
    },
  })

    const isAuthenticated = useAuthStore(
      (state) => state.isAuthenticated
    );
    const onOpenChange = useAuthDialogStore
      ((state) => state.onOpenChange);


  function handleSubmit(data: z.infer<typeof FormSchema>) {

    if (!isAuthenticated) {
      onOpenChange(true);
      return;
    }

    const comment = data.comment.trim()
    onSubmit?.(comment)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-3/4 space-y-6 ">
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel><h3>{t('Comment')}</h3></FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('Input.comment_placeholder')}
                  minLength={10}
                  className="lg:text-[1rem] lg:h-24"
                  maxLength={500}
                  {...field}
                />
              </FormControl>
              <FormDescription className="flex items-center justify-between">
                {t('comment_description')}
                <Button className="not-italic" type="submit">{t('Send')} <MdOutlineSend/></Button>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
      </form>
    </Form>
  )
}
