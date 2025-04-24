'use client'
import VerticalPostListItem from '@/components/blog/VerticalPostListItem'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

import React from 'react'

export default function BlogSearchPage() {

    const t = useTranslations();

  return (
    <div className='main-container flex flex-col gap-4 !pt-10'>
        <h1>ANIME....</h1>
        <div className='grid grid-cols-4 gap-3'>
            {
                Array.from({ length: 10 }, (_, i) => (
                    <VerticalPostListItem key={i} category='GAME' image='/empty_img.png' title='HEHE' author='Sang ri' date='22/5/2025' />
                ))
            }
        </div>
        <Button variant={'link'}>{t('see_more')}</Button>
    </div>
  )
}
