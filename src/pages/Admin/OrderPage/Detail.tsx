import { cancelOrderApi, getOrderByIdApi } from '@/apis/order.api'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Order } from '@/types'
import { formatDate } from '@/utils'
import { OrderState, PAYMENT, PAYMENT_MAP, PAYMENT_STATUS_MAP, PaymentStatus, statusMap } from '@/utils/constant'
import { AlertCircle, ArrowLeft, Check, Clock, Copy, CreditCard, Home, Printer, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CancelOrderDialog } from './CancelOrderDialog'

// Format ngày tháng

// Tạo dữ liệu mẫu
const sampleOrder: Order = {
  id: 'ORD-12345',
  userId: 'USR-98765',
  orderCheckout: {
    totalPrice: 2480000,
    totalApplyDiscount: 2290000,
    feeShip: 30000
  },
  orderAddress: {
    fullName: 'Nguyễn Văn A',
    phoneNumber: '0901234567',
    address: '123 Đường ABC',
    street: 'Đường ABC',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh'
  },
  orderItem: [
    {
      totalPrice: 1600000,
      totalApplyDiscount: 1440000,
      item: {
        productId: 'PRD-001',
        productName: 'Áo thun nam cao cấp',
        avatar: '/api/placeholder/100/100',
        price: 800000,
        discount: 10,
        quantity: 2
      }
    },
    {
      totalPrice: 880000,
      totalApplyDiscount: 850000,
      item: {
        productId: 'PRD-002',
        productName: 'Quần jeans nam',
        avatar: '/api/placeholder/100/100',
        price: 880000,
        discount: 3,
        quantity: 1
      }
    }
  ],
  orderStatus: OrderState.WaitingPickup,
  orderPayment: PAYMENT.VNPAY,
  paymentStatus: PaymentStatus.WaitingPaid,
  orderCode: 'OC-98765',
  trackingNumber: 'TN-45678',
  linkPayment: 'https://payment.example.com/link',
  createdAt: new Date('2025-05-01T08:30:00')
}

// Lấy icon cho phương thức thanh toán
const getPaymentMethodIcon = (method: PAYMENT) => {
  switch (method) {
    case PAYMENT.COD:
      return <Home className='w-4 h-4' />
    case PAYMENT.VNPAY:
      return <CreditCard className='w-4 h-4' />
    default:
      return <CreditCard className='w-4 h-4' />
  }
}

// Format tiền Việt Nam
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount)
}

// Lấy biểu tượng và màu sắc dựa trên trạng thái đơn hàng
const getStatusIconAndColor = (currentStatus: OrderState, stageStatus: OrderState | OrderState[]) => {
  // Nếu đơn hàng đã hủy, hiển thị X màu đỏ cho tất cả các giai đoạn chưa hoàn thành
  if (currentStatus === OrderState.Cancel) {
    // Kiểm tra xem giai đoạn này có được hoàn thành trước khi hủy không
    if (Array.isArray(stageStatus)) {
      const isCompleted = stageStatus.includes(currentStatus)
      return {
        icon: isCompleted ? <Check className='h-4 w-4 text-white' /> : <X className='h-4 w-4 text-white' />,
        color: isCompleted ? 'bg-green-500' : 'bg-red-500'
      }
    }

    if (stageStatus === OrderState.Pending) {
      // Đã nhận đơn hàng luôn được hoàn thành
      return {
        icon: <Check className='h-4 w-4 text-white' />,
        color: 'bg-green-500'
      }
    }

    return {
      icon: <X className='h-4 w-4 text-white' />,
      color: 'bg-red-500'
    }
  }

  // Xử lý trường hợp mảng các trạng thái
  if (Array.isArray(stageStatus)) {
    const isCompleted = stageStatus.includes(currentStatus)
    return {
      icon: isCompleted ? <Check className='h-4 w-4 text-white' /> : <Clock className='h-4 w-4 text-white' />,
      color: isCompleted ? 'bg-green-500' : 'bg-gray-300'
    }
  }

  // So sánh với thứ tự trạng thái
  const orderStates = [OrderState.Pending, OrderState.WaitingPickup, OrderState.Shipping, OrderState.Delivered]

  const currentIndex = orderStates.indexOf(currentStatus)
  const stageIndex = orderStates.indexOf(stageStatus)

  const isCompleted = currentIndex >= stageIndex

  return {
    icon: isCompleted ? <Check className='h-4 w-4 text-white' /> : <Clock className='h-4 w-4 text-white' />,
    color: isCompleted ? 'bg-green-500' : 'bg-gray-300'
  }
}

const OrderDetailAdmin: React.FC = () => {
  const [order, setOrder] = useState<Order>(sampleOrder)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const { orderId } = useParams()
  const fetchOrder = async () => {
    const res = await getOrderByIdApi(orderId!)
    if (res.code === 0) {
      setOrder(res.data)
    }
  }
  const handleDelete = async (order: Order) => {
    try {
      const res = await cancelOrderApi(order.id)
      if (res.code === 0) {
        toast.success('hủy đơn hàng thành công')
        await fetchOrder()
      }
      // Load lại danh sách sau khi xóa
    } catch (error) {
      console.error('Error deleting book:', error)
    }
  }
  useEffect(() => {
    fetchOrder()
  }, [])
  return (
    <>
      <div className='container mx-auto py-6 px-2'>
        <div className='flex items-center mb-6'>
          <Link to={'/admin/order'}>
            <Button variant='outline' size='sm' className='mr-2'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Quay lại
            </Button>
          </Link>

          <h1 className='text-2xl font-bold'>Chi tiết đơn hàng #{order.orderCode}</h1>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Cột thông tin chính đơn hàng */}
          <div className='md:col-span-2 space-y-6'>
            {/* Card trạng thái đơn hàng */}
            <Card>
              <CardHeader className='pb-3'>
                <div className='flex justify-between items-center'>
                  <CardTitle>Trạng thái đơn hàng</CardTitle>
                  {order.orderStatus === OrderState.WaitingPickup && order.trackingNumber && (
                    <div className='flex space-x-2'>
                      <Button variant='outline' size='sm'>
                        <Printer className='h-4 w-4 mr-2' />
                        In đơn hàng
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription>Được tạo vào {formatDate(order.createdAt.toString())}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center mb-4'>
                  <Badge className={`${statusMap[order.orderStatus].color} mr-2`} variant='outline'>
                    {statusMap[order.orderStatus].text}
                  </Badge>
                  {/* <span className='text-sm text-gray-500'></span> */}
                </div>

                {/* Thông báo nếu đơn hàng đã hủy */}
                {order.orderStatus === OrderState.Cancel && (
                  <Alert className='mb-4 bg-red-50 border-red-200'>
                    <AlertCircle className='h-4 w-4 text-red-600' />
                    <AlertTitle className='text-red-700'>Đơn hàng đã hủy</AlertTitle>
                    <AlertDescription className='text-red-600'>
                      Đơn hàng này đã bị hủy và không thể tiếp tục xử lý.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Hiển thị Timeline */}
                <div className='relative border-l-2 border-gray-200 pl-8 space-y-6 ml-4'>
                  {/* Đã giao hàng */}
                  <div className='relative'>
                    {(() => {
                      const { icon, color } = getStatusIconAndColor(order.orderStatus, OrderState.Delivered)
                      return <div className={`absolute -left-[2.35rem] p-1 rounded-full ${color}`}>{icon}</div>
                    })()}
                    <h3 className='font-medium'>Đã giao hàng</h3>
                    <p className='text-sm text-gray-500'>
                      {order.orderStatus === OrderState.Delivered
                        ? 'Đã giao thành công ngày 03/05/2025'
                        : order.orderStatus === OrderState.Cancel
                          ? 'Đơn hàng đã bị hủy, không thể giao hàng'
                          : 'Đơn hàng chưa được giao'}
                    </p>
                  </div>

                  {/* Đang giao hàng */}
                  <div className='relative'>
                    {(() => {
                      const { icon, color } = getStatusIconAndColor(order.orderStatus, [
                        OrderState.Shipping,
                        OrderState.Delivered
                      ])
                      return <div className={`absolute -left-[2.35rem] p-1 rounded-full ${color}`}>{icon}</div>
                    })()}
                    <h3 className='font-medium'>Đang giao hàng</h3>
                    <p className='text-sm text-gray-500'>
                      {order.orderStatus === OrderState.Shipping || order.orderStatus === OrderState.Delivered
                        ? 'Đơn hàng đang được giao đến khách hàng'
                        : order.orderStatus === OrderState.Cancel
                          ? 'Đơn hàng đã bị hủy, không thể giao hàng'
                          : 'Đơn hàng chưa được giao'}
                    </p>
                    {order.trackingNumber &&
                      order.orderStatus !== OrderState.Cancel &&
                      order.orderStatus === OrderState.Shipping && (
                        <div className='mt-2 flex items-center'>
                          <span className='text-sm mr-2'>Mã vận đơn: {order.trackingNumber}</span>
                          <Button variant='ghost' size='sm' className='h-6 p-0'>
                            <Copy className='h-3 w-3' />
                          </Button>
                        </div>
                      )}
                  </div>

                  {/* Chờ lấy hàng */}
                  <div className='relative'>
                    {(() => {
                      const { icon, color } = getStatusIconAndColor(order.orderStatus, [
                        OrderState.WaitingPickup,
                        OrderState.Shipping,
                        OrderState.Delivered
                      ])
                      return <div className={`absolute -left-[2.35rem] p-1 rounded-full ${color}`}>{icon}</div>
                    })()}
                    <h3 className='font-medium'>Chờ lấy hàng</h3>
                    <p className='text-sm text-gray-500'>
                      {order.orderStatus === OrderState.WaitingPickup && !order.trackingNumber
                        ? 'Đang chuẩn bị hàng'
                        : order.orderStatus !== OrderState.Cancel
                          ? 'Đơn hàng đã bị hủy không thể chuẩn bị hàng'
                          : 'Đơn hàng đã được giao cho nhà vận chuyển'}
                    </p>
                    {order.trackingNumber &&
                      order.orderStatus !== OrderState.Cancel &&
                      order.orderStatus === OrderState.WaitingPickup && (
                        <div className='mt-2 flex items-center'>
                          <span className='text-sm mr-2'>Mã vận đơn: {order.trackingNumber}</span>
                          <Button variant='ghost' size='sm' className='h-6 p-0'>
                            <Copy className='h-3 w-3' />
                          </Button>
                        </div>
                      )}
                  </div>
                  {/* Đã xác nhận đơn hàng */}
                  <div className='relative'>
                    {(() => {
                      const { icon, color } = getStatusIconAndColor(order.orderStatus, [
                        OrderState.WaitingPickup,
                        OrderState.Shipping,
                        OrderState.Delivered
                      ])
                      return <div className={`absolute -left-[2.35rem] p-1 rounded-full ${color}`}>{icon}</div>
                    })()}
                    <h3 className='font-medium'>Đã xác nhận đơn hàng</h3>
                    <p className='text-sm text-gray-500'>
                      {order.orderStatus === OrderState.Pending
                        ? 'Đơn hàng chưa được xác nhận'
                        : order.orderStatus === OrderState.Cancel
                          ? 'Đơn hàng đã bị hủy trước khi được xác nhận'
                          : 'Đơn hàng đã được xác nhận'}
                    </p>
                  </div>

                  {/* Đã nhận đơn hàng - luôn hoàn thành */}
                  <div className='relative'>
                    <div className='absolute -left-[2.35rem] p-1 rounded-full bg-green-500'>
                      <Check className='h-4 w-4 text-white' />
                    </div>
                    <h3 className='font-medium'>Đã nhận đơn hàng</h3>
                    <p className='text-sm text-gray-500'>
                      Đơn hàng đã được tạo vào {formatDate(order.createdAt.toString())}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card thông tin sản phẩm */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin sản phẩm</CardTitle>
                <CardDescription>{order.orderItem.length} sản phẩm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  {order.orderItem.map((product) => (
                    <div key={product.item.productId} className='flex items-start space-x-4'>
                      <div className='h-20 w-20 rounded-md overflow-hidden flex-shrink-0'>
                        <img
                          src={product.item.avatar}
                          alt={product.item.productName}
                          className='h-full w-full object-cover'
                        />
                      </div>
                      <div className='flex-1'>
                        <h3 className='font-medium'>{product.item.productName}</h3>
                        <div className='text-sm text-gray-500'>Mã sản phẩm: {product.item.productId}</div>
                        <div className='text-sm text-gray-500'>
                          SL: {product.item.quantity} x {formatCurrency(product.item.price)}
                        </div>
                        {product.item.discount > 0 && (
                          <div className='text-sm text-green-600'>
                            Giảm giá: {(product.item.discount / product.item.price) * 100}%
                          </div>
                        )}
                      </div>
                      <div className='text-right'>
                        <div className='font-medium'>{formatCurrency(product.totalApplyDiscount)}</div>
                        {product.totalPrice !== product.totalApplyDiscount && (
                          <div className='text-sm text-gray-500 line-through'>{formatCurrency(product.totalPrice)}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <Separator />
              <CardFooter className='flex justify-between py-4'>
                <div>
                  <p className='text-sm text-gray-500'>Tổng tiền hàng</p>
                  <p className='text-sm text-gray-500'>Phí vận chuyển</p>
                  <p className='text-sm text-gray-500'>Giảm giá</p>
                  <p className='font-medium mt-2'>Thành tiền</p>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-gray-500'>{formatCurrency(order.orderCheckout.totalPrice)}</p>
                  <p className='text-sm text-gray-500'>{formatCurrency(order.orderCheckout.feeShip)}</p>
                  <p className='text-sm text-gray-500'>
                    {formatCurrency(order.orderCheckout.totalPrice - order.orderCheckout.totalApplyDiscount)}
                  </p>
                  <p className='font-medium mt-2'>
                    {formatCurrency(order.orderCheckout.totalApplyDiscount + order.orderCheckout.feeShip)}
                  </p>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Cột thông tin bên phải */}
          <div className='space-y-6'>
            {/* Card khách hàng */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin khách hàng</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <h3 className='font-medium'>Mã khách hàng</h3>
                  <p className='text-sm text-gray-500'>{order.userId}</p>
                </div>
                <div>
                  <h3 className='font-medium'>Người nhận</h3>
                  <p className='text-sm text-gray-500'>{order.orderAddress.fullName}</p>
                </div>
                <div>
                  <h3 className='font-medium'>Số điện thoại</h3>
                  <p className='text-sm text-gray-500'>{order.orderAddress.phoneNumber}</p>
                </div>
                <div>
                  <h3 className='font-medium'>Địa chỉ giao hàng</h3>
                  <p className='text-sm text-gray-500'>
                    {order.orderAddress.address}, {order.orderAddress.street}, {order.orderAddress.district},{' '}
                    {order.orderAddress.city}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card thanh toán */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin thanh toán</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex justify-between items-center'>
                  <div>
                    <h3 className='font-medium'>Phương thức thanh toán</h3>
                    <div className='flex items-center space-x-1 mt-1'>
                      {getPaymentMethodIcon(order.orderPayment)}
                      <span className='text-sm text-gray-500'>{PAYMENT_MAP[order.orderPayment]}</span>
                    </div>
                  </div>
                  {order.paymentStatus && (
                    <Badge
                      className={`bg-${PAYMENT_STATUS_MAP[order.paymentStatus].color.replace('text', 'bg')}-100`}
                      variant='outline'
                    >
                      {PAYMENT_STATUS_MAP[order.paymentStatus].label}
                    </Badge>
                  )}
                </div>

                {order.paymentStatus === PaymentStatus.Paid && (
                  <Alert>
                    <Check className='h-4 w-4' />
                    <AlertTitle>Đã thanh toán</AlertTitle>
                    <AlertDescription>Đơn hàng đã được thanh toán thành công</AlertDescription>
                  </Alert>
                )}

                {order.paymentStatus === PaymentStatus.WaitingPaid && (
                  <Alert>
                    <AlertCircle className='h-4 w-4' />
                    <AlertTitle>Chờ thanh toán</AlertTitle>
                    <AlertDescription>Đơn hàng đang chờ được thanh toán</AlertDescription>
                  </Alert>
                )}

                {order.paymentStatus === PaymentStatus.Refund && (
                  <Alert className='bg-blue-50 border-blue-200'>
                    <AlertCircle className='h-4 w-4 text-blue-600' />
                    <AlertTitle className='text-blue-700'>Hoàn tiền</AlertTitle>
                    <AlertDescription className='text-blue-600'>
                      Tiền đơn hàng đã được hoàn lại cho khách hàng
                    </AlertDescription>
                  </Alert>
                )}

                {order.paymentStatus === PaymentStatus.Failed && (
                  <Alert className='bg-red-50 border-red-200'>
                    <X className='h-4 w-4 text-red-600' />
                    <AlertTitle className='text-red-700'>Thanh toán thất bại</AlertTitle>
                    <AlertDescription className='text-red-600'>Thanh toán đơn hàng đã thất bại</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Card ghi chú và hành động */}
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú và hành động</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <label className='text-sm font-medium'>Thêm ghi chú</label>
                  <textarea
                    className='mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none'
                    rows={3}
                    placeholder='Nhập ghi chú về đơn hàng...'
                  ></textarea>
                </div>
                <div className='flex flex-col space-y-2'>
                  <Button>Lưu ghi chú</Button>
                  {order.orderStatus !== OrderState.Cancel && order.orderStatus !== OrderState.Delivered && (
                    <Button className='bg-gray-500' onClick={() => setShowCancelDialog(true)} variant='destructive'>
                      Hủy đơn hàng
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <CancelOrderDialog
        order={order}
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={() => handleDelete(order)}
      />
    </>
  )
}

export default OrderDetailAdmin
