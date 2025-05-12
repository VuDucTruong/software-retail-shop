import React from 'react'

export default function LoadingPage() {
  return (
    <div className='flex flex-col justify-center items-center gap-2 h-full'>
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      <h1 className='text-xl font-bold'>Loading...</h1>
      <p className='text-gray-500'>Please wait while we load the page.</p>
    </div>
  )
}
