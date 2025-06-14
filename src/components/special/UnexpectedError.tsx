import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";

type UnexpectedErrorProps = {
  title?: string;
  description?: string;
  buttonText?: string;
};

export default function UnexpectedError(props: UnexpectedErrorProps) {
  const {title="unexpected error", description = "Something went wrong, please try again later.", buttonText="Return" } = props;

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="capitalize">{title}</h1>
      <Image
        alt="Runtime Error"
        src={"/runtime_error.jpg"}
        width={350}
        height={350}
        priority
      />
      <p className="italic text-muted-foreground mb-2">{description}</p>
      <Button onClick={handleBack}><ArrowLeft /> {buttonText}</Button>
    </div>
  );
}
