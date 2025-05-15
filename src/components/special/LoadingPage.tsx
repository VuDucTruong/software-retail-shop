import React from 'react'

export default function LoadingPage() {
  return (
    <div className='flex flex-col justify-center items-center gap-2 h-full'>
      <div className="animate-spin rounded-full h-28 w-28 border-b-3 border-blue-500"></div>
      <h1 className='text-xl font-bold'>Đang tải...</h1>
      <p className='text-gray-500'>Vui lòng chờ trong khi đang tải trang</p>
    </div>
  )
}
