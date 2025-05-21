import { CreateOrderShip, printShip } from '@/apis/ghn.api'
import { cancelOrderApi, confirmOrderApi, getOrderFilterApi } from '@/apis/order.api'
import { DataTable } from '@/components/Table'
import { TableToolbar } from '@/components/Table/TableToolBar'
import { Skeleton } from '@/components/ui/skeleton'
import { getColumn } from '@/pages/Admin/OrderPage/column'
import { Author, Order } from '@/types'
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
import PrepareShipmentDialog from './PrepareShipmentDialog'

const OrderPage = () => {
  const navigate = useNavigate()
  const [sorting, setSorting] = useState<SortingState>([{ id: 'CreatedAt', desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })
  const [data, setData] = useState<Order[]>([])
  const [totalRows, setTotalRows] = useState(10)
  const [globalFilter, setGlobalFilter] = useState('')
  const [showFilters, setShowFilters] = useState(true)
  const [showSort, setShowSort] = useState(false)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showPrepareShipment, setShowPrepareShipment] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleViewDetail = async (order: Order) => {
    navigate(`/admin/order/${order.id}`)
  }
  const handleDelete = async (order: Order) => {
    try {
      const res = await cancelOrderApi(order.id)
      if (res.code === 0) {
        toast.success('hủy đơn hàng thành công')
        await handleRefresh()
      }
      // Load lại danh sách sau khi xóa
    } catch (error) {
      console.error('Error deleting book:', error)
    }
  }
  const handleConfirm = async (order: Order) => {
    try {
      const res = await confirmOrderApi(order.id)
      if (res.code === 0) {
        toast.success('xác nhận đơn hàng thành công')
        await handleRefresh()
      }
      // Load lại danh sách sau khi xóa
    } catch (error) {
      console.error('Error deleting book:', error)
    }
  }
  const handleEdit = (author: Author) => {
    navigate('/admin/author-edit', { state: author })
  }
  const handleCreateOrderShip = async (order: Order) => {
    setSelectedOrder(order)
    setShowPrepareShipment(true)
  }
  const handleConfirmCreateOrderShip = async () => {
    setShowPrepareShipment(false)
    await handleRefresh()
  }
  const handlePrint = async (order: Order) => {
    const res = await printShip(order.trackingNumber!)
    if (res.code === 200) {
      window.open(`https://dev-online-gateway.ghn.vn/a5/public-api/printA5?token=${res.data.token}`, '_blank')
    }
  }
  const table = useReactTable({
    data: data,
    columns: [
      ...getColumn({
        onDelete: handleDelete,
        onCreate: handleCreateOrderShip,
        onViewDetail: handleViewDetail,
        onEdit: handleEdit,
        onPrintOrder: handlePrint,
        onConfirm: handleConfirm
      })
    ],
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

      if (sort) params.append('currentFilter', capitalizeFirstLetter(sort))
      // Thêm điều kiện tìm kiếm nếu có
      if (columnFilters.length > 0) params.append('status', columnFilters[0].value as string)
      if (pagination) params.append('pageNumber', (pagination.pageIndex + 1).toString())
      if (sortBy) params.append('sortOrder', sortBy)
      params.append('pageSize', pagination.pageSize.toString()) // Luôn có giá trị mặc định
      const queryParams: Record<string, string> = Object.fromEntries(params.entries())
      const response = await getOrderFilterApi(queryParams)
      if (response.code === 0) {
        setData(response.data.items)
        setTotalRows(response.data.totalPages)
      }
    } finally {
      setIsLoading(false)
    }
  }, [pagination.pageIndex, pagination.pageSize, sorting, globalFilter, columnFilters])
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
    setIsRefreshing(false)
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
      />
      {/* <AuthorDetailSheet author={selectedAuthor} open={showDetail} onOpenChange={setShowDetail} /> */}
      <PrepareShipmentDialog
        order={selectedOrder}
        open={showPrepareShipment}
        onOpenChange={setShowPrepareShipment}
        onConfirm={handleConfirmCreateOrderShip}
      />

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

export default OrderPage
