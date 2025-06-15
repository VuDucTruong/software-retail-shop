import React from "react";
import { Button } from "../ui/button";


export default function QuantityCounter({quantity, onQtyChange}: {quantity: React.RefObject<number>, onQtyChange(quantity: number):void}) {
  
    const [qty , setQty] = React.useState(quantity.current);
    const handleDecrease = () => {
        if (qty > 1) {
            setQty(qty - 1);
            quantity.current = qty - 1;
        }
        onQtyChange(qty)
        
    }
    const handleIncrease = () => {
        setQty(qty + 1);
        quantity.current = qty + 1;
        onQtyChange(qty)
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
