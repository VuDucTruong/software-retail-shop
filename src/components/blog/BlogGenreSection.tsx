import { getRandomColor } from '@/lib/utils'
import React from 'react'

type Props = {
    genre: string,
    children: React.ReactNode,
}

export default function BlogGenreSection(props: Props) {

  const color = getRandomColor();

  return (
    <div className="flex flex-col gap-4 mt-10">
            <div className="flex w-full border-b-2" style={{ borderColor: color }}>
              <div className="p-2 inline-block text-white uppercase" style={{ backgroundColor: color }}>
                {props.genre}
              </div>
            </div>
            {props.children}
          </div>
  )
}