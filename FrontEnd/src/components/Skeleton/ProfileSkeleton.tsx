import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const ProfileSkeleton: React.FC = () => {
  return (
    <Card className='max-w-4xl bg-white border-none  mx-auto p-4 shadow-none'>
      <CardContent className='px-6'>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-6'>
          {/* Avatar skeleton */}
          <div className='flex-shrink-0'>
            <Skeleton className='h-32 w-32 bg-gray-200 rounded-full' />
          </div>

          <div className='flex-1 text-center md:text-left w-full'>
            {/* Name skeleton */}
            <Skeleton className='h-8 w-48 mb-4 bg-gray-200' />

            {/* Bio skeleton - multiple lines */}
            <Skeleton className='h-4 w-full mb-2 bg-gray-200' />
            <Skeleton className='h-4 w-full mb-2 bg-gray-200' />
            <Skeleton className='h-4 w-3/4 bg-gray-200' />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfileSkeleton
