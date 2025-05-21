import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ApplyTo, Discount, DiscountType } from '@/types'

interface DiscountDetailSheetProps {
  discount: Discount | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VoucherDetailSheet({ discount, open, onOpenChange }: DiscountDetailSheetProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDiscountValue = (value: number, type: DiscountType) => {
    if (type === DiscountType.Percentage) {
      return `${value}%`
    }
    return formatCurrency(value)
  }

  if (!discount) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='bg-white w-full sm:max-w-xl flex flex-col p-0'>
        <SheetHeader className='px-4 py-2 border-b border-b-gray-100 flex-none'>
          <SheetTitle>Chi tiết mã giảm giá</SheetTitle>
        </SheetHeader>

        <ScrollArea className='flex-1 h-[calc(100vh-80px)] px-4 py-6 space-y-6'>
          {/* Thông tin cơ bản */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Thông tin chung</h3>
              <Badge variant={discount.isActive ? 'default' : 'secondary'}>
                {discount.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
              </Badge>
            </div>

            <div className='space-y-3'>
              <div>
                <label className='text-sm text-muted-foreground'>Tên mã giảm giá</label>
                <p className='font-medium'>{discount.name || 'Không có tên'}</p>
              </div>

              <div>
                <label className='text-sm text-muted-foreground'>Mã giảm giá</label>
                <p className='font-mono font-medium text-blue-600'>{discount.code || 'Không có mã'}</p>
              </div>

              {discount.description && (
                <div>
                  <label className='text-sm text-muted-foreground'>Mô tả</label>
                  <p className='whitespace-pre-line'>{discount.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Giá trị giảm giá */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Giá trị giảm giá</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm text-muted-foreground'>Loại giảm giá</label>
                <p className='font-medium'>
                  {discount.type === DiscountType.Percentage ? 'Phần trăm' : 'Số tiền cố định'}
                </p>
              </div>
              <div>
                <label className='text-sm text-muted-foreground'>Giá trị</label>
                <p className='font-medium text-green-600'>{formatDiscountValue(discount.value, discount.type)}</p>
              </div>
            </div>

            <div>
              <label className='text-sm text-muted-foreground'>Giá trị đơn hàng tối thiểu</label>
              <p className='font-medium'>{formatCurrency(discount.minOrderValue)}</p>
            </div>
          </div>

          {/* Thời gian áp dụng */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Thời gian áp dụng</h3>
            <div className='grid grid-cols-1 gap-3'>
              <div>
                <label className='text-sm text-muted-foreground'>Ngày bắt đầu</label>
                <p className='font-medium'>{formatDate(discount.startDate)}</p>
              </div>
              <div>
                <label className='text-sm text-muted-foreground'>Ngày kết thúc</label>
                <p className='font-medium'>{formatDate(discount.endDate)}</p>
              </div>
            </div>
          </div>

          {/* Phạm vi áp dụng */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Phạm vi áp dụng</h3>
            <div className='space-y-3'>
              <div>
                <label className='text-sm text-muted-foreground'>Áp dụng cho</label>
                <p className='font-medium'>
                  {discount.applyTo === ApplyTo.All ? 'Tất cả sản phẩm' : 'Sản phẩm cụ thể'}
                </p>
              </div>

              {discount.applyTo === ApplyTo.Specific && discount.productIds.length > 0 && (
                <div>
                  <label className='text-sm text-muted-foreground'>Sản phẩm áp dụng</label>
                  <p className='font-medium'>{discount.productIds.length} sản phẩm được chọn</p>
                </div>
              )}
            </div>
          </div>

          {/* Thống kê sử dụng */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Thống kê sử dụng</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='text-sm text-muted-foreground'>Số lần đã sử dụng</label>
                <p className='font-medium'>{discount.useCount}</p>
              </div>
              <div>
                <label className='text-sm text-muted-foreground'>Giới hạn sử dụng</label>
                <p className='font-medium'>{discount.maxUsage === -1 ? 'Không giới hạn' : discount.maxUsage}</p>
              </div>
              <div>
                <label className='text-sm text-muted-foreground'>Giới hạn/người dùng</label>
                <p className='font-medium'>
                  {discount.maxUsagePerUser === -1 ? 'Không giới hạn' : discount.maxUsagePerUser}
                </p>
              </div>
              <div>
                <label className='text-sm text-muted-foreground'>Người dùng đã sử dụng</label>
                <p className='font-medium'>{discount.userUsage.length} người</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
