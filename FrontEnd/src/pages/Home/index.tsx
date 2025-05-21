import { getAuthorApi } from '@/apis/author.api'
import { getBookFilterApi, getWaitPublishBookApi } from '@/apis/book.api'
import { ArticleSection } from '@/pages/Home/ArticleSection'
import Blog from '@/pages/Home/Blog'
import { BookSection } from '@/pages/Home/BookSection'
import SectionAuthor from '@/pages/Home/SectionAuthor'
import { Author, Book } from '@/types'
import { useEffect, useState } from 'react'

const Home = () => {
  const [authors, setAuthors] = useState<Author[]>([])
  const [newBooks, setNewBooks] = useState<Book[]>([])
  const [waitPublishBook, setWaitPublishBook] = useState<Book[]>([])
  const getAuthorSection = async () => {
    const res = await getAuthorApi({ pageNumber: 1, pageSize: 10 })
    if (res.code === 0) {
      setAuthors(res.data.items)
    }
  }
  const getNewBookSection = async () => {
    const res = await getBookFilterApi({
      pageNumber: '1',
      pageSize: '10',
      currentFilter: 'CreatedAt',
      sortOrder: 'desc'
    })
    if (res.code === 0) {
      setNewBooks(res.data.items)
    }
  }
  const getWaitPublishBookSection = async () => {
    const res = await getWaitPublishBookApi()
    if (res.code === 0) {
      setWaitPublishBook(res.data.items)
    }
  }
  useEffect(() => {
    getAuthorSection()
    getNewBookSection()
    getWaitPublishBookSection()
  }, [])
  return (
    <>
      <Blog />
      <SectionAuthor authors={authors} />
      <BookSection title='Sách mới' books={newBooks} viewMoreLink='/book' />
      <BookSection title='Sắp xuất bản' books={waitPublishBook} viewMoreLink='/book' />
      <ArticleSection />
    </>
  )
}

export default Home
