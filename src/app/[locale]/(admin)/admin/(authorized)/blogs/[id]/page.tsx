import { usePathname } from '@/i18n/navigation'
import React from 'react'

export default function DetailBlogPage() {

    const pathname = usePathname();
    const id = pathname.split("/").at(-1);

  return (
    <div>DetailBlogPage {id}</div>
  )
}
