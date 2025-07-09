import React from "react";
import {Button} from "../ui/button";


export default function QuantityCounter({quantity, onQtyChange}: {
    quantity: number,
    onQtyChange(quantity: number): void
}) {
    const [qty, setQty] = React.useState(quantity);
    const handleDecrease = () => {
        if (qty > 1) {
            setQty(prev => {
                const current = prev - 1;
                onQtyChange(current)
                return current
            });

        }
    }

    const handleIncrease = () => {
        setQty(prev => {
            const current = prev + 1;
            onQtyChange(current)
            return current
        });
    }

    return (
        <div className="flex">
            <Button
                onClick={handleDecrease}
                variant="outline"
                className="w-8 h-8 rounded-md flex items-center text-lg justify-center text-red-500"
            >
                -
            </Button>
            <div className="w-8 h-8 rounded-md text-primary border border-border flex items-center justify-center">
                {qty}
            </div>
            <Button
                onClick={handleIncrease}
                variant="outline"
                className="w-8 h-8 rounded-md flex items-center text-lg justify-center text-green-400"
            >
                +
            </Button>
        </div>
    );
}
