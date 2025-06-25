'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Switch } from '../ui/switch';
import { cn } from '@/lib/utils';

type Props = {
    name: string;
    className?: string;
};

export function CommonSwitch({ name,className }: Props) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Switch {...field} className={cn("", className)}/>
            )}
        />
    );
}
