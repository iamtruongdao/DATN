import { getDiscountFilter } from '@/apis/discount.api'
import Pagination from '@/components/Pagination'
import { ApplyTo, Discount, DiscountType } from '@/types'
import { formatDate } from '@/utils'
import { Calendar, Gift, Heart, ShoppingCart, Tag, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'

// Types and Interfaces

// Sample discount data

const DiscountPage: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [totalPages, setTotalPages] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [savedCoupons, setSavedCoupons] = useState<Set<string>>(new Set())
  const getDiscounts = async () => {
    const res = await getDiscountFilter({ pageNumber: currentPage.toString(), pageSize: '5' })
    if (res.code === 0) {
      setDiscounts(res.data.items)
      setTotalPages(res.data.totalPages)
    }
  }
  useEffect(() => {
    getDiscounts()
  }, [currentPage])
  const toggleSaveCoupon = (couponId: string): void => {
    setSavedCoupons((prev) => {
      const newSaved = new Set(prev)
      if (newSaved.has(couponId)) {
        newSaved.delete(couponId)
      } else {
        newSaved.add(couponId)
      }
      return newSaved
    })
  }
  const handlePageChange = (e: { selected: number }) => {
    setCurrentPage(e.selected + 1)
  }
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const isExpired = (endDate: Date): boolean => {
    return new Date() > endDate
  }

  const isComingSoon = (startDate: Date): boolean => {
    return new Date() < startDate
  }

  const getDiscountText = (discount: Discount): string => {
    if (discount.type === DiscountType.Percentage) {
      return `Giảm ${discount.value}%`
    } else {
      return `Giảm ${formatCurrency(discount.value)}`
    }
  }

  const getUsagePercentage = (useCount: number, maxUsage: number): number => {
    return Math.round((useCount / maxUsage) * 100)
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-gradient-to-r from-orange-500 to-pink-500 text-white'>
        <div className='max-w-4xl mx-auto px-4 py-6'>
          <h1 className='text-2xl font-bold flex items-center gap-2'>
            <Gift className='w-8 h-8' />
            Kho Voucher
          </h1>
        </div>
      </div>

      {/* Discount Cards */}
      <div className='max-w-4xl mx-auto px-4 py-6'>
        <div className='space-y-4'>
          {discounts.length > 0 &&
            discounts.map((discount: Discount) => (
              <div
                key={discount.id}
                className={`bg-white rounded-lg shadow-sm border transition-all hover:shadow-md ${
                  isExpired(discount.endDate) ? 'opacity-60' : ''
                } ${isComingSoon(discount.startDate) ? 'border-blue-200' : ''}`}
              >
                <div className='p-4'>
                  <div className='flex items-start justify-between'>
                    {/* Left side - Discount info */}
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <div className='bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold'>
                          {getDiscountText(discount)}
                        </div>
                        {discount.applyTo === ApplyTo.Specific && (
                          <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'>Sản phẩm chỉ định</span>
                        )}
                        {isComingSoon(discount.startDate) && (
                          <span className='bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs'>Sắp diễn ra</span>
                        )}
                        {isExpired(discount.endDate) && (
                          <span className='bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs'>Đã hết hạn</span>
                        )}
                      </div>

                      <h3 className='font-semibold text-gray-800 mb-1'>{discount.name}</h3>
                      <p className='text-gray-600 text-sm mb-3'>{discount.description}</p>

                      {/* Conditions */}
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-500'>
                        <div className='flex items-center gap-1'>
                          <ShoppingCart className='w-3 h-3' />
                          <span>Đơn tối thiểu: {formatCurrency(discount.minOrderValue)}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Calendar className='w-3 h-3' />
                          <span>HSD: {formatDate(discount.endDate.toString())}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Users className='w-3 h-3' />
                          <span>Tối đa {discount.maxUsagePerUser} lần/người</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Tag className='w-3 h-3' />
                          <span>
                            Còn {discount.maxUsage - discount.useCount}/{discount.maxUsage}
                          </span>
                        </div>
                      </div>

                      {/* Usage progress */}
                      <div className='mt-3'>
                        <div className='flex justify-between text-xs text-gray-500 mb-1'>
                          <span>Đã dùng</span>
                          <span>{getUsagePercentage(discount.useCount, discount.maxUsage)}%</span>
                        </div>
                        <div className='w-full bg-gray-200 rounded-full h-1.5'>
                          <div
                            className='bg-gradient-to-r from-orange-500 to-pink-500 h-1.5 rounded-full transition-all'
                            style={{ width: `${getUsagePercentage(discount.useCount, discount.maxUsage)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Coupon code */}
                    <div className='ml-4 flex flex-col items-end'>
                      <div className='bg-orange-50 border-2 border-dashed border-orange-300 rounded-lg p-3 min-w-32'>
                        <div className='text-center'>
                          <div className='text-xs text-gray-500 mb-1'>Mã giảm giá</div>
                          <div className='font-mono font-bold text-orange-600 text-sm'>{discount.code}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => discount.id && toggleSaveCoupon(discount.id)}
                        className={`mt-3 px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 active:scale-95 ${
                          discount.id && savedCoupons.has(discount.id)
                            ? 'bg-pink-500 text-white hover:bg-pink-600'
                            : 'bg-orange-500 text-white hover:bg-orange-600'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${discount.id && savedCoupons.has(discount.id) ? 'fill-current' : ''}`}
                        />
                        {discount.id && savedCoupons.has(discount.id) ? 'Đã lưu' : 'Lưu voucher'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {discounts.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-2'>
              <Gift className='w-16 h-16 mx-auto' />
            </div>
            <p className='text-gray-600'>Không có voucher nào trong danh mục này</p>
          </div>
        )}
      </div>
      <Pagination currentPage={currentPage} pageCount={totalPages} onPageChange={handlePageChange} />
      {/* Footer */}
      <div className='bg-white border-t mt-8'>
        <div className='max-w-4xl mx-auto px-4 py-6 text-center'>
          <p className='text-gray-500 text-sm'>💡 Mẹo: Lưu những voucher yêu thích để không bỏ lỡ ưu đãi!</p>
        </div>
      </div>
    </div>
  )
}

export default DiscountPage
