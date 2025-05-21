import { getTagBySlugApi } from '@/apis/tag.api'
import CarouselBlog from '@/components/CarouselBlog'
import NewsItem from '@/components/NewsItem'
import { Post } from '@/types'
import { useEffect, useState } from 'react'

const Blog = () => {
  const [slide, setSlide] = useState<Post[]>([])
  const [news, setNews] = useState<Post[]>([])

  const fetchNews = async () => {
    const res = await getTagBySlugApi('bien-tap-vien-gioi-thieu', 4, 1)
    if (res.code === 0) {
      setNews(res.data.posts)
    }
  }
  const fetchSlide = async () => {
    const res = await getTagBySlugApi('tin-nha-nam', 3, 1)
    if (res.code === 0) {
      setSlide(res.data.posts)
    }
  }
  useEffect(() => {
    fetchSlide()
    fetchNews()
  }, [])
  return (
    <div className='w-full bg-[#e9f4ec] py-8 px-4'>
      <div className='container  !mx-auto  max-w-7xl'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Main featured event - Takes up 2/3 of the grid on large screens */}
          <CarouselBlog opts slide={slide} />
          {/* Right sidebar with smaller news items */}
          <div className='lg:col-span-1  space-y-4'>
            {news.length > 0 &&
              news.map((item) => (
                <NewsItem
                  link={`/bien-tap-vien-gioi-thieu/${item.slug}`}
                  title={item.title}
                  h='125px'
                  w='196px'
                  image={item.thumbnail}
                  date={item.createdAt!}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog
