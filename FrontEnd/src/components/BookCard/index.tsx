import type React from 'react'

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ShoppingCart } from 'lucide-react'
import { formatMoney } from '@/utils'
import { Book } from '@/types'
import { addToCartApi } from '@/apis/cart.api'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { getCartAction } from '@/redux/slice/cartSlice'
// import { useToast } from "@/hooks/use-toast"

interface BookCardProps {
  book: Book
}

export function BookCard({ book }: BookCardProps) {
  const {
    userInfo: { id }
  } = useAppSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const handleAddToCart = async (e: React.MouseEvent, bookId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate loading
    const res = await addToCartApi({ userId: id, cartItem: { productId: bookId, quantity: 1 } })
    if (res.code === 0) {
      setIsLoading(false)
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

  const handleBuyNow = async (e: React.MouseEvent, bookId: string) => {
    e.preventDefault()
    e.stopPropagation()
    const res = await addToCartApi({ userId: id, cartItem: { productId: bookId, quantity: 1 } })
    if (res.code === 0) {
      await dispatch(getCartAction(id))
      navigate('/cart')
    }
  }

  return (
    <Card className='border-none w-[250px] gap-2 py-0  rounded-none overflow-hidden shadow-none '>
      <CardContent className='h-[260px] flex shrink-0'>
        <Link to={`/book/${book.slug}`} className='flex justify-center w-full h-full'>
          <div className='relative  w-[180px]  h-full overflow-hidden group'>
            <img
              src={book.avatar || '/placeholder.svg'}
              alt={book.productName}
              className='object-cover h-full w-full transition-transform group-hover:scale-105 group-hover:opacity-80'
            />
            <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 !p-4'>
              <Button
                className='w-full bg-green-600 hover:bg-green-700 cursor-pointer'
                onClick={(event) => handleBuyNow(event, book.id)}
              >
                Mua ngay
              </Button>
              <Button
                variant='outline'
                className='w-full bg-white hover:bg-gray-100'
                onClick={(e) => handleAddToCart(e, book.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className='flex items-center'>
                    <span className='animate-spin mr-2 h-4 w-4 border-2 border-green-600 border-t-transparent rounded-full'></span>
                    Đang thêm...
                  </span>
                ) : (
                  <span className='flex items-center cursor-pointer'>
                    <ShoppingCart className='!mr-2 h-4 w-4' />
                    Thêm vào giỏ
                  </span>
                )}
              </Button>
            </div>
          </div>
        </Link>
      </CardContent>
      <CardFooter className='flex flex-col justify-end   !p-3 !pt-0'>
        <h3 className=' font-bold text-sm line-clamp-2 text-center  h-10'>{book.productName}</h3>
        <div className='flex justify-between gap-4  items-center'>
          <span className='font-bold text-[17px] text-green-600 '>{formatMoney(book.discountPrice)}</span>
          <span className='text-gray-400 line-through text-sm'>{formatMoney(book.productPrice)}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
