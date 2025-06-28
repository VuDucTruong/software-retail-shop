'use client';

import {useFormContext, Controller} from 'react-hook-form';
import {Switch} from '../ui/switch';
import {cn} from '@/lib/utils';

type Props = {
  name: string;
  className?: string;
};

export function CommonSwitch({name, className}: Props) {
  const {control} = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => {
        console.log('form valuee', field.value)

        return (
          <Switch checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                  className={cn("", className)}/>
        )
      }
      }
    />
  );
}
