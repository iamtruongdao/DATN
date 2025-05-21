import { Link } from 'react-router-dom'

import { ChevronRight } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useEffect, useState } from 'react'
import { Tag } from '@/types'
import { getTagBySlugApi } from '@/apis/tag.api'
import { formatDateStringToVietnamese } from '@/utils'

export function ArticleSection() {
  const [articles, setArticles] = useState<Tag>({ createdAt: '', id: '', name: '', posts: [], slug: '' })
  const fetchNews = async () => {
    const res = await getTagBySlugApi('review-sach-tren-bao-chi', 3, 1)
    if (res.code === 0) {
      setArticles(res.data)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])
  return (
    <div className='!p-6'>
      <div className='border-t-2 border-green-600 !pt-4 !mb-12'>
        <div className='flex items-center justify-between !mb-6'>
          <h2 className='text-2xl font-bold text-green-600'>Sách Nhà Nam trên báo chí</h2>
          <Link
            to={`/${articles.slug}`}
            className='text-green-700 flex items-center hover:text-green-800 cursor-pointer hover:bg-green-50 p-2'
          >
            Xem thêm
            <ChevronRight className='!ml-1 h-4 w-4' />
          </Link>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: false
          }}
          className='w-full'
        >
          <CarouselContent className='!-ml-2 md:-ml-4'>
            {articles.posts.length > 0 &&
              articles.posts.map((article) => (
                <CarouselItem key={article.id} className='!pl-2 !md:pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/3'>
                  <Link
                    to={`/${articles.slug}/${article.slug}`}
                    className='h-full flex-col items-center flex justify-center'
                  >
                    <Card className='border-none shadow-none py-0  gap-1 w-[90%] rounded-none  '>
                      <CardContent className='p-0 shrink-0 h-[250px] w-full'>
                        <div className='relative aspect-[4/3] w-full h-full overflow-hidden'>
                          <img
                            src={article.thumbnail || '/placeholder.svg'}
                            alt={article.title}
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                            className='object-cover h-full'
                          />
                        </div>
                      </CardContent>
                      <CardFooter className='px-1 flex flex-col flex-1  pt-0 '>
                        <div>
                          <h3 className='font-bold text-base line-clamp-2 mb-2'>{article.title}</h3>
                          <p
                            dangerouslySetInnerHTML={{ __html: article.content }}
                            className='text-sm text-gray-600 line-clamp-2'
                          ></p>
                        </div>
                        <p className='text-sm text-gray-500'>{formatDateStringToVietnamese(article.createdAt!)}</p>
                      </CardFooter>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious className='left-0 bg-white shadow-md' />
          <CarouselNext className='right-0 bg-white shadow-md' />
        </Carousel>
      </div>
    </div>
  )
}
