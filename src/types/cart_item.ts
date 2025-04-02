export type CartItemProps = {
    id: number;
    title: string;
    tags: string[];
    quantity: React.RefObject<number>;
    price: number;
    image: string;
    isAvailable: boolean;
    originalPrice: number;
    status: string;
    onDelete: (id: number) => void;
}