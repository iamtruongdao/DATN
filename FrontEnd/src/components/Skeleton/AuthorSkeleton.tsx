import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const AuthorSkeleton: React.FC = () => {
  const skeletonItems = Array(16).fill(null)

  return (
    <div className='grid grid-cols-4 gap-6'>
      {skeletonItems.map((_, index) => (
        <div key={index} className='flex flex-col items-center space-y-3'>
          <div className='flex flex-col items-center space-y-2'>
            <Skeleton className='w-24 h-24 rounded-full bg-gray-200' />
            <Skeleton className='h-4 w-30 !mt-4 bg-gray-200' />
          </div>
        </div>
      ))}
    </div>
  )
}

export default AuthorSkeleton
