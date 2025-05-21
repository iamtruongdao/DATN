import React from 'react'
import Carousel from 'react-multi-carousel'
import { BookCard } from '../BookCard'
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
interface Book {
  id: string
  title: string
  avatar: string
  currentPrice: number
  originalPrice: number
  slug: string
}

const popularBooks: Book[] = [
  {
    id: '8',
    title: 'NGƯỜI GIÀU CÓ NHẤT THÀNH BABYLON',
    avatar: 'https://bizweb.dktcdn.net/100/363/455/products/grasshopper-sat-thu-bao-thu-01.jpg?v=1740450193993',
    currentPrice: 88000,
    originalPrice: 110000,
    slug: 'nguoi-giau-co-nhat-thanh-babylon'
  },
  {
    id: '9',
    title: 'ĐẮC NHÂN TÂM',
    avatar: 'https://bizweb.dktcdn.net/100/363/455/products/grasshopper-sat-thu-bao-thu-01.jpg?v=1740450193993',
    currentPrice: 76800,
    originalPrice: 96000,
    slug: 'dac-nhan-tam'
  },
  {
    id: '10',
    title: 'THÓI QUEN NGUYÊN TỬ',
    avatar: 'https://bizweb.dktcdn.net/100/363/455/products/grasshopper-sat-thu-bao-thu-01.jpg?v=1740450193993',
    currentPrice: 115200,
    originalPrice: 144000,
    slug: 'thoi-quen-nguyen-tu'
  },
  {
    id: '11',
    title: 'NGHĨ GIÀU LÀM GIÀU',
    avatar: 'https://bizweb.dktcdn.net/100/363/455/products/grasshopper-sat-thu-bao-thu-01.jpg?v=1740450193993',
    currentPrice: 98000,
    originalPrice: 120000,
    slug: 'nghi-giau-lam-giau'
  },
  {
    id: '12',
    title: 'NGƯỜI BÁN HÀNG VĨ ĐẠI NHẤT THẾ GIỚI',
    avatar: 'https://bizweb.dktcdn.net/100/363/455/products/grasshopper-sat-thu-bao-thu-01.jpg?v=1740450193993',
    currentPrice: 85000,
    originalPrice: 105000,
    slug: 'nguoi-ban-hang-vi-dai-nhat-the-gioi'
  },
  {
    id: '12',
    title: 'NGƯỜI BÁN HÀNG VĨ ĐẠI NHẤT THẾ GIỚI',
    avatar: 'https://bizweb.dktcdn.net/100/363/455/products/grasshopper-sat-thu-bao-thu-01.jpg?v=1740450193993',
    currentPrice: 85000,
    originalPrice: 105000,
    slug: 'nguoi-ban-hang-vi-dai-nhat-the-gioi'
  },
  {
    id: '12',
    title: 'NGƯỜI BÁN HÀNG VĨ ĐẠI NHẤT THẾ GIỚI',
    avatar: 'https://bizweb.dktcdn.net/100/363/455/products/grasshopper-sat-thu-bao-thu-01.jpg?v=1740450193993',
    currentPrice: 85000,
    originalPrice: 105000,
    slug: 'nguoi-ban-hang-vi-dai-nhat-the-gioi'
  },
  {
    id: '12',
    title: 'NGƯỜI BÁN HÀNG VĨ ĐẠI NHẤT THẾ GIỚI',
    avatar: 'https://bizweb.dktcdn.net/100/363/455/products/grasshopper-sat-thu-bao-thu-01.jpg?v=1740450193993',
    currentPrice: 85000,
    originalPrice: 105000,
    slug: 'nguoi-ban-hang-vi-dai-nhat-the-gioi'
  }
]
const CarouselCustom = () => {
  return (
    <Carousel
      swipeable={false}
      draggable={false}
      //   showDots={true}
      responsive={responsive}
      ssr={false} // means to render carousel on server-side.
      infinite={true}
      autoPlay={false}
      autoPlaySpeed={1000}
      keyBoardControl={true}
      //   customTransition='all .5'
      transitionDuration={500}
      containerClass='carousel-container'
      removeArrowOnDeviceType={['tablet', 'mobile']}
      dotListClass='custom-dot-list-style'
      itemClass='carousel-item-padding-40-px'
    >
      {popularBooks.map((book) => (
        <div className=' pl-2 flex justify-center !md:pl-4 '>
          <BookCard
            id={book.id}
            title={book.title}
            image={book.avatar}
            currentPrice={book.currentPrice}
            originalPrice={book.originalPrice}
            slug={book.slug}
          />
        </div>
      ))}
    </Carousel>
  )
}

export default CarouselCustom
