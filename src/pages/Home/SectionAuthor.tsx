import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Author } from '@/types'
import { ChevronRight, User } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

interface CarouselProps<T> {
  authors: T[]
  title?: string
  viewMoreText?: string
  onViewMore?: () => void
  itemsPerView?: number
}

const AuthorCarousel: React.FC<CarouselProps<Author>> = ({
  authors,
  title = 'Các tác giả',
  viewMoreText = 'Xem thêm',
  onViewMore = () => {},
  itemsPerView = 5
}) => {
  return (
    <div className=' border-t-2 border-t-[#228b22] !mx-auto  xs:max-w-4xl lg:max-w-7xl  !py-4'>
      <div className='flex justify-between items-center !mb-4'>
        <h2 className='text-xl font-bold text-green-700'>{title}</h2>
        <Link
          to={'/author'}
          onClick={onViewMore}
          className='text-green-700 flex items-center hover:text-green-800 cursor-pointer hover:bg-green-50 !-2'
        >
          {viewMoreText}
          <ChevronRight className='!ml-1 h-4 w-4' />
        </Link>
      </div>

      <div className='relative'>
        <Carousel
          opts={{
            align: 'start',
            loop: false,
            slidesToScroll: Math.min(itemsPerView, 1)
          }}
          className='w-full'
        >
          <CarouselContent>
            {authors.length > 0 &&
              authors.map((author, index) => (
                <CarouselItem key={index} className='cursor-pointer basis-1/3 min-w-24 md:basis-1/4 lg:basis-1/5'>
                  <Link to={`/author/${author.slug}`} className='flex flex-col items-center'>
                    <Avatar className='w-36 h-36 mb-3 !border-4 border-white shadow-md'>
                      <AvatarImage
                        src={author.avatar || '/api/placeholder/150/150'}
                        alt={author.authorName}
                        className='object-cover'
                      />
                      <AvatarFallback className='bg-green-100 text-green-700'>
                        {author.authorName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <p className='text-center font-medium !mt-2 text-gray-800'>{author.authorName}</p>
                  </Link>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className='left-0 cursor-pointer bg-white hover:bg-green-300 hover:text-white' />
          <CarouselNext className='right-0 bg-white cursor-pointer hover:bg-green-300 hover:text-white' />
        </Carousel>
      </div>
    </div>
  )
}

// Example usage component
type SectionAuthorProps = {
  authors: Author[]
}
const SectionAuthor: React.FC<SectionAuthorProps> = ({ authors }) => {
  return (
    <div className='!p-6'>
      <AuthorCarousel authors={authors} onViewMore={() => console.log('View more clicked')} />
    </div>
  )
}

export default SectionAuthor
