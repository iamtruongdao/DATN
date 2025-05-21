import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Post } from '@/types'
import { formatDateStringToVietnamese } from '@/utils'
import React from 'react'
import { Link } from 'react-router-dom'

type Props = {
  slide: Post[]
  opts: boolean
}
const CarouselBlog: React.FC<Props> = (props) => {
  const { slide, opts } = props
  return (
    <div className='lg:col-span-2 bg-white rounded-md flex-2/3 overflow-hidden shadow-sm'>
      <Carousel opts={{ loop: opts }} className='w-full'>
        <CarouselContent>
          {slide.length > 0 &&
            slide.map((item, index) => (
              <CarouselItem key={index}>
                <div className=''>
                  <Card className='border-none shadow-none py-0'>
                    <CardContent className='flex  items-center  px-0'>
                      <div className='flex flex-col w-full'>
                        <div className=' w-full h-[534px]'>
                          <img
                            src={item.thumbnail}
                            alt='Sự kiện giao lưu với tác giả và dịch giả'
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <div className='md:w-2/5 lg:w-full !p-6 flex justify-between'>
                          <div>
                            <Link to={'/'} className='text-xl !my-2 font-medium mb-4 hover:text-green-400'>
                              {item.title}
                            </Link>
                            <p className='text-gray-500 text-sm'>{formatDateStringToVietnamese(item.createdAt!)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default CarouselBlog
