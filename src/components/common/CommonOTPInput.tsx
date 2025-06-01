import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type CommonOTPInputProps = {
  itemClassName?: string;
  onChange?: (value: string) => void;
  value?: string;
};

export default function CommonOTPInput(props: CommonOTPInputProps) {
  const { itemClassName, onChange, value } = props;
  return (
    <InputOTP
      maxLength={6}
      inputMode="numeric"
      onChange={onChange}
      value={value}
      pattern="[0-9]*"
    >
      <InputOTPGroup>
        <InputOTPSlot className={itemClassName} index={0} />
        <InputOTPSlot className={itemClassName} index={1} />
        <InputOTPSlot className={itemClassName} index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot className={itemClassName} index={3} />
        <InputOTPSlot className={itemClassName} index={4} />
        <InputOTPSlot className={itemClassName} index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
