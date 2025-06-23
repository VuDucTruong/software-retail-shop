'use client';

import * as Switch from '@radix-ui/react-switch';
import { useFormContext, Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';

type Props = {
    name: string;
};

export function SwitchToggleField({ name }: Props) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Switch.Root
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className={cn(
                        'group relative h-6 w-11 cursor-pointer rounded-full border transition-colors duration-300',
                        field.value ? 'bg-red-500' : 'bg-gray-300'
                    )}
                >
                    <Switch.Thumb
                        className={cn(
                            'block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform duration-300',
                            field.value && 'translate-x-[22px]'
                        )}
                    />
                </Switch.Root>
            )}
        />
    );
}
