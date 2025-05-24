import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export type FloatingCart_ListDisplay_Type = { id: number, name: string, childItems: { name: string }[] }[]

export function FloatingCardList({ items }: { items: FloatingCart_ListDisplay_Type }) {
    return (
        <ul className="space-y-2">
            {items.map((item, idx) => (
                <li key={idx} className="text-sm">
                    <span className="font-medium">{item.name}: </span>
                    <span className="text-muted-foreground">
                        {item.childItems.map(c => c.name).join(", ")}
                    </span>
                </li>
            ))}
        </ul>
    );
}