import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
const BookItemSkeleton = () => {
  return Array(5)
    .fill(0)
    .map((_, index) => (
      <Card key={`skeleton-${index}`} className='overflow-hidden'>
        <div className='relative pt-[125%]'>
          <Skeleton className='absolute inset-0' />
        </div>
        <CardContent className='p-4'>
          <Skeleton className='h-4 w-full mb-2' />
          <Skeleton className='h-4 w-2/3 mb-4' />
          <Skeleton className='h-5 w-1/2 mb-4' />
          <Skeleton className='h-10 w-full rounded' />
        </CardContent>
      </Card>
    ))
}

export default BookItemSkeleton
