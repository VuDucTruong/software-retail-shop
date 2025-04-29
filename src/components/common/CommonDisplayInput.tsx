import React from 'react'
import { Input } from '@/components/ui/input'

export default function CommonDisplayInput({title,value}: {title: string,value: string}) {
  return (
    <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium capitalize'>{title}</label>
        <Input disabled defaultValue={value} />
    </div>
  )
}
