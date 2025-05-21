import { Skeleton } from '@/components/ui/skeleton'

const BookCardSkeleton = () => {
  return (
    <div className='w-full max-w-sm rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
      {/* Image skeleton */}
      <div className='relative mb-4 flex h-48 items-center justify-center'>
        <Skeleton className='bg-gray-200 h-full w-full rounded-md' />
      </div>

      {/* Price section */}
      <div className='mb-4 flex items-center space-x-2'>
        <Skeleton className='bg-gray-200 h-4 w-full' />
      </div>

      {/* Buy button skeleton */}
      <div className='flex'>
        <Skeleton className='bg-gray-200 h-10 w-1/2 rounded-md' />
        <Skeleton className='bg-gray-200 ml-2 h-10 w-1/2 rounded-md' />
      </div>
    </div>
  )
}
export default BookCardSkeleton
