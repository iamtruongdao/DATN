import { getBookApi, getBookFilterApi } from '@/apis/book.api'
import Breadscrumb from '@/components/Breadscrumb'
import { useAppDispatch } from '@/hooks'
import BookInfo from '@/components/BookInfo'
import BookDescription from '@/pages/BookDetail/BookDescription'
import { BookSection } from '@/pages/Home/BookSection'
import { setLoading } from '@/redux/slice/appSlice'
import { Book } from '@/types'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const BookDetail = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const [book, setBook] = useState<Book>({
    author: '',
    authorName: '',
    avatar: '',
    category: [],
    cat: [],
    discount: 0,
    isPublic: false,
    productDescription: '',
    productName: '',
    productPrice: 0,
    productQuantity: 0,
    slug: '',
    pageNumber: 0,
    publicDate: new Date(),
    id: ''
  })
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([])

  const getBook = async () => {
    dispatch(setLoading(true))
    const res = await getBookApi(id)
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    if (res.code === 0) {
      setBook(res.data)
      const response = await getBookFilterApi({ pageSize: '11', pageNumber: '1', cate: res.data.category[0].id })
      if (response.code === 0) {
        const filteredBooks = response.data.items.filter((item: Book) => item.slug !== res.data.slug)
        setRelatedBooks(filteredBooks)
      }
      dispatch(setLoading(false))
    }
  }
  useEffect(() => {
    getBook()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  return (
    <>
      <div className='text-sm p-4 text-gray-600  bg-green-50'>
        <Breadscrumb
          breadcrumb={
            _.every(book, (value) => !_.isNil(value) && value !== '') && id
              ? { slug: book.category[0].slug, name: book.category[0].name, [id]: book.productName }
              : {}
          }
        />
      </div>

      <BookInfo book={book} hideDescription />
      <BookDescription bookDetails={book} />
      <BookSection title='Có thể bạn cũng thích' books={relatedBooks} viewMoreLink='/book' />
    </>
  )
}

export default BookDetail
