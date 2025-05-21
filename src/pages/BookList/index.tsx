// components/BookStore.tsx
import { getBookFilterApi } from '@/apis/book.api'
import { BookCard } from '@/components/BookCard'
import Pagination from '@/components/Pagination'
import BookCardSkeleton from '@/components/Skeleton/BookCardSkeleton'
import { Button } from '@/components/ui/button'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { setLoading } from '@/redux/slice/appSlice'
import { Book } from '@/types'

import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useParams, useSearchParams } from 'react-router-dom'

// Define the interfaces

// Country options for filter

// Sort options
type SortOption = Capitalize<keyof Book> | null
type OrderBy = 'asc' | 'desc'
const BookStore: React.FC = () => {
  const { categories } = useAppSelector((state) => state.category)
  const [queryParams] = useSearchParams()
  const { category } = useParams()
  const location = useLocation()
  const { isGlobalLoading } = useAppSelector((state) => state.app)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstMouth, setIsFirstMount] = useState(true)
  const [books, setBooks] = useState<Book[]>([])
  const [sortBy, setSortBy] = useState<SortOption>(null)
  const [orderBy, setOrderBy] = useState<OrderBy>('asc')
  const [searchQuery, setSerachQuery] = useState(queryParams.get('q') || '')
  const dispatch = useAppDispatch()
  const handlePageChange = (e: { selected: number }) => {
    setCurrentPage(e.selected + 1)
  }
  // Handle country selection

  const fetchBooks = async () => {
    const params = new URLSearchParams()
    // Chỉ thêm vào params nếu giá trị tồn tại
    if (searchQuery) params.append('searchString', searchQuery)
    if (currentPage) params.append('pageNumber', currentPage.toString())
    params.append('pageSize', '12') // Luôn có giá trị mặc định
    if (sortBy) params.append('currentFilter', sortBy)
    if (orderBy) params.append('sortOrder', orderBy)
    if (category) params.append('cate', category)
    const queryParams: Record<string, string> = Object.fromEntries(params.entries())
    if (isFirstMouth) {
      dispatch(setLoading(true))
    } else {
      setIsLoading(true)
    }
    try {
      const res = await getBookFilterApi(queryParams)
      if (res) {
        setBooks(res.data.items)
        setTotalPage(res.data.totalPages)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      if (isFirstMouth) {
        dispatch(setLoading(false))
        setIsFirstMount(false)
      } else {
        setIsLoading(false)
      }
    }
  }
  useEffect(() => {
    if (searchQuery !== queryParams.get('q')) {
      setSerachQuery(queryParams.get('q') || '')
    }
  }, [queryParams, location.search])
  useEffect(() => {
    setCurrentPage(1) // Reset current page to 1 when search query changes
  }, [sortBy, orderBy, searchQuery, category])
  useEffect(() => {
    fetchBooks() // Gọi lại API khi query thay đổi
  }, [searchQuery, currentPage, sortBy, orderBy, category])

  return (
    <div className='container   py-8'>
      <div className='flex flex-col lg:flex-row gap-8'>
        {/* Sidebar filters */}
        <div className='w-full lg:w-64 shrink-0'>
          <div className='bg-white p-4 rounded-lg shadow-sm'>
            <h2 className='text-lg font-semibold text-green-700 mb-4'>Danh mục</h2>
            <div className='space-y-2'>
              {categories.map((category) => (
                <NavLink
                  to={`/category/${category.slug}`}
                  key={category.id}
                  className={({ isActive }) => `block ${isActive ? 'text-green-600' : 'text-gray-700'}`}
                >
                  <div className='w-full hover:text-green-400'>
                    <label htmlFor={`category-${category.id}`} className='ml-2 text-sm font-medium cursor-pointer'>
                      {category.name}
                    </label>
                  </div>
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className='flex-1'>
          {/* Sorting options */}
          <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
            <span className='text-sm font-medium'>Sắp xếp theo</span>

            <Button
              variant={sortBy === null ? 'default' : 'outline'}
              onClick={() => setSortBy(null)}
              size='sm'
              className={`text-sm px-4 py-1 h-8 rounded-full border ${
                sortBy === null ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
              }`}
            >
              Mặc định
            </Button>

            <Button
              variant={sortBy === 'CreatedAt' ? 'default' : 'outline'}
              onClick={() => setSortBy('CreatedAt')}
              size='sm'
              className={`text-sm px-4 py-1 h-8 rounded-full border ${
                sortBy === 'CreatedAt' ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
              }`}
            >
              Sách mới
            </Button>

            <Button
              variant={sortBy === 'ProductPrice' && orderBy === 'asc' ? 'default' : 'outline'}
              onClick={() => {
                setSortBy('ProductPrice')
                setOrderBy('asc')
              }}
              size='sm'
              className={`text-sm px-4 py-1 h-8 rounded-full border ${
                sortBy === 'ProductPrice' && orderBy === 'asc'
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              Giá thấp - cao
            </Button>

            <Button
              variant={sortBy === 'ProductPrice' && orderBy === 'desc' ? 'default' : 'outline'}
              onClick={() => {
                setSortBy('ProductPrice')
                setOrderBy('desc')
              }}
              size='sm'
              className={`text-sm px-4 py-1 h-8 rounded-full border ${
                sortBy === 'ProductPrice' && orderBy === 'desc'
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              Giá cao - thấp
            </Button>
          </div>

          {/* Book grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 mt-5 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {isGlobalLoading ? (
              // Hiển thị loading toàn cục (spinner)
              <div className='col-span-full flex justify-center items-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700'></div>
                <span className='ml-3'>Đang tải dữ liệu...</span>
              </div>
            ) : isLoading ? (
              // Hiển thị skeleton cho các lần tải sau
              Array(12)
                .fill(0)
                .map((_, index) => <BookCardSkeleton key={`skeleton-${index}`} />)
            ) : // Hiển thị sách khi không loading
            books.length > 0 ? (
              books.map((book) => <BookCard key={book.id} book={book} />)
            ) : (
              <div className='col-span-full text-center py-8 text-gray-500'>Không tìm thấy sách nào phù hợp</div>
            )}
          </div>
          {!isLoading && books.length >= 0 ? (
            <Pagination pageCount={totalPage} onPageChange={handlePageChange} currentPage={currentPage} />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

export default BookStore
