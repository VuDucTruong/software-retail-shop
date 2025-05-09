'use client'

import { Button } from '@/components/ui/button'
import { Undo2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <div className='relative w-1/2 h-1/2'>
            <Image src={"/404.png"} fill alt='Not found image' className='object-contain'/>
        </div>
        <p className="text-muted-foreground italic text-lg">Sorry, the page you are looking for does not exist.</p>
        <Button variant="outline" className='rounded-full flex items-centers gap-2 text-lg !p-6' onClick={() => window.history.back()}>
           <Undo2 className='size-5'/> Go Back
        </Button>
    </div>
  )
}
