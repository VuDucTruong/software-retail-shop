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

export default function AddGroupDialog() {
  const createProductGroup = useProductGroupStore(
    (state) => state.createProductGroup
  );

  const status = useProductGroupStore((state) => state.status);
  const lastAction = useProductGroupStore((state) => state.lastAction);
  const error = useProductGroupStore((state) => state.error);

  useActionToast({
    lastAction,
    status,
    errorMessage: error || undefined,
    reset: () => {
      form.reset();
    },
  });

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
    })();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-fit">
          Thêm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm nhóm sản phẩm</DialogTitle>
          <DialogDescription>
            Thêm nhóm sản phẩm mới vào hệ thống. Bạn có thể thêm nhiều nhóm sản
            phẩm
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
                      <Input {...field} placeholder="Nhập tên nhóm sản phẩm" />
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
                  Hủy
                </Button>
                <Button type="submit" disabled={status === "loading"}>
                  Thêm
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
