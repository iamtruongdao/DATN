'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, CalendarIcon, CheckCircle, Clock, CreditCard, MapPin, Package, Truck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
// Import the provided interfaces
import { Order } from '@/types'
import { formatMoney } from '@/utils'
import { OrderState, PAYMENT, PaymentStatus, statusMap } from '@/utils/constant'
import { cancelOrderApi, getOrderByIdApi } from '@/apis/order.api'
import { useParams } from 'react-router-dom'
import { formatDate } from 'date-fns'
import { toast } from 'react-toastify'

interface OrderDetailProps {
  order: Order
  isLoading?: boolean
  onDelete: (order: Order) => void
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, isLoading = false, onDelete }) => {
  // State để theo dõi trạng thái hiển thị mã đơn hàng
  const [showOrderId, setShowOrderId] = useState<boolean>(false)

  // State để theo dõi trạng thái hiển thị thông tin vận chuyển
  const [canTrack, setCanTrack] = useState<boolean>(false)

  // State kiểm tra khả năng đánh giá sản phẩm
  const [canReview, setCanReview] = useState<boolean>(false)

  // State kiểm tra khả năng mua lại
  const [canRebuy, setCanRebuy] = useState<boolean>(true)

  // State nút hiển thị chi tiết phí
  const [showDetailFees, setShowDetailFees] = useState<boolean>(false)

  // State kiểm tra có cần hiển thị nút "Thanh toán ngay" hay không
  const [showPayNow, setShowPayNow] = useState<boolean>(false)

  // Derived tracking number (would be stored elsewhere in a real application)
  const [trackingNumber, setTrackingNumber] = useState<string | undefined>('')

  // Format date function for display
  const formatDateFull = (date: Date): string => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  // Kiểm tra xem đơn hàng đã được xác nhận chưa (đã qua trạng thái Pending)
  const isOrderConfirmed = order.orderStatus !== OrderState.Pending && order.orderStatus !== OrderState.Cancel

  // Kiểm tra xem đơn hàng có thể hiển thị thông tin vận chuyển không
  const shouldShowShipping = isOrderConfirmed && !!trackingNumber
  console.log(shouldShowShipping)

  // Kiểm tra xem có phải phương thức thanh toán online không
  const isOnlinePayment = order.orderPayment !== PAYMENT.COD

  // Effect để kiểm tra logic khi component mount hoặc khi các props thay đổi
  useEffect(() => {
    // Generate tracking number for orders in shipping state
    if ([OrderState.WaitingPickup, OrderState.Shipping].includes(order.orderStatus)) {
      setTrackingNumber(order?.trackingNumber)
    }

    // Kiểm tra xem đơn hàng có thể theo dõi không (chỉ khi đã xác nhận và có mã vận đơn)
    setCanTrack(!!trackingNumber && [OrderState.WaitingPickup, OrderState.Shipping].includes(order.orderStatus))

    // Kiểm tra xem đơn hàng có thể đánh giá không (chỉ khi đã giao hàng)
    setCanReview(order.orderStatus === OrderState.Delivered)

    // Kiểm tra xem đơn hàng có thể mua lại không (không thể nếu đang xử lý)
    setCanRebuy(order.orderStatus !== OrderState.WaitingPickup && order.orderStatus !== OrderState.Shipping)

    // Kiểm tra xem có cần hiển thị nút "Thanh toán ngay" không
    // Chỉ hiển thị khi phương thức thanh toán là online và trạng thái đang chờ thanh toán
    setShowPayNow(isOnlinePayment && order.paymentStatus === PaymentStatus.WaitingPaid)

    // Hiển thị mã đơn hàng sau khi tải xong
    if (!isLoading) {
      setShowOrderId(true)
    }
  }, [order.orderStatus, order.orderCode, order.paymentStatus, isLoading, isOnlinePayment])

  // Get payment status based on order status
  const getPaymentStatus = () => {
    if (order.orderStatus === OrderState.Cancel) {
      if (order.paymentStatus === PaymentStatus.Paid && order.orderPayment !== PAYMENT.COD) {
        return PaymentStatus.Refund
      }
      return PaymentStatus.WaitingPaid // Chưa thanh toán hoặc thanh toán COD thì không refund
    }

    return order.paymentStatus
  }

  // Get payment method display text
  const getPaymentMethodText = (method: PAYMENT): string => {
    const methodMap: Record<PAYMENT, string> = {
      [PAYMENT.COD]: 'Thanh toán khi nhận hàng (COD)',
      [PAYMENT.VNPAY]: 'VnPay'
    }
    return methodMap[method] || method
  }

  // Xử lý sự kiện thanh toán
  const handlePayNow = () => {
    if (order.linkPayment) {
      // Chuyển hướng đến trang thanh toán
      window.location.href = order.linkPayment
    } else {
      // Trường hợp không có liên kết thanh toán, hiển thị thông báo
      alert('Vui lòng liên hệ hỗ trợ để được hướng dẫn thanh toán')
    }
  }

  // Render order progress steps
  const renderOrderProgress = () => {
    if (order.orderStatus === OrderState.Cancel) return null

    const steps = [
      { id: 1, name: 'Đặt hàng', completed: true },
      {
        id: 2,
        name: 'Xác nhận',
        completed: order.orderStatus !== OrderState.Pending
      },
      {
        id: 3,
        name: 'Chờ lấy hàng',
        completed: [OrderState.WaitingPickup].includes(order.orderStatus)
      },
      { id: 4, name: 'Vận chuyển', completed: [OrderState.Shipping].includes(order.orderStatus) },
      { id: 5, name: 'Giao hàng', completed: order.orderStatus === OrderState.Delivered }
    ]

    return (
      <div className='py-4'>
        <div className='flex items-center justify-between w-full'>
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className='flex flex-col items-center'>
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full ${
                    step.completed ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.completed ? <CheckCircle className='h-5 w-5' /> : <span>{step.id}</span>}
                </div>
                <span
                  className={`text-xs mt-1 text-center ${
                    step.completed ? 'text-orange-500 font-medium' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 ${steps[index + 1].completed ? 'bg-orange-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  }

  // Xử lý sự kiện tracking
  const handleTracking = () => {
    if (canTrack && trackingNumber) {
      alert(`Theo dõi đơn hàng với mã vận đơn: ${trackingNumber}`)
      // Trong thực tế, có thể chuyển hướng đến trang theo dõi của đơn vị vận chuyển
    }
  }

  // Renderer cho trạng thái Alert
  const renderStatusAlert = () => {
    if (isLoading) {
      return <Skeleton className='h-16 w-full' />
    }

    switch (order.orderStatus) {
      case OrderState.Pending:
        return (
          <Alert className='bg-yellow-50 border-yellow-200'>
            <Clock className='h-4 w-4 text-yellow-500' />
            <AlertTitle>Đơn hàng đang chờ xác nhận</AlertTitle>
            <AlertDescription className='space-y-2'>
              <p>Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
              <div className='mt-2 text-sm bg-yellow-100 p-3 rounded-md'>
                <p className='font-medium'>Thời gian xử lý dự kiến:</p>
                <p>• Đơn hàng sẽ được xác nhận trong vòng 24 giờ</p>
                <p>• Bạn sẽ nhận được thông báo khi đơn hàng được xác nhận</p>
              </div>
              {/* Hiển thị thông báo về thanh toán nếu là đơn hàng online đang chờ thanh toán */}
              {isOnlinePayment && order.paymentStatus === PaymentStatus.WaitingPaid && (
                <div className='mt-2 text-sm bg-red-100 p-3 rounded-md'>
                  <p className='font-medium text-red-600'>Lưu ý:</p>
                  <p>• Đơn hàng sẽ được xử lý sau khi bạn hoàn tất thanh toán</p>
                  <p>• Vui lòng thanh toán trong vòng 24 giờ để đơn hàng không bị hủy</p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )
      case OrderState.WaitingPickup:
        return (
          <Alert className='bg-blue-50 border-blue-200'>
            <Package className='h-4 w-4 text-blue-500' />
            <AlertTitle>Đơn hàng đang được chuẩn bị</AlertTitle>
            <AlertDescription className='space-y-2'>
              <p>Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị để giao cho đơn vị vận chuyển.</p>
              <div className='mt-2 text-sm bg-blue-100 p-3 rounded-md'>
                <p className='font-medium'>Thông tin chuẩn bị đơn hàng:</p>
                <p>• Đơn hàng đang được đóng gói</p>
                <p>• Dự kiến bàn giao cho đơn vị vận chuyển: 1-2 ngày làm việc</p>
                <p>• Bạn sẽ nhận được thông báo khi đơn hàng được giao cho đơn vị vận chuyển</p>
              </div>
            </AlertDescription>
          </Alert>
        )
      case OrderState.Shipping:
        return (
          <Alert className='bg-indigo-50 border-indigo-200'>
            <Truck className='h-4 w-4 text-indigo-500' />
            <AlertTitle>Đơn hàng đang được giao</AlertTitle>
            <AlertDescription>
              Đơn hàng của bạn đang được vận chuyển. {trackingNumber && 'Bạn có thể theo dõi đơn hàng.'}
            </AlertDescription>
          </Alert>
        )
      case OrderState.Delivered:
        return (
          <Alert className='bg-green-50 border-green-200'>
            <CheckCircle className='h-4 w-4 text-green-500' />
            <AlertTitle>Đơn hàng đã được giao</AlertTitle>
            <AlertDescription>Đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã mua hàng!</AlertDescription>
          </Alert>
        )
      case OrderState.Cancel:
        return (
          <Alert className='bg-red-50 border-red-200'>
            <AlertCircle className='h-4 w-4 text-red-500' />
            <AlertTitle>Đơn hàng đã bị hủy</AlertTitle>
            <AlertDescription>
              Đơn hàng của bạn đã bị hủy. Vui lòng liên hệ hỗ trợ nếu cần thêm thông tin.
            </AlertDescription>
          </Alert>
        )
      default:
        return null
    }
  }

  // Nếu đang loading, hiển thị skeleton
  if (isLoading) {
    return (
      <div className='max-w-3xl mx-auto bg-gray-50 p-4 md:p-6 space-y-6'>
        <div className='flex items-center justify-between mb-6'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-6 w-32' />
        </div>

        {Array(4)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className='h-48 w-full rounded-lg' />
          ))}

        <div className='flex justify-end space-x-2'>
          <Skeleton className='h-10 w-32' />
          <Skeleton className='h-10 w-32' />
          <Skeleton className='h-10 w-32' />
        </div>
      </div>
    )
  }

  // Compose full address

  return (
    <div className='max-w-3xl mx-auto bg-gray-50 p-4 md:p-6'>
      {/* Header */}
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-orange-500'>Chi tiết đơn hàng</h1>
        {showOrderId && <span className='text-sm text-gray-500'>#{order.orderCode}</span>}
      </div>

      {/* Order Status */}
      <Card className='mb-6'>
        <CardHeader className='pb-2'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              {/* Using statusMap for state display */}
              <Badge className={statusMap[order.orderStatus].color}>{statusMap[order.orderStatus].text}</Badge>
              <span className='text-sm text-gray-500 flex items-center'>
                <CalendarIcon className='h-4 w-4 mr-1' /> {formatDateFull(order.createdAt)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderStatusAlert()}
          {(order.orderStatus === OrderState.Pending || order.orderStatus === OrderState.WaitingPickup) &&
            renderOrderProgress()}

          {/* Show Pay Now button if it's an online payment order in WaitingPaid status */}
          {showPayNow && (
            <div className='mt-4'>
              <Button className='w-full bg-orange-500 hover:bg-orange-600 text-white' onClick={handlePayNow}>
                Thanh toán ngay
              </Button>
              <p className='text-xs text-gray-500 text-center mt-2'>
                Đơn hàng sẽ được xử lý sau khi bạn hoàn tất thanh toán
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tracking Info - Chỉ hiển thị khi đã xác nhận đơn hàng và có mã vận đơn */}
      {shouldShowShipping && (
        <Card className='mb-6'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-lg flex items-center'>
              <Truck className='h-5 w-5 mr-2 text-orange-500' />
              Thông tin vận chuyển
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-center py-2'>
              <span className='text-gray-600'>Mã vận đơn:</span>
              <span className='font-medium'>{trackingNumber}</span>
            </div>
            <Separator className='my-2' />
            <div className='flex justify-between items-center py-2'>
              <span className='text-gray-600'>Đơn vị vận chuyển:</span>
              <span className='font-medium'>Giao hàng nhanh</span>
            </div>
            {canTrack && (
              <Button
                variant='outline'
                className='w-full mt-4 border-orange-500 text-orange-500 hover:bg-orange-50'
                onClick={handleTracking}
              >
                Theo dõi đơn hàng
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Shipping Address */}
      <Card className='mb-6'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg flex items-center'>
            <MapPin className='h-5 w-5 mr-2 text-orange-500' />
            Địa chỉ nhận hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {order.orderAddress ? (
              <>
                <div className='flex'>
                  <span className='text-gray-600 w-32'>Người nhận:</span>
                  <span className='font-medium'>{order.orderAddress.fullName}</span>
                </div>
                <div className='flex'>
                  <span className='text-gray-600 w-32'>Số điện thoại:</span>
                  <span className='font-medium'>{order.orderAddress.phoneNumber}</span>
                </div>
                <div className='flex'>
                  <span className='text-gray-600 w-32'>Địa chỉ:</span>
                  <span className='font-medium'>{order.orderAddress.address}</span>
                </div>
              </>
            ) : (
              <div className='text-gray-500'>Không có thông tin địa chỉ</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estimated Delivery - Only show for pending/processing orders */}
      {(order.orderStatus === OrderState.Pending || order.orderStatus === OrderState.WaitingPickup) && (
        <Card className='mb-6 border-dashed border-yellow-300'>
          <CardHeader className='pb-2 bg-yellow-50'>
            <CardTitle className='text-lg flex items-center'>
              <CalendarIcon className='h-5 w-5 mr-2 text-orange-500' />
              Thời gian giao hàng dự kiến
            </CardTitle>
          </CardHeader>
          <CardContent className='bg-yellow-50'>
            <div className='py-2 text-center'>
              <span className='font-bold text-lg text-orange-500'>
                Dự kiến giao vào {formatDate(new Date(order.deleveredAt), 'dd/MM/yyyy')}
              </span>
              <p className='text-sm text-gray-600 mt-1'>(Không tính thứ 7, chủ nhật và ngày lễ)</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Info */}
      <Card className='mb-6'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg flex items-center'>
            <Package className='h-5 w-5 mr-2 text-orange-500' />
            Sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.orderItem && order.orderItem.length > 0 ? (
            <div>
              {order.orderItem.map((orderProduct, index) => (
                <div key={index} className='flex items-center py-4 border-b border-gray-200'>
                  <div className='h-20 w-20 rounded bg-gray-100 overflow-hidden flex-shrink-0'>
                    {orderProduct.item.avatar ? (
                      <img
                        src={orderProduct.item.avatar}
                        alt={orderProduct.item.productName}
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <img src='/api/placeholder/80/80' alt='Product' className='w-full h-full object-cover' />
                    )}
                  </div>
                  <div className='ml-4 flex-grow'>
                    <h3 className='font-medium text-gray-900'>{orderProduct.item.productName}</h3>
                    <p className='text-sm text-gray-500'>x{orderProduct.item.quantity}</p>
                    {orderProduct.item.discount > 0 && (
                      <p className='text-xs text-gray-500'>
                        <span className='line-through'>{formatMoney(orderProduct.item.price)}</span>
                        <span className='ml-2 text-orange-500'>
                          -{Math.round((orderProduct.item.discount / orderProduct.item.price) * 100)}%
                        </span>
                      </p>
                    )}
                  </div>
                  <div className='text-right'>
                    <p className='font-medium text-orange-500'>
                      {formatMoney(orderProduct.item.price - orderProduct.item.discount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-gray-500'>Không có thông tin sản phẩm</div>
          )}
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card className='mb-6'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg flex items-center'>
            <CreditCard className='h-5 w-5 mr-2 text-orange-500' />
            Thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <div className='flex justify-between py-2'>
              <span className='text-gray-600'>Phương thức thanh toán:</span>
              <span className='font-medium'>{getPaymentMethodText(order.orderPayment)}</span>
            </div>

            {/* Chỉ hiển thị trạng thái thanh toán khi thanh toán online */}
            {isOnlinePayment && (
              <div className='flex justify-between py-2'>
                <span className='text-gray-600'>Trạng thái thanh toán:</span>
                <Badge
                  className={
                    getPaymentStatus() === PaymentStatus.Paid
                      ? 'bg-green-100 text-green-800'
                      : getPaymentStatus() === PaymentStatus.Refund
                        ? 'bg-purple-100 text-purple-800'
                        : getPaymentStatus() === PaymentStatus.Failed
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {getPaymentStatus() === PaymentStatus.Paid
                    ? 'Đã thanh toán'
                    : getPaymentStatus() === PaymentStatus.WaitingPaid
                      ? 'Chờ thanh toán'
                      : getPaymentStatus() === PaymentStatus.Failed
                        ? 'Thanh toán thất bại'
                        : 'Đã hoàn tiền'}
                </Badge>
              </div>
            )}

            <Separator className='my-2' />
            <div className='flex justify-between py-2'>
              <span className='text-gray-600'>Tổng tiền hàng:</span>
              <span>{formatMoney(order.orderCheckout.totalPrice)}</span>
            </div>
            {(showDetailFees || order.orderCheckout.feeShip > 0) && (
              <div className='flex justify-between py-2'>
                <span className='text-gray-600'>Phí vận chuyển:</span>
                <span>{formatMoney(order.orderCheckout.feeShip)}</span>
              </div>
            )}
            {showDetailFees && (
              <>
                <div className='flex justify-between py-2'>
                  <span className='text-gray-600'>Giảm giá từ sản phẩm:</span>
                  <span>-{formatMoney(order.orderItem.reduce((acc, item) => acc + item.item.discount, 0))}</span>
                </div>
                <div className='flex justify-between py-2'>
                  <span className='text-gray-600'>Giảm giá từ voucher:</span>
                  <span>-{formatMoney(order.orderCheckout.voucherDiscount)}</span>
                </div>
              </>
            )}
            {!showDetailFees &&
              (order.orderCheckout.feeShip > 0 ||
                order.orderCheckout.totalPrice - order.orderCheckout.totalApplyDiscount > 0) && (
                <Button
                  variant='ghost'
                  className='text-xs text-gray-500 p-0 h-auto hover:bg-transparent hover:text-gray-700'
                  onClick={() => setShowDetailFees(true)}
                >
                  Xem chi tiết phí
                </Button>
              )}
            <Separator className='my-2' />
            <div className='flex justify-between py-2'>
              <span className='font-medium'>Thành tiền:</span>
              <span className='font-bold text-lg text-orange-500'>
                {formatMoney(order.orderCheckout.totalApplyDiscount + order.orderCheckout.feeShip)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className='flex flex-wrap justify-end gap-2'>
        {/* Chỉ hiển thị nút Hủy đơn hàng khi đang ở trạng thái Pending hoặc chưa thanh toán với phương thức thanh toán online */}
        {(order.orderStatus === OrderState.Pending ||
          (isOnlinePayment && order.paymentStatus === PaymentStatus.WaitingPaid)) && (
          <Button
            variant='outline'
            className='border-red-500 text-red-500 hover:bg-red-50'
            onClick={() => onDelete(order)}
          >
            Hủy đơn hàng
          </Button>
        )}

        {/* Nút Thanh toán ngay - hiển thị ở đây khi nút ở trạng thái chưa thanh toán nhưng order không phải trạng thái Pending */}
        {showPayNow && order.orderStatus !== OrderState.Pending && (
          <Button className='bg-orange-500 hover:bg-orange-600 text-white' onClick={handlePayNow}>
            Thanh toán ngay
          </Button>
        )}

        <Button variant='outline' className='border-orange-500 text-orange-500 hover:bg-orange-50'>
          Liên hệ hỗ trợ
        </Button>
        {canRebuy && (
          <Button
            variant='outline'
            className='border-orange-500 text-orange-500 hover:bg-orange-50'
            disabled={!canRebuy}
          >
            Mua lại
          </Button>
        )}
        {canReview && (
          <Button className='bg-orange-500 hover:bg-orange-600 text-white' disabled={!canReview}>
            Đánh giá
          </Button>
        )}
      </div>
    </div>
  )
}

export default function OrderDetailPage() {
  // State để kiểm soát trạng thái loading
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [orderData, setOrderData] = useState<Order | null>(null)
  const { orderId } = useParams()
  const fetchOrder = async () => {
    const res = await getOrderByIdApi(orderId!)
    if (res.code === 0) {
      setOrderData(res.data)
    }
  }
  // Giả lập việc tải dữ liệu
  useEffect(() => {
    // Giả lập API call
    setTimeout(() => {
      // Sample data
      fetchOrder()

      setIsLoading(false)
    }, 500) // Giả lập độ trễ 1.5 giây
  }, [])
  const handleDelete = async (order: Order) => {
    try {
      const res = await cancelOrderApi(order.id)
      if (res.code === 0) {
        toast.success('hủy đơn hàng thành công')
        window.location.reload()
      }
      // Load lại danh sách sau khi xóa
    } catch (error) {
      console.error('Error deleting book:', error)
    }
  }
  // Hiển thị skeleton trong quá trình tải
  if (isLoading || !orderData) {
    return (
      <div className='max-w-3xl mx-auto bg-gray-50 p-4 md:p-6 space-y-6'>
        <div className='flex items-center justify-between mb-6'>
          <Skeleton className='h-8 w-64' />
          <Skeleton className='h-6 w-32' />
        </div>

        {Array(4)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className='h-48 w-full rounded-lg' />
          ))}

        <div className='flex justify-end space-x-2'>
          <Skeleton className='h-10 w-32' />
          <Skeleton className='h-10 w-32' />
        </div>
      </div>
    )
  }
  return <OrderDetail order={orderData} isLoading={isLoading} onDelete={handleDelete} />
}
