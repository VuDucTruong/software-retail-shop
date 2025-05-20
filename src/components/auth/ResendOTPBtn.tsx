"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface ResendOTPBtnProps {
  onResend: () => void
  initialCountdown?: number // ví dụ: 30 giây
}

export default function ResendOTPBtn({
  onResend,
  initialCountdown = 30,
}: ResendOTPBtnProps) {
  const [counter, setCounter] = useState(initialCountdown)
  const [isDisabled, setIsDisabled] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isDisabled && counter > 0) {
      timer = setInterval(() => {
        setCounter((prev) => prev - 1)
      }, 1000)
    } else if (counter === 0) {
      setIsDisabled(false)
    }

    return () => clearInterval(timer)
  }, [counter, isDisabled])

  const handleClick = () => {
    onResend()
    setCounter(initialCountdown)
    setIsDisabled(true)
  }

  return (
    <div className="flex items-center justify-between text-sm">
      {isDisabled ? (
        <p className="text-muted-foreground">
          Gửi lại mã sau {counter} giây
        </p>
      ) : (
        <Button
          variant="link"
          className="text-primary p-0 h-auto"
          onClick={handleClick}
        >
          Gửi lại mã
        </Button>
      )}
    </div>
  )
}
