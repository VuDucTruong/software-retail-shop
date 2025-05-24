"use client";

import CommonInputOutline from "@/components/common/CommonInputOutline";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {BlogCreateRequest, BlogCreateSchema,} from "@/api";
import {zodResolver} from "@hookform/resolvers/zod";
import {useTranslations} from "next-intl";
import {useRef} from "react";
import {useForm} from "react-hook-form";
import {useShallow} from "zustand/shallow";
import {useActionToast} from "@/hooks/use-action-toast";
import Image from "next/image";
import {Textarea} from "@/components/ui/textarea";
import ProductDescriptionInput from "@/components/product/ProductDescriptionInput";
import { BlogSingle } from "@/stores/blog/blog.store";
import { getDateTimeLocal } from "@/lib/date_helper";

export default function CreateBlogPage() {
  const t = useTranslations();

  const [createBlog, lastAction, status, error] = BlogSingle.useStore(
    useShallow((state) => [
      state.createBlog,
      state.lastAction,
      state.status,
      state.error,
    ])
  );

  useActionToast({
    lastAction,
    status,
    errorMessage: error || undefined,
  });

  const form = useForm<BlogCreateRequest>({
    defaultValues: {
      title: "",
      subtitle: "",
      content: "",
      image: null,
      genreIds: [],
      publishedAt: getDateTimeLocal(),
    },
    resolver: zodResolver(BlogCreateSchema),
    mode: "onSubmit",
  });

  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    form.handleSubmit((data) => {
        console.log(data)
    //   createBlog(data);
    })();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{"Tạo bài viết"}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className=" grid grid-cols-3 space-x-4 gap-6"
          >
            {/* Image Upload */}

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel>Hình ảnh</FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        ref={fileRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                      />

                      <div className="relative w-full h-64">
                        <Image
                          alt="Image"
                          fill
                          src={field.value ? URL.createObjectURL(field.value) : "/empty_img.png"}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <CommonInputOutline required title={"Tiêu đề"} className="col-span-3">
                  <Input {...field} />
                </CommonInputOutline>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <CommonInputOutline title="Phụ đề" className="col-span-3" required>
                  <Textarea {...field} className="resize-none" rows={3} />
                </CommonInputOutline>
              )}
            />

            <FormField
              control={form.control}
              name="publishedAt"
              render={({ field }) => (
                <CommonInputOutline title={"Ngày xuất bản"} required>
                  <Input type="datetime-local" {...field} />
                </CommonInputOutline>
              )}
            />

            {/* Categories Multi-select */}

            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="genreIds"*/}
            {/*  render={({ field }) => (*/}
            {/*    <CommonInputOutline title={"Thể loại"} required>*/}
            {/*      <GenreDropdown field={field}/>*/}
            {/*    </CommonInputOutline>*/}
            {/*  )}*/}
            {/*/>*/}

            <div className="col-span-3">
              <ProductDescriptionInput hint="Nội dung bài viết" name="content" />
            </div>

            <Button
              className="col-start-3 bg-green-400 hover:bg-green-500"
              type="submit"
            >
              {t("Create")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
