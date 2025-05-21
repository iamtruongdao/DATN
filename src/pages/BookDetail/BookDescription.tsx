import React, { FC, useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Book, Post } from '@/types'
import NewsItem from '@/components/NewsItem'
import { getTagBySlugApi } from '@/apis/tag.api'
import { formatDate } from '@/utils'

type BookDescriptionProps = {
  bookDetails: Book
}
const BookDescription: FC<BookDescriptionProps> = ({ bookDetails }) => {
  const [news, setNews] = useState<Post[]>([])

  const fetchNews = async () => {
    // setIsLoading(true)
    const res = await getTagBySlugApi('tin-nha-nam', 5, 1)
    if (res.code === 0) {
      // setIsLoading(false)
      setNews(res.data.posts)
    }
  }
  useEffect(() => {
    fetchNews()
  }, [])
  return (
    <div className='min-h-screen  p-4'>
      <div className='container flex justify-between max-w-7xl'>
        {/* Left section - Book description */}
        <div className='w-8/12'>
          <Card className='shadow-none border-none'>
            <CardContent>
              <h1 className='text-2xl font-bold text-green-600 mb-4'>Giới thiệu sách</h1>

              <ScrollArea className='h-[60vh] pr-4'>
                <div
                  dangerouslySetInnerHTML={{ __html: bookDetails.productDescription }}
                  className='space-y-4 text-gray-700'
                ></div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right section - Book details */}
        <div className='w-4/12'>
          <Card className='shadow-md mb-6 border-none'>
            <CardContent>
              <h2 className='text-2xl font-bold text-green-600 mb-4'>Thông tin chi tiết</h2>
              <ul className='space-y-3'>
                <li className='flex justify-between items-start'>
                  <span className='text-gray-600 flex items-center'>
                    <span className='mr-2'>•</span> Tác giả
                  </span>
                  <span className='font-medium text-right'>{bookDetails.authorName}</span>
                </li>
                <li className='flex justify-between items-start'>
                  <span className='text-gray-600 flex items-center'>
                    <span className='mr-2'>•</span> Dịch giả
                  </span>
                  <span className='font-medium text-right'>{bookDetails.translator}</span>
                </li>
                {/* <li className='flex justify-between items-start'>
                    <span className='text-gray-600 flex items-center'>
                      <span className='mr-2'>•</span> Nhà xuất bản
                    </span>
                    <span className='font-medium text-right'>{bookDetails.publisher}</span>
                  </li> */}
                {/* <li className='flex justify-between items-start'>
                    <span className='text-gray-600 flex items-center'>
                      <span className='mr-2'>•</span> Kích thước
                    </span>
                    <span className='font-medium text-right'>{bookDetails.}</span>
                  </li> */}
                <li className='flex justify-between items-start'>
                  <span className='text-gray-600 flex items-center'>
                    <span className='mr-2'>•</span> Số trang
                  </span>
                  <span className='font-medium text-right'>{bookDetails.pageNumber}</span>
                </li>
                <li className='flex justify-between items-start'>
                  <span className='text-gray-600 flex items-center'>
                    <span className='mr-2'>•</span> Ngày phát hành
                  </span>
                  <span className='font-medium text-right'>{formatDate(bookDetails.publicDate.toString())}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Book publisher section */}
          <Card className='shadow-md border-none'>
            <CardContent>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-2xl font-bold text-green-600'>Giới thiệu sách Nhà Nam</h2>
                <Badge className='bg-green-500 hover:bg-green-600'>
                  <span className='text-white'>New</span>
                </Badge>
              </div>

              <div className='relative'>
                <div className='space-y-2'>
                  {news.length > 0 &&
                    news.map((item, index) => (
                      <NewsItem
                        border
                        key={index}
                        w='150px'
                        link={`/tin-nh-nam/${item.slug}`}
                        h='120px'
                        title={item.title}
                        date={item.createdAt!}
                        image={item.thumbnail}
                      />
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BookDescription
