import { ProductGroupCreate, ProductGroupCreateSchema } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useActionToast } from "@/hooks/use-action-toast";
import { useProductGroupStore } from "@/stores/product.group.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { useTranslations } from "next-intl";

export default function AddGroupDialog() {
  const t = useTranslations();
  const createProductGroup = useProductGroupStore(
    (state) => state.createProductGroup
  );

  const status = useProductGroupStore((state) => state.status);

  const form = useForm<ProductGroupCreate>({
    defaultValues: {
      name: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(ProductGroupCreateSchema),
  });

  const handleSubmit = () => {
    form.handleSubmit((data) => {
      createProductGroup(data);
      form.reset();
    })();
  };

  return (
    <Dialog onOpenChange={(open) => open && form.reset()}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit">
          {t('Add')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('add_product_group')}</DialogTitle>
          <DialogDescription>
            {t('add_product_group_description')}
          </DialogDescription>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder={t('Input.product_group_placeholder')} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset();
                  }}
                  className="mr-2"
                >
                  {t('Cancel')}	
                </Button>
                <Button type="submit" disabled={status === "loading"}>
                  {t("Add")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
