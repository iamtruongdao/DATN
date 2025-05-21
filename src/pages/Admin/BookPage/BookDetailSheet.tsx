import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useState } from 'react'
import { Book } from '@/types'
import { formatDateStringToVietnamese, formatMoney } from '@/utils'

interface BookDetailSheetProps {
  book: Book | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookDetailSheet({ book, open, onOpenChange }: BookDetailSheetProps) {
  const [selectedImage, setSelectedImage] = useState<string>('')

  useEffect(() => {
    if (book) {
      setSelectedImage(book.avatar)
    }
  }, [book])

  if (!book) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='bg-white w-full sm:max-w-xl flex flex-col p-0'>
        <SheetHeader className='px-4 py-2 border-b border-b-gray-100 flex-none'>
          <SheetTitle>Chi tiết sách</SheetTitle>
        </SheetHeader>

        <ScrollArea className='flex-1 h-[calc(100vh-80px)] px-4 py-6 space-y-6'>
          {/* Ảnh bìa */}
          <div className='w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md'>
            <img src={selectedImage} alt={book.productName} className='w-full h-full object-cover' />
          </div>

          {/* Thông tin mô tả */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Thông tin sách</h3>
            <div className='space-y-2'>
              <div>
                <label className='text-sm text-muted-foreground'>Tên sách</label>
                <p className='font-medium'>{book.productName}</p>
              </div>

              <div>
                <label className='text-sm text-muted-foreground'>Tác giả</label>
                <p className='font-medium'>{book.authorName}</p>
              </div>

              {book.translator && (
                <div>
                  <label className='text-sm text-muted-foreground'>Người dịch</label>
                  <p className='font-medium'>{book.translator}</p>
                </div>
              )}

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm text-muted-foreground'>Giá gốc</label>
                  <p className='font-medium'>{formatMoney(book.productPrice)}</p>
                </div>

                {book.discountPrice && (
                  <div>
                    <label className='text-sm text-muted-foreground'>Giá khuyến mãi</label>
                    <p className='font-medium text-red-500'>{formatMoney(book.discountPrice)}</p>
                  </div>
                )}

                <div>
                  <label className='text-sm text-muted-foreground'>Giảm giá</label>
                  <p className='font-medium'>{book.discount}%</p>
                </div>

                <div>
                  <label className='text-sm text-muted-foreground'>Số lượng</label>
                  <p className='font-medium'>{book.productQuantity}</p>
                </div>

                <div>
                  <label className='text-sm text-muted-foreground'>Số trang</label>
                  <p className='font-medium'>{book.pageNumber}</p>
                </div>

                <div>
                  <label className='text-sm text-muted-foreground'>Ngày phát hành</label>
                  <p className='font-medium'>{formatDateStringToVietnamese(book.publicDate.toString())}</p>
                </div>
              </div>

              <div>
                <label className='text-sm text-muted-foreground'>Danh mục</label>
                <div className='flex flex-wrap gap-2 mt-1'>
                  {book.category.map((category) => (
                    <span key={category.id} className='text-sm px-2 py-1 bg-muted rounded-full'>
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className='text-sm text-muted-foreground'>Mô tả</label>
                <p dangerouslySetInnerHTML={{ __html: book.productDescription }} className='whitespace-pre-line'></p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
