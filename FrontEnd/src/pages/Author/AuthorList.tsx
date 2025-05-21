import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { getAuthorApi } from '@/apis/author.api'
import { getTagBySlugApi } from '@/apis/tag.api'
import Breadscrumb from '@/components/Breadscrumb'
import NewsItem from '@/components/NewsItem'
import Pagination from '@/components/Pagination'
import AuthorSkeleton from '@/components/Skeleton/AuthorSkeleton'
import { Author, Post } from '@/types'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// Author type definition

const AuthorList: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [news, setNews] = useState<Post[]>([])
  const fetchNews = async () => {
    // setIsLoading(true)
    const res = await getTagBySlugApi('tin-nha-nam', 5, 1)
    if (res.code === 0) {
      // setIsLoading(false)
      setNews(res.data.posts)
    }
  }
  // Sample author data with actual images where available
  const handlePageChange = (e: { selected: number }) => {
    setCurrentPage(e.selected + 1)
  }
  useEffect(() => {
    const fetData = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const res = await getAuthorApi({ pageNumber: currentPage, pageSize: 12 })
        setAuthors(res.data.items)
        setTotalPage(res.data.totalPages)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } finally {
        setIsLoading(false) // Đảm bảo tắt loading dù có lỗi hay không
      }
    }
    fetData()
  }, [currentPage])
  useEffect(() => {
    fetchNews()
  }, [])

  return (
    <>
      <div className='text-sm !p-4 text-gray-600 !mb-4 bg-green-50'>
        <div className='container !mx-auto '>
          <Breadscrumb breadcrumb={{ '123': 'Đào trường', '1234': 'trường' }} />
        </div>
      </div>
      <div className='container !mx-auto !pb-6'>
        <div className='flex'>
          {/* Authors Grid */}
          <div className='w-3/4 !pr-8 '>
            <h1 className='text-2xl font-bold !mb-6 text-green-700 bg '>Tác giả</h1>
            {isLoading ? (
              <AuthorSkeleton />
            ) : (
              <div className='grid grid-cols-4 gap-6'>
                {authors.map((author) => (
                  <div key={author.id} className='flex flex-col items-center'>
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
                  </div>
                ))}
              </div>
            )}

            {/* <AuthorSkeleton /> */}
            {/* Pagination */}
            {!isLoading && authors.length > 0 ? (
              <Pagination pageCount={totalPage} onPageChange={handlePageChange} currentPage={currentPage} />
            ) : (
              ''
            )}
          </div>

          {/* News Sidebar */}
          <div className='w-1/4 !pl-4 border-l border-green-200'>
            <h2 className='text-xl font-bold mb-6 text-green-700'>Danh Mục Tin</h2>
            {news.length &&
              news.map((item, index) => (
                <NewsItem
                  key={index}
                  link={`/tin-nha-nam/${item.slug}`}
                  w='120px'
                  h='100px'
                  title={item.title}
                  date={item.createdAt!}
                  image={item.thumbnail}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthorList
