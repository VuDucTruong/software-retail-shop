'use client';

import React, {useEffect, useState} from 'react';
import {z} from 'zod';
import {Mail} from 'lucide-react';
import {cn} from '@/lib/utils';
import CommonConfirmDialog from "@/components/common/CommonConfirmDialog";
import {Button} from "@/components/ui/button";
import {TbMailUp} from "react-icons/tb"; // optional if you use clsx/tailwind merge

const emailSchema = z.string().email({message: 'Invalid email address'});

type Props = {
    email: string;
    onSubmit: (email: string) => void;
    className?: string;
};

function OrderResendMailDialogContent({
                                          email,
                                          onSubmit,
                                          className,
                                      }: Props) {
    const [value, setValue] = useState<string>(email ?? "")
    const [error, setError] = useState<string | null>(null);


    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        try {
            emailSchema.parse(e.target.value);
            setError(null);
        } catch (e) {
            setError((e as z.ZodError).errors[0]?.message || null);
        }
        setValue(e.target.value)
    }

    const handleSubmit = () => {
        try {
            const email = emailSchema.parse(value);
            setError(null);
            onSubmit(email);
        } catch (e) {
            setError((e as z.ZodError).errors[0]?.message || null);
        }
    };

    return (
        <CommonConfirmDialog
            triggerName={
                <Button
                    variant={"outline"}
                    size="icon">
                    <TbMailUp/>
                </Button>
            }
            title={"Bạn có muốn gửi lại email thông báo không?"}
            description={<div className={cn('space-y-3', className)}>
                <p className="text-sm text-muted-foreground">
                    Do you want to resend the product keys to this email?
                </p>

                <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"/>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={value} onChange={handleOnChange}
                        className={cn(
                            'w-full pl-10 pr-3 py-2 text-sm rounded-md border bg-background placeholder:text-muted-foreground shadow-sm transition-all',
                            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-input focus:ring-primary focus:border-primary'
                        )}
                    />
                    {error && (
                        <span className="text-xs text-red-500 mt-1 block">{error}</span>
                    )}
                </div>
            </div>}
            onConfirm={handleSubmit}
        />


    );
}

export default OrderResendMailDialogContent;
