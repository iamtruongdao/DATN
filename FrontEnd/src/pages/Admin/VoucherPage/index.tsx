import { deleteDiscount, getDiscountFilter } from '@/apis/discount.api'
import { DataTable } from '@/components/Table'
import { TableToolbar } from '@/components/Table/TableToolBar'
import { Skeleton } from '@/components/ui/skeleton'
import { getColumn } from '@/pages/Admin/VoucherPage/column'
import { Discount } from '@/types'
import { capitalizeFirstLetter } from '@/utils'
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  PaginationState,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState
} from '@tanstack/react-table'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { VoucherDetailSheet } from './VoucherDetailSheet'

const VoucherPage = () => {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'CreatedAt', desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const [data, setData] = useState<Discount[]>([])

  const [totalRows, setTotalRows] = useState(10)
  const [globalFilter, setGlobalFilter] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showSort, setShowSort] = useState(false)

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [selectedVoucher, setSelectedVoucher] = useState<Discount | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [isRefreshing, setIsRefreshing] = useState(false)
  const handleViewDetail = async (author: Discount) => {
    try {
      // Giả lập dữ liệu chi tiết từ sách

      setSelectedVoucher(author) // Thay vì setSelectedPost
      setShowDetail(true)
    } catch (error) {
      console.error('Error generating book detail:', error)
    }
  }
  const handleDelete = async (discount: Discount) => {
    try {
      const res = await deleteDiscount(discount.id)
      if (res.code === 0) {
        toast.success('xóa thành công')
        await handleRefresh()
      }
      // Load lại danh sách sau khi xóa
    } catch (error) {
      console.error('Error deleting book:', error)
    }
  }
  const handleEdit = (voucher: Discount) => {
    navigate('/admin/voucher-edit', { state: voucher })
  }

  const table = useReactTable({
    data: data,
    columns: [...getColumn({ onDelete: handleDelete, onViewDetail: handleViewDetail, onEdit: handleEdit })],
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination,
      rowSelection,
      columnVisibility,
      globalFilter
    },
    pageCount: totalRows,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    enableSorting: true,
    enableColumnFilters: true,
    enableRowSelection: true,
    enableMultiSort: false,
    manualSorting: false,
    manualFiltering: false
  })
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()

      // Xây dựng filter request
      const sort = sorting.length > 0 ? sorting[0].id : ''
      const sortBy = sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined
      console.log(sorting)

      if (sort) params.append('currentFilter', capitalizeFirstLetter(sort))
      // Thêm điều kiện tìm kiếm nếu có
      if (globalFilter) params.append('searchString', globalFilter)
      if (pagination) params.append('pageNumber', (pagination.pageIndex + 1).toString())
      if (sortBy) params.append('sortOrder', sortBy)
      params.append('pageSize', pagination.pageSize.toString()) // Luôn có giá trị mặc định
      const queryParams: Record<string, string> = Object.fromEntries(params.entries())
      const response = await getDiscountFilter(queryParams)
      if (response.code === 0) {
        setData(response.data.items)
        setTotalRows(response.data.totalPages)
      }
    } finally {
      setIsLoading(false)
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter])
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
    setIsRefreshing(false)
  }
  const handleDeleteSelected = () => {
    const selectedRows = table.getSelectedRowModel().rows
    const selectedPosts = selectedRows.map((row) => row.original)
    // setPostsToDelete(selectedPosts);
    // setShowDeleteDialog(true)
  }
  useEffect(() => {
    fetchData()
  }, [fetchData])
  return (
    <div className='space-y-2'>
      <TableToolbar
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        showSort={showSort}
        setShowSort={setShowSort}
        onDeleteSelected={handleDeleteSelected}
      />
      <VoucherDetailSheet discount={selectedVoucher} open={showDetail} onOpenChange={setShowDetail} />
      <div className='p-2'>
        {isRefreshing || isLoading ? (
          <div className='space-y-4 p-2'>
            <Skeleton className='h-10 w-full rounded-md' />
            <Skeleton className='h-10 w-full rounded-md' />
            <Skeleton className='h-10 w-full rounded-md' />
          </div>
        ) : (
          <DataTable table={table} className='bg-background' />
        )}
      </div>
    </div>
  )
}

export default VoucherPage
