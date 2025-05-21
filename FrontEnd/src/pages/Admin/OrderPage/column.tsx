import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Order, OrderItem, OrderProduct } from '@/types'
import { formatMoney } from '@/utils'
import { OrderState, PAYMENT, PAYMENT_MAP, PAYMENT_STATUS_MAP, statusMap } from '@/utils/constant'
import { ColumnDef, Row } from '@tanstack/react-table'
import { BookOpen, ChevronDown, ChevronRight, MoreVertical, PencilLine, Trash2 } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { CancelOrderDialog } from './CancelOrderDialog'

interface ActionsProps {
  row: Row<Order>
  onEdit: (order: Order) => void
  onPrintOrder: (order: Order) => void
  onConfirm: (order: Order) => void
  onViewDetail: (order: Order) => void
  onDelete: (order: Order) => void
  onCreate: (order: Order) => void
}
export function Actions({ row, onViewDetail, onDelete, onCreate, onConfirm, onPrintOrder, onEdit }: ActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = (order: Order) => {
    onDelete(order)
    setShowDeleteDialog(false)
  }
  const isPrint = useMemo(() => {
    return row.original.orderStatus === OrderState.WaitingPickup && !!row.original.trackingNumber
  }, [row])
  const isCreateOrder = useMemo(() => {
    return row.original.orderStatus === OrderState.WaitingPickup && !row.original.trackingNumber
  }, [row])
  const isPending = useMemo(() => {
    return row.original.orderStatus === OrderState.Pending
  }, [row])
  const isCancel = useMemo(() => {
    return row.original.orderStatus === OrderState.Cancel
  }, [row])
  const handleClickDelete = () => {
    setMenuOpen(false) // đóng menu trước
    setTimeout(() => {
      setShowDeleteDialog(true) // mở dialog sau
    }, 100)
  }

  return (
    <>
      <div className='flex justify-end px-1'>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger>
            <Button variant='outline' className='flex cursor-pointer h-8 w-8 p-0 data-[state=open]:bg-muted'>
              <MoreVertical className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[160px] bg-white'>
            <DropdownMenuItem className='cursor-pointer hover:bg-gray-300' onClick={() => onViewDetail(row.original)}>
              <BookOpen className='mr-2 h-4 w-4' /> Chi tiết
            </DropdownMenuItem>

            {isPending && (
              <DropdownMenuItem
                className='cursor-pointer hover:bg-gray-300'
                // TODO: implement Edit function
                onClick={() => onConfirm(row.original)}
              >
                <PencilLine className='mr-2 h-4 w-4' /> Xác nhận
              </DropdownMenuItem>
            )}
            {isPrint && (
              <DropdownMenuItem
                className='cursor-pointer hover:bg-gray-300'
                // TODO: implement Edit function
                onClick={() => onPrintOrder(row.original)}
              >
                <PencilLine className='mr-2 h-4 w-4' /> In đơn
              </DropdownMenuItem>
            )}
            {isCreateOrder && (
              <DropdownMenuItem
                className='cursor-pointer hover:bg-gray-300'
                // TODO: implement Edit function
                onClick={() => onCreate(row.original)}
              >
                <PencilLine className='mr-2 h-4 w-4' /> Chuẩn bị hàng
              </DropdownMenuItem>
            )}
            {!isCancel && (
              <DropdownMenuItem
                className='text-destructive focus:text-destructive cursor-pointer hover:bg-gray-300'
                onClick={handleClickDelete}
              >
                <Trash2 className='mr-2 h-4 w-4' color='red' /> Hủy
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CancelOrderDialog
        order={row.original}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </>
  )
}
interface ColumnsProps {
  onViewDetail: (order: Order) => void
  onDelete: (order: Order) => void
  onEdit: (order: Order) => void
  onConfirm: (order: Order) => void
  onPrintOrder: (order: Order) => void
  onCreate: (order: Order) => void
}
export const getColumn = ({
  onDelete,
  onConfirm,
  onPrintOrder,
  onCreate,
  onViewDetail,
  onEdit
}: ColumnsProps): ColumnDef<Order>[] => {
  return [
    {
      accessorKey: 'orderItem',
      header: 'Sản Phẩm',
      cell: ({ row }) => {
        const items = row.original.orderItem
        return <ProductList products={items} />
      },
      enableColumnFilter: false
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Thanh toán',
      cell: ({ row }) => {
        const checkout = row.original.orderCheckout
        const paymentMethod = row.original.orderPayment || PAYMENT.VNPAY
        const paymentStatus = row.original?.paymentStatus
        return (
          <div className='w-full max-w-sm p-4 rounded-md  bg-white'>
            <div className='text-sm text-gray-500'>Tổng:</div>
            <div className='text-xl font-bold text-black'>
              {formatMoney(checkout.totalApplyDiscount + checkout.feeShip)}
            </div>
            <div className='text-sm text-gray-400'>{PAYMENT_MAP[paymentMethod]}</div>
            {paymentMethod === PAYMENT.VNPAY && paymentStatus && (
              <div className={`text-xs ${PAYMENT_STATUS_MAP[paymentStatus].color}`}>
                {PAYMENT_STATUS_MAP[paymentStatus].label}
              </div>
            )}
          </div>
        )
      },
      enableColumnFilter: false
    },
    {
      accessorKey: 'orderPayment',
      header: () => <div className='text-center'>Giao hàng</div>,
      cell: ({ row }) => {
        const trackingNumber = row.original?.trackingNumber
        return (
          <>
            <div className=''>GHN</div>
            {!!trackingNumber && <div className='text-lg text-gray-400'>Mã vận đơn {trackingNumber}</div>}
          </>
        )
      },
      enableSorting: false,
      enableColumnFilter: false
    },
    {
      id: 'orderStatus',
      accessorKey: 'orderStatus',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const status = row.original.orderStatus
        return (
          <div className={`relative font-bold  rounded-2xl text-center ${statusMap[status]?.color}`}>
            {statusMap[status]?.text}
          </div>
        )
      },
      enableSorting: false
    },
    {
      id: 'actions',
      size: 40,
      enableHiding: false,
      header: 'Hành động',
      cell: ({ row }) => (
        <Actions
          onEdit={onEdit}
          onPrintOrder={onPrintOrder}
          onCreate={onCreate}
          onConfirm={onConfirm}
          row={row}
          onViewDetail={onViewDetail}
          onDelete={onDelete}
        />
      )
    }
  ]
}
interface ProductItemProps {
  item: OrderItem
}

const ProductItem: React.FC<ProductItemProps> = ({ item }) => {
  return (
    <div className='flex items-start space-x-3 py-2 border-b border-gray-200'>
      <div className='flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden'>
        <img src={item.avatar} alt={item.productName} className='w-full h-full object-cover' />
      </div>
      <div className='flex-grow min-w-0'>
        <div className='flex justify-between items-start'>
          <h3 className='font-medium text-sm text-gray-800 truncate'>{item.productName}</h3>
          <span className='text-xs text-gray-500 flex-shrink-0 ml-1'>x{item.quantity}</span>
        </div>
      </div>
    </div>
  )
}
interface OrderItemProps {
  products: OrderProduct[]
}
const ProductList: React.FC<OrderItemProps> = ({ products }) => {
  const [showAll, setShowAll] = useState(false)

  // Check if there's only one product
  const singleProductMode = products.length === 1

  // If more than one product, apply pagination logic
  const displayedProducts = !singleProductMode && !showAll ? products.slice(0, 4) : products
  const hasMoreProducts = products.length > 4

  return (
    <div className='bg-white rounded-lg shadow w-[350px]'>
      <div className='border-b border-gray-200'>
        <div className='p-4'>
          {/* Display single product directly */}
          {singleProductMode ? (
            <ProductItem item={products[0].item} />
          ) : (
            <div>
              {displayedProducts.map((product, index) => (
                <ProductItem key={index} item={product.item} />
              ))}
            </div>
          )}
        </div>
      </div>
      {!singleProductMode && (
        <div className='flex justify-between items-center p-3 bg-gray-50 rounded-b-lg'>
          <span className='text-sm text-gray-500'>{products.length} units</span>
          {hasMoreProducts && (
            <button className='flex items-center text-sm text-blue-600' onClick={() => setShowAll(!showAll)}>
              {showAll ? (
                <>
                  Show less <ChevronDown className='w-4 h-4 ml-1' />
                </>
              ) : (
                <>
                  See all <ChevronRight className='w-4 h-4 ml-1' />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
