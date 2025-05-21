import { formatDateStringToVietnamese } from '@/utils'
import React from 'react'
import { Link } from 'react-router-dom'
type NewsItemProp = {
  w: string
  h: string
  link: string
  image: string
  title?: string
  date: string
  border?: boolean
}
const NewsItem: React.FC<NewsItemProp> = (props) => {
  const { w, h, image, title, date, link, border = false } = props
  return (
    <div
      className={`py-4 cursor-pointer ${!border ? 'border-b-[1px] border-b-[#BBBBBF]' : ''}  first:pt-0  last:border-b-0 `}
    >
      <Link to={link}>
        <div
          className={`flex overflow-hidden ${border ? 'border-[1px] border-[#BBBBBF]' : ''} rounded-md shadow-sm`}
          style={{ height: h }}
        >
          <div style={{ width: w }} className={`shrink-0 h-full  `}>
            <img src={image} alt='Hành trình khám phá' className={`w-full h-full  object-cover`} />
          </div>
          <div className={`w-full p-4 bg-white`}>
            <h3 className='font-medium mb-2 text-sm line-clamp-2'>{title}</h3>
            <p className='text-gray-500 text-xs'>{formatDateStringToVietnamese(date)}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default NewsItem
