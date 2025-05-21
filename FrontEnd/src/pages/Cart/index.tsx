import { deleteCartApi, updateQuantityApi } from '@/apis/cart.api'
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/hooks'
import QuantityInput from '@/pages/Cart/QuantityInput'
import { getCartAction } from '@/redux/slice/cartSlice'
import { formatMoney } from '@/utils'
import { debounce } from 'lodash'
import { Loader2, Trash } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Cart() {
  const { cartProducts, cartCountProduct } = useAppSelector((state) => state.cart)
  const {
    userInfo: { id }
  } = useAppSelector((state) => state.user)
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)
  const [loadingItemIds, setLoadingItemIds] = useState<string[]>([])
  const dispatch = useAppDispatch()

  // State để lưu thông tin sản phẩm cần xóa
  const [itemToDelete, setItemToDelete] = useState<{
    id: string
    name: string
  } | null>(null)

  // Function để hiển thị dialog xác nhận xóa
  const handleShowDeleteConfirm = (id: string, productName: string) => {
    setItemToDelete({ id, name: productName })
  }
  const handlePayment = () => {
    window.location.href = '/checkout'
  }
  // Function để xử lý thanh toán
  // Function để hủy xóa
  const handleCancelDelete = () => {
    setItemToDelete(null)
  }

  // Function để xóa item sau khi xác nhận
  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await removeItem(itemToDelete.id)
    }
  }

  // Function to handle quantity changes
  const updateQuantity = async (productid: string, newQuantity: number, oldQuantity: number) => {
    setIsDisabled(false)
    setIsCalculating(true)
    setLoadingItemIds((prev) => [...prev, productid]) // Thêm ID sản phẩm đang loading

    try {
      const res = await updateQuantityApi({
        productId: productid,
        oldQuantity,
        quantity: newQuantity,
        userId: id
      })
      if (res.code === 0) {
        dispatch(getCartAction(id))
      }
    } catch (err) {
      console.error('Error updating quantity:', err)
      setIsDisabled(false)
    } finally {
      // Đảm bảo tắt trạng thái tính toán khi hoàn tất
      setTimeout(() => {
        setIsCalculating(false)
        setLoadingItemIds((prev) => prev.filter((id) => id !== productid)) // Xóa ID sản phẩm khỏi danh sách loading
      }, 300)
    }
  }

  const debounceOnChange = debounce(async (newValue: number, cartItemId: string, oldQuantity: number) => {
    setIsDisabled(true)
    await updateQuantity(cartItemId, newValue, oldQuantity)
  }, 300)

  // Function to remove an item
  const removeItem = async (itemId: string) => {
    // Trong ứng dụng thực tế, đây sẽ gọi API để xóa sản phẩm khỏi giỏ hàng
    setIsLoading(true)
    // Giả lập thời gian chờ 1 giây
    const res = await deleteCartApi({ productId: itemId, userId: id })
    if (res.code === 0) {
      setIsLoading(false)
      setItemToDelete(null)
      dispatch(getCartAction(id))
    } else {
      toast.error(res.message)
    }

    // Sau khi xóa thành công, cập nhật lại giỏ hàng
  }

  // Calculate totals
  const calculateTotal = () => {
    return cartProducts.reduce((sum, item) => sum + item.productDetails.discountPrice * item.quantity, 0)
  }

  // Check if item is loading
  const isItemLoading = (itemId: string) => {
    return loadingItemIds.includes(itemId)
  }

  return (
    <div className='w-full max-w-5xl mx-auto p-4'>
      <h1 className='text-2xl font-bold text-green-600 mb-6 text-center'>Giỏ hàng của bạn</h1>

      {cartProducts.length === 0 ? (
        <Alert className='mb-6'>
          <AlertDescription>Giỏ hàng của bạn đang trống. Hãy thêm sản phẩm vào giỏ hàng.</AlertDescription>
        </Alert>
      ) : (
        <Card className='mb-6 overflow-hidden py-0 gap-0 shadow-md'>
          <div className='border-b p-4 bg-gray-50 grid grid-cols-12 gap-4 font-medium'>
            <div className='col-span-6'>Thông tin sản phẩm</div>
            <div className='col-span-2 text-right'>Đơn giá</div>
            <div className='col-span-2 text-center'>Số lượng</div>
            <div className='col-span-2 text-right'>Thành tiền</div>
          </div>

          {cartProducts.map((item) => {
            // Determine if buttons should be disabled
            const itemIsLoading = isItemLoading(item.productId)

            return (
              <div key={item.productId} className='border-b p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50'>
                <div className='col-span-6 flex items-center gap-4'>
                  <div className='relative overflow-hidden rounded-lg shadow-sm'>
                    <Link to={`/book/${item.productDetails.slug}`} className='block w-full h-full'>
                      <img src={item.productDetails?.avatar} alt={item.productId} className='w-16 h-20 object-cover' />
                    </Link>
                  </div>
                  <div>
                    <h3 className='font-medium'>{item.productDetails?.productName}</h3>
                    <Button
                      variant='link'
                      className='px-0 text-red-500 cursor-pointer hover:text-red-700 hover:no-underline h-6 flex items-center'
                      disabled={itemIsLoading}
                      onClick={() => handleShowDeleteConfirm(item.productId, item.productDetails?.productName)}
                    >
                      <Trash />
                      <span>Xóa</span>
                    </Button>
                  </div>
                </div>

                <div className='col-span-2 text-right'>
                  <div className='text-gray-700'>{formatMoney(item.productDetails?.discountPrice)}</div>
                  <div className='text-gray-400 text-sm line-through'>
                    {formatMoney(item.productDetails?.productPrice)}
                  </div>
                </div>

                <div className='col-span-2 flex justify-center items-center'>
                  <QuantityInput
                    itemId={item.productId}
                    quantity={item.quantity}
                    isDisabled={isDisabled || itemIsLoading}
                    debounceOnChange={debounceOnChange}
                    onZeroQuantity={() => handleShowDeleteConfirm(item.productId, item.productDetails?.productName)}
                  />
                </div>

                <div className='col-span-2 text-right'>
                  {itemIsLoading ? (
                    <div className='font-medium text-green-600 flex items-center justify-end gap-2'>
                      <Loader2 size={16} className='animate-spin text-green-600' />
                    </div>
                  ) : (
                    <div className='font-medium text-green-600'>
                      {formatMoney(item.productDetails.discountPrice * item.quantity)}
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          <div className='p-4 text-right bg-gray-50'>
            <div className='font-bold text-lg text-green-600 flex justify-end items-center gap-2'>
              <span>Tổng tiền:</span>
              {isCalculating ? (
                <div className='flex items-center gap-2'>
                  <Loader2 size={20} className='animate-spin text-green-600' />
                </div>
              ) : (
                <span>{formatMoney(calculateTotal())}</span>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Dialog xác nhận xóa */}
      <DeleteConfirmDialog
        isLoading={isLoading}
        open={!!itemToDelete}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        productName={itemToDelete?.name}
      />

      <div className='flex justify-end'>
        {cartCountProduct === 0 ? (
          <Link
            to={'/'}
            className='bg-green-600 hover:bg-green-700 text-white p-2 text-lg font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-200'
          >
            Tiếp tục mua sắm
          </Link>
        ) : (
          <Button
            className='bg-green-600 hover:bg-green-700 text-white py-6 px-8 text-lg font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-200'
            disabled={isCalculating || loadingItemIds.length > 0}
            onClick={handlePayment}
          >
            {isCalculating || loadingItemIds.length > 0 ? (
              <div className='flex items-center gap-2'>
                <Loader2 size={20} className='animate-spin' />
                <span>Đang cập nhật...</span>
              </div>
            ) : (
              'Thanh toán'
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
