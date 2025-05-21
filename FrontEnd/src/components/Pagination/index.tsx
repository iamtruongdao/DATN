import { PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { FC } from 'react'
import ReactPaginate from 'react-paginate'
type PaginationProp = {
  pageCount: number
  currentPage: number
  onPageChange: (e: { selected: number }) => void
}
const Pagination: FC<PaginationProp> = ({ pageCount, currentPage, onPageChange }) => {
  return (
    <ReactPaginate
      previousLabel={
        <PaginationItem className='cursor-pointer'>
          <PaginationPrevious />
        </PaginationItem>
      }
      nextLabel={
        <PaginationItem className='cursor-pointer'>
          <PaginationNext />
        </PaginationItem>
      }
      renderOnZeroPageCount={null}
      breakLabel={'...'}
      pageCount={pageCount}
      forcePage={currentPage - 1}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={onPageChange}
      containerClassName='flex gap-2 justify-center !mt-8'
      activeClassName='bg-blue-500 w-8 h-8  text-white '
      pageClassName='flex item-centers rounded-md'
      pageLinkClassName='flex items-center justify-center w-8 h-8 text-gray-700 hover:bg-gray-100 rounded-md transition-colors cursor-pointer'
    />
  )
}

export default Pagination
