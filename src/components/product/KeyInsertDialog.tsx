import React from 'react'
import { Dialog, DialogHeader, DialogTitle } from '../ui/dialog'
import { DialogContent, DialogTrigger } from '@radix-ui/react-dialog'
import { Button } from '../ui/button'
import { useTranslations } from 'next-intl'
import SearchBar from '../home/SearchBar'
import Image from 'next/image'

export default function KeyInsertDialog() {
    const t = useTranslations()
  return (
    <Dialog>
        <DialogTrigger>
            <Button variant={"outline"}>
                {t('insert_key')}
            </Button>
        </DialogTrigger>

        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t('insert_key')}</DialogTitle>
                <p>{t('insert_key_hint')}</p>
            </DialogHeader>

            <div className='flex flex-col gap-4'>
                <SearchBar />

                <div className='flex items-center gap-2'>
                    <div className='relative size-10 rounded-md overflow-hidden border border-border'>
                        <Image fill src={"/logo.png"} alt='image'/>
                    </div>

                    <div className='flex flex-col'>
                        <p className='text-sm font-semibold'>Product Name</p>
                        <p className='text-xs text-muted-foreground'>Product ID: 123456789</p>
                    </div>
                </div>

                
            </div>
        </DialogContent>
    </Dialog>
  )
}
