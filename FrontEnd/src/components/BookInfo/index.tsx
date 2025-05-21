import { addToCartApi } from '@/apis/cart.api'
import BookCardSkeleton from '@/components/Skeleton/BookInforSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { getCartAction } from '@/redux/slice/cartSlice'
import { Book } from '@/types'
import { formatMoney } from '@/utils'
import { BookOpen, ChevronDown, ChevronUp, Loader2, ShoppingCart } from 'lucide-react'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
type BookInfoProp = {
  book: Book
  hideDescription?: boolean
}
const BookInfo: FC<BookInfoProp> = ({ book, hideDescription = false }) => {
  const {
    userInfo: { id }
  } = useAppSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(false)
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isExpanded, setIsExpanded] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const availableStock = 98

  const handleQuantityIncrease = () => {
    if (quantity < availableStock) {
      setQuantity(quantity + 1)
    }
  }

  const handleQuantityDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }
  const handleAddToCart = async (bookId: string) => {
    setIsAddToCartLoading(true)
    const res = await addToCartApi({ userId: id, cartItem: { productId: bookId, quantity } })
    if (res.code === 0) {
      setIsAddToCartLoading(false)
      setQuantity(1)
      dispatch(getCartAction(id))
      toast.success(
        <div>
          Thêm vào giỏ hàng thành công! Xem
          <span
            onClick={() => navigate('/cart')}
            style={{
              color: 'blue',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Giỏ hàng
          </span>
          .
        </div>
      )
    }
  }
  const handleBuyNow = async (bookId: string) => {
    const res = await addToCartApi({ userId: id, cartItem: { productId: bookId, quantity } })
    if (res.code === 0) {
      setQuantity(1)
      await dispatch(getCartAction(id))
      navigate('/cart')
    }
  }
  return (
    <>
      {isLoading ? (
        <BookCardSkeleton />
      ) : (
        <div className='bg-[#F5F5F5] px-4 py-8 flex flex-col md:flex-row md:space-x-4'>
          {/* Book Cover - 5 columns */}
          <div className='container px-4 py-12 flex bg-white'>
            <div className='w-full  md:w-4/12 h-108   flex justify-center items-start relative group  mb-6 md:mb-0 p-4 '>
              <img
                src={book?.avatar || ''}
                alt='Định Luật Murphy Book Cover'
                className='max-h-full max-w-full  object-contain shadow-2xl transform transition-transform duration-300 group-hover:scale-105'
              />
            </div>

            {/* Product Details - 5 columns */}
            <div className='w-full  md:w-5/12 space-y-4'>
              <div>
                <h6 className='text-1xl md:text-2xl font-bold text-gray-900 mb-2'>{book.productName}</h6>
                <p className='text-sm text-gray-600'>
                  Tác giả: <span className='font-semibold text-gray-800'>{book?.authorName}</span>
                </p>
              </div>

              {/* Price Section */}
              <div className='flex items-center space-x-3'>
                <span className='text-2xl md:text-3xl font-bold text-green-600'>{formatMoney(book.discountPrice)}</span>
                <span className='text-gray-500 line-through text-lg md:text-xl'>{formatMoney(book.productPrice)}</span>
                <span className='bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium'>
                  -{book.discount}%
                </span>
              </div>

              {/* Quantity Selector */}
              <div className='flex items-center space-x-3'>
                <div className='flex items-center border rounded-lg overflow-hidden'>
                  <Button variant='ghost' size='icon' onClick={handleQuantityDecrease} className='hover:bg-gray-100'>
                    <ChevronDown className='h-5 w-5 text-gray-600' />
                  </Button>
                  <input
                    type='number'
                    min='1'
                    max={book.productQuantity}
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1
                      const newQuantity = Math.min(Math.max(value, 1), book.productQuantity)
                      setQuantity(newQuantity)
                    }}
                    className='w-12 text-center focus:outline-none text-gray-800 font-medium [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                  />
                  <Button variant='ghost' size='icon' onClick={handleQuantityIncrease} className='hover:bg-gray-100'>
                    <ChevronUp className='h-5 w-5 text-gray-600' />
                  </Button>
                </div>
                <span className='text-sm text-gray-600'>Còn lại {book.productQuantity} trong kho</span>
              </div>

              {/* Action Buttons */}
              <div className='flex space-x-3'>
                <Button
                  variant='outline'
                  className='flex-1 text-green-600 cursor-pointer max-w-[200px] border-green-600 hover:bg-green-50 transition-colors text-sm'
                  onClick={() => handleAddToCart(book.id)}
                  disabled={isAddToCartLoading}
                >
                  {isAddToCartLoading ? (
                    <>
                      <Loader2 className='mr-1 h-4 w-4 animate-spin' /> Đang thêm...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className='mr-1 h-4 w-4' /> Thêm vào giỏ
                    </>
                  )}
                </Button>
                <Button
                  className='flex-1 max-w-[200px] cursor-pointer bg-green-600 hover:bg-green-700 transition-colors text-sm'
                  onClick={() => handleBuyNow(book.id)}
                >
                  Mua ngay
                </Button>
              </div>

              {/* Book Summary */}
              {!hideDescription && (
                <Card className='shadow-lg border-none'>
                  <CardContent className='p-3'>
                    <h2 className='font-bold text-lg text-gray-900 mb-2 flex items-center'>
                      <BookOpen className='mr-1 h-4 w-4 text-green-600' />
                      Tóm tắt tác phẩm
                    </h2>
                    <div
                      dangerouslySetInnerHTML={{ __html: book.productDescription }}
                      className={`text-gray-700 text-sm mb-2 transition-all duration-300 ${!isExpanded ? 'line-clamp-3' : ''}`}
                    ></div>
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className='text-green-600 text-sm font-medium flex items-center hover:text-green-700 transition-colors cursor-pointer'
                    >
                      {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                      {isExpanded ? <ChevronUp className='ml-1 h-3 w-3' /> : <ChevronDown className='ml-1 h-3 w-3' />}
                    </button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BookInfo
