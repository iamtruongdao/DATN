import { BookCard } from '@/components/BookCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Book } from '@/types'
import { MouseEventHandler } from 'react'
import Carousel from 'react-multi-carousel'
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 1 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
}

interface BookSectionProps {
  title: string
  books: Book[]
  viewMoreLink: string
}
const popularBooks: Book[] = [
  {
    id: '8',
    productName: 'NGƯỜI GIÀU CÓ NHẤT THÀNH BABYLON',
    avatar: 'https://bizweb.dktcdn.net/100/363/455/products/grasshopper-sat-thu-bao-thu-01.jpg?v=1740450193993',
    discountPrice: 88000,
    productPrice: 110000,
    slug: 'nguoi-giau-co-nhat-thanh-babylon',
    discount: 20,
    productQuantity: 100,
    productDescription: 'Cuốn sách tài chính kinh điển',
    authorName: 'George S. Clason',
    author: 'George S. Clason',
    category: [],
    isPublic: true
  },
  {
    id: '9',
    productName: 'ĐẮC NHÂN TÂM',
    avatar: 'https://bizweb.dktcdn.net/100/363/455/products/grasshopper-sat-thu-bao-thu-01.jpg?v=1740450193993',
    discountPrice: 76800,
    productPrice: 96000,
    slug: 'dac-nhan-tam',
    discount: 20,
    productQuantity: 150,
    productDescription: 'Cuốn sách giúp bạn hiểu về nghệ thuật giao tiếp',
    authorName: 'Dale Carnegie',
    author: 'Dale Carnegie',
    category: [],
    isPublic: true
  },
  {
    id: '10',
    productName: 'THÓI QUEN NGUYÊN TỬ',
    avatar: 'https://bizweb.dktcdn.net/100/363/455/products/grasshopper-sat-thu-bao-thu-01.jpg?v=1740450193993',
    discountPrice: 115200,
    productPrice: 144000,
    slug: 'thoi-quen-nguyen-tu',
    discount: 20,
    productQuantity: 120,
    productDescription: 'Xây dựng thói quen tốt dễ dàng hơn bao giờ hết',
    authorName: 'James Clear',
    author: 'James Clear',
    category: [],
    isPublic: true
  },
  {
    id: '11',
    productName: 'NGHĨ GIÀU LÀM GIÀU',
    avatar: 'https://bizweb.dktcdn.net/100/363/455/products/grasshopper-sat-thu-bao-thu-01.jpg?v=1740450193993',
    discountPrice: 98000,
    productPrice: 120000,
    slug: 'nghi-giau-lam-giau',
    discount: 18,
    productQuantity: 130,
    productDescription: 'Bí quyết tư duy của những người thành công',
    authorName: 'Napoleon Hill',
    author: 'Napoleon Hill',
    category: [],
    isPublic: true
  },
  {
    id: '12',
    productName: 'NGƯỜI BÁN HÀNG VĨ ĐẠI NHẤT THẾ GIỚI',
    avatar: 'https://bizweb.dktcdn.net/100/363/455/products/grasshopper-sat-thu-bao-thu-01.jpg?v=1740450193993',
    discountPrice: 85000,
    productPrice: 105000,
    slug: 'nguoi-ban-hang-vi-dai-nhat-the-gioi',
    discount: 19,
    productQuantity: 140,
    productDescription: 'Những nguyên tắc thành công trong bán hàng',
    authorName: 'Og Mandino',
    author: 'Og Mandino',
    category: [],
    isPublic: true
  }
]
export function BookSection({ title = 'Sách mới', books = popularBooks, viewMoreLink = 's' }: BookSectionProps) {
  return (
    <div className='!p-6'>
      <div className='border-t-2 border-green-600 !pt-4 !mb-12'>
        <div className='flex items-center justify-between !mb-6'>
          <h2 className='text-2xl font-bold text-green-600'>{title}</h2>
          <Link
            to={viewMoreLink}
            className='text-green-700 flex items-center hover:text-green-800 cursor-pointer hover:bg-green-50 p-2'
          >
            Xem thêm
            <ChevronRight className='ml-1 h-4 w-4' />
          </Link>
        </div>

        <Carousel
          swipeable={false}
          draggable={false}
          responsive={responsive}
          ssr={false} // means to render carousel on server-side.
          infinite={true}
          autoPlay={false}
          autoPlaySpeed={1000}
          keyBoardControl={true}
          transitionDuration={500}
          containerClass='carousel-container'
          removeArrowOnDeviceType={['tablet', 'mobile']}
          dotListClass='custom-dot-list-style'
          itemClass='carousel-item-padding-40-px'
          customLeftArrow={<CusTomLeft />}
          customRightArrow={<CusTomRight />}
        >
          {books.map((book) => (
            <div className=' pl-2 flex justify-center !md:pl-4 '>
              <BookCard book={book} />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  )
}

const CusTomLeft = ({ onClick }: { onClick?: MouseEventHandler<HTMLButtonElement> | undefined }) => {
  return (
    <Button
      onClick={onClick}
      variant='outline'
      size='icon'
      className={`w-10 h-10 top-1/3  rounded-full cursor-pointer bg-[#00000080] absolute hover:bg-gray-700 border-2 border-white/20 flex items-center justify-center transition-all duration-200 p-0 shadow-md`}
      aria-label='Go to previous slide'
    >
      <div className='flex items-center justify-center'>
        <ChevronLeft size={12} className='text-white ml-0.5' />
      </div>
    </Button>
  )
}
const CusTomRight = ({ onClick }: { onClick?: MouseEventHandler<HTMLButtonElement> | undefined }) => {
  return (
    <Button
      onClick={onClick}
      variant='outline'
      size='icon'
      className={`w-10 h-10 right-0 top-1/3 rounded-full cursor-pointer bg-[#00000080] absolute hover:bg-gray-700 border-2 border-white/20 flex items-center justify-center transition-all duration-200 p-0 shadow-md`}
      aria-label='Go to previous slide'
    >
      <div className='flex items-center justify-center'>
        <ChevronRight size={12} className='text-white ml-0.5' />
      </div>
    </Button>
  )
}
