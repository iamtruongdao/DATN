import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Shop } from '@/types'
import React, { useEffect, useState } from 'react'

interface OrderPickUpProps {
  shop: Shop
  trackingNumber: string
  open: boolean
  onOpenChange: (open: boolean) => void
}
const OrderPickupDialog: React.FC<OrderPickUpProps> = ({ trackingNumber, open, onOpenChange, shop }) => {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading of order code
  useEffect(() => {
    if (trackingNumber) {
      setIsLoading(false)
    }
  }, [open, isLoading, trackingNumber])

  return (
    <div className='font-sans'>
      {/* Button to open the dialog */}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-md p-0 overflow-hidden'>
          <DialogHeader className='p-4 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <DialogTitle className='text-lg font-medium'>Chi tiết</DialogTitle>
            </div>
          </DialogHeader>

          {/* Loading indicator or Order Code */}
          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-8'>
              <div className='flex items-center gap-2'>
                <div className='flex gap-1'>
                  <div className='h-2 w-2 rounded-full bg-orange-400 animate-pulse'></div>
                  <div className='h-2 w-2 rounded-full bg-orange-400 animate-pulse delay-75'></div>
                  <div className='h-2 w-2 rounded-full bg-orange-400 animate-pulse delay-150'></div>
                </div>
                <span className='text-gray-700'>Mã vận đơn đang được tạo...</span>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-6'>
              <div className='flex items-center gap-2 mb-4'>
                <span className='text-gray-700'>
                  Mã đơn hàng: <span className='font-medium'>{trackingNumber}</span>
                </span>
              </div>
              <Button
                variant='outline'
                className='border-orange-500 text-orange-500 hover:bg-orange-50 flex items-center gap-2'
                onClick={() => console.log('Print shipping label')}
              >
                <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                    fillRule='evenodd'
                    d='M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z'
                    clipRule='evenodd'
                  />
                </svg>
                In phiếu giao
              </Button>
            </div>
          )}

          {/* Order Pickup Information */}
          <div className='p-4 border-t border-gray-200'>
            <h3 className='font-medium text-gray-800 mb-4'>Thông Tin Lấy Hàng</h3>

            <div className='flex'>
              {/* Left column */}
              <div className='w-1/2 pr-4'>
                <div className='mb-4'>
                  <p className='text-sm text-gray-500 mb-1'>Vận chuyển</p>
                  <p className='text-sm font-medium'>SPX Express</p>
                </div>

                <div className='mb-4'>
                  <p className='text-sm text-gray-500 mb-1'>Ngày lấy hàng</p>
                  <p className='text-sm'>23/02/2024</p>
                </div>
              </div>

              {/* Right column */}
              <div className='w-1/2 pl-4'>
                <div className='mb-4'>
                  <p className='text-sm text-gray-500 mb-1'>Lưu ý</p>
                  <p className='text-sm'></p>
                </div>

                <div>
                  <p className='text-sm text-gray-500 mb-1'>Địa chỉ lấy hàng</p>
                  <p className='text-sm'>{shop.name}</p>
                  <p className='text-sm'>{shop.phone}</p>
                  <p className='text-sm'>{shop.address}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OrderPickupDialog
