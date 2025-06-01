import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import ResendOTPBtn from "./ResendOTPBtn";

type Props = {
  email: string;
  onVerify: (otp: string) => void;
  onSendOTP: () => void;
};

export default function VerificationForm(props: Props) {
  const { email,onVerify, onSendOTP } = props;
  const otpRef = React.useRef<HTMLInputElement>(null);

  const handleVerify = () => {
    const otp = otpRef.current?.value;
    if (otp && otp.length === 6) {
      onVerify(otp);
    }
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
    
      <div className="text-muted-foreground flex flex-col items-center justify-center">
        Nhập mã OTP đã được gửi đến email
        <span className="text-black font-medium">
          {email}
        </span>
      </div>
      <div className="flex items-center justify-center">
        <InputOTP
          maxLength={6}
          required
          ref={otpRef}
          inputMode="numeric"
          pattern="[0-9]*"
        >
          <InputOTPGroup>
            <InputOTPSlot className="size-15 text-4xl" index={0} />
            <InputOTPSlot className="size-15 text-4xl" index={1} />
            <InputOTPSlot className="size-15 text-4xl" index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot className="size-15 text-4xl" index={3} />
            <InputOTPSlot className="size-15 text-4xl" index={4} />
            <InputOTPSlot className="size-15 text-4xl" index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <Button onClick={handleVerify}>Xác nhận</Button>
      <div className="flex items-center justify-center">
        <ResendOTPBtn onResend={onSendOTP} initialCountdown={30} />
      </div>
    </div>
  );
}
