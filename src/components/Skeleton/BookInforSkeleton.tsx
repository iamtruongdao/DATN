import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const BookInforSkeleton: React.FC = () => {
  return (
    <div className='bg-[#F5F5F5] px-4 py-8 flex flex-col md:flex-row md:space-x-4'>
      {/* Book Cover Skeleton - 5 columns */}
      <div className='w-full md:w-5/12 flex justify-center items-center bg-white mb-6 md:mb-0 p-4 rounded-md'>
        <Skeleton className='bg-gray-200 max-h-96 h-96 w-64 rounded-md' />
      </div>

      {/* Product Details Skeleton - 5 columns */}
      <div className='w-full md:w-5/12 space-y-4'>
        {/* Title and Author Skeleton */}
        <div>
          <Skeleton className='bg-gray-300 h-10 w-4/5 mb-2' />
          <Skeleton className='bg-gray-300 h-5 w-2/5' />
        </div>

        {/* Price Section Skeleton */}
        <div className='flex items-center space-x-3'>
          <Skeleton className='bg-gray-300 h-8 w-24' />
          <Skeleton className='bg-gray-300 h-6 w-20' />
          <Skeleton className='bg-gray-300 h-6 w-12 rounded-full' />
        </div>

        {/* Quantity Selector Skeleton */}
        <div className='flex items-center space-x-3'>
          <Skeleton className='bg-gray-300 h-10 w-28 rounded-lg' />
          <Skeleton className='bg-gray-300 h-5 w-36' />
        </div>

        {/* Action Buttons Skeleton */}
        <div className='flex space-x-3'>
          <Skeleton className='bg-gray-300 h-10 flex-1 rounded-md' />
          <Skeleton className='bg-gray-300 h-10 flex-1 rounded-md' />
        </div>

        {/* Book Summary Skeleton */}
        <Card className='shadow-lg border-none'>
          <CardContent className='p-3'>
            <Skeleton className='bg-gray-300 h-6 w-40 mb-3' />
            <Skeleton className='bg-gray-300 h-4 w-full mb-2' />
            <Skeleton className='bg-gray-300 h-4 w-full mb-2' />
            <Skeleton className='bg-gray-300 h-4 w-full mb-2' />
            <Skeleton className='bg-gray-300 h-4 w-3/4' />
            <Skeleton className='bg-gray-300 h-6 w-24 mt-2' />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BookInforSkeleton
