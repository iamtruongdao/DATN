import { getTagBySlugApi } from '@/apis/tag.api'
import Breadscrumb from '@/components/Breadscrumb'
import NewsItem from '@/components/NewsItem'
import Pagination from '@/components/Pagination'
import AuthorSkeleton from '@/components/Skeleton/AuthorSkeleton'
import { Post, Tag } from '@/types'
import { formatDateStringToVietnamese } from '@/utils'
import { CalendarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

// Author type definition

const News: React.FC = () => {
  const { tag } = useParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState<Tag>({ createdAt: '', id: '', name: '', posts: [], slug: '' })
  const [news, setNews] = useState<Post[]>([])
  const handlePageChange = (e: { selected: number }) => {
    setCurrentPage(e.selected + 1)
  }
  // Sidebar news items

  const fetchPostByTag = async () => {
    const res = await getTagBySlugApi(tag!, 9, currentPage)
    if (res.code === 0) {
      setPosts(res.data)
      setTotalPage(res.data.totalPage!)
    }
  }
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
  useEffect(() => {
    fetchPostByTag()
  }, [tag, currentPage])
  return (
    <>
      <div className='text-sm p-4 text-gray-600 !mb-4 bg-green-50'>
        <div className='container !mx-auto '>
          <Breadscrumb breadcrumb={tag ? { [tag]: posts.name } : {}} />
        </div>
      </div>

      <div className='container !mx-auto !pb-6'>
        <div className='flex'>
          {/* Authors Grid */}
          <div className='w-3/4 !pr-8 '>
            <h1 className='text-2xl font-bold !mb-6 text-green-700 bg '>{posts.name}</h1>
            {isLoading ? (
              <AuthorSkeleton />
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                {posts.posts.length > 0 &&
                  posts.posts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/${posts.slug}/${post.slug}`}
                      className='overflow-hidden hover:shadow-lg transition-shadow bg-white'
                    >
                      <div className='aspect-video relative'>
                        <img src={post.thumbnail} alt={post.title} className='w-full h-full object-cover' />
                      </div>
                      <div className='p-3'>
                        <h3 className='font-medium text-sm line-clamp-2 mb-2 hover:text-green-600'>{post.title}</h3>
                        <div className='flex items-center text-gray-500 text-xs'>
                          <CalendarIcon className='h-3 w-3 mr-1' />
                          <span>{formatDateStringToVietnamese(post.createdAt!.toString())}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}

            {/* <AuthorSkeleton /> */}
            {/* Pagination */}
            {!isLoading && posts.posts.length > 0 ? (
              <Pagination pageCount={totalPage} onPageChange={handlePageChange} currentPage={currentPage} />
            ) : (
              ''
            )}
          </div>

          {/* News Sidebar */}
          <div className='w-1/4 !pl-4 border-l border-green-200'>
            <h2 className='text-xl font-bold mb-6 text-green-700'>Danh Mục Tin</h2>
            {news.length > 0 &&
              news.map((item, index) => (
                <NewsItem
                  link={`/tin-nha-nam/${item.slug}`}
                  key={index}
                  w='120px'
                  h='100px'
                  title={item.title}
                  date={item.createdAt!.toString()}
                  image={item.thumbnail}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default News
