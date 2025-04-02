import React from "react";
import { Button } from "../ui/button";


export default function QuantityCounter({quantity}: {quantity: React.RefObject<number>}) {
  
    const [number , setNumber] = React.useState(quantity.current);
    const handleDecrease = () => {
        if (number > 1) {
            setNumber(number - 1);
            quantity.current = number - 1;
        }
    }
    const handleIncrease = () => {
        setNumber(number + 1);
        quantity.current = number + 1;
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
        {number}
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
