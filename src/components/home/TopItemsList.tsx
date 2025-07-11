'use client'
import React, { useState, useEffect, useMemo } from "react";
import { Button } from "../ui/button";

type TopItemsListProps = {
  title: string;
  items: string[];
};

export default function TopItemsList({ title, items }: TopItemsListProps) {
  const gradients = useMemo(() => [
    "bg-gradient-to-r from-red-400 to-yellow-300",
    "bg-gradient-to-r from-blue-400 to-indigo-300",
    "bg-gradient-to-r from-green-400 to-teal-300",
    "bg-gradient-to-r from-purple-400 to-pink-300",
    "bg-gradient-to-r from-orange-400 to-red-300",
    "bg-gradient-to-r from-cyan-400 to-blue-300",
    "bg-gradient-to-r from-yellow-400 to-green-300",
    "bg-gradient-to-r from-sky-400 to-sky-300",
  ],[]);

  const [shuffledGradients, setShuffledGradients] = useState(gradients);

  useEffect(() => {
    setShuffledGradients([...gradients].sort(() => Math.random() - 0.5));
  }, [gradients]);


  return (
    <div className="flex flex-col gap-4">
      <h3>{title}</h3>
      <div className="flex gap-2 items-center">
        {items.map((tag, index) => {
          const bgColor = shuffledGradients[index % shuffledGradients.length];
          return (
            <Button
              key={index}
              className={`p-2 ${bgColor} h-fit text-2xl flex-1 rounded-md m-1 text-center hover:opacity-80`}
            >
              {tag}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
