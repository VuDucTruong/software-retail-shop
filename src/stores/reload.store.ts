import { SetState } from "@/lib/set_state";

type StoreData = {
  data: { id: number }[];
  totalInstances?: number;
};

type ReloadFn<T> = (set: SetState<T>, queryParams: any) => void;

export const handleDeleteReloadGeneric = <T>(
  set: SetState<T>,
  ids: number[],
  field: keyof T,
  getState: () => T,
  reloadFn: ReloadFn<T>,
) => {
  const storeData = getState()[field] as StoreData | null;

  const newData = storeData?.data?.filter((item) => !ids.includes(item.id)) ?? [];

  if (newData.length === 0) {
    const queryParams = (getState() as any).queryParams;
    reloadFn(set, queryParams);
  } else {
    set((state) => ({
      ...state,
      status: "success",
      [field]: storeData
        ? {
            ...storeData,
            data: newData,
            totalInstances: (storeData.totalInstances ?? ids.length) - ids.length,
          }
        : null,
    }));
  }
};