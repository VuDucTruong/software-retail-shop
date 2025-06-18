'use client'

import { Button } from '@/components/ui/button'
import { Undo2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

export default function NotFound() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-4xl font-bold">{t('page_not_found')}</h1>
        <div className='relative w-1/2 h-1/2'>
            <Image src={"/404.png"} fill alt='Not found image' className='object-contain'/>
        </div>
        <p className="text-muted-foreground italic text-lg">{t('page_not_found_description')}</p>
        <Button variant="outline" className='rounded-full flex items-centers gap-2 text-lg !p-6' onClick={() => window.history.back()}>
           <Undo2 className='size-5'/> {t('go_back')}	
        </Button>
    </div>
  )
}
