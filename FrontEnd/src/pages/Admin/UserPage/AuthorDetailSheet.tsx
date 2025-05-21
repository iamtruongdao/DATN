import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Author } from '@/types'
import { useEffect, useState } from 'react'

interface AuthorDetailSheetProps {
  author: Author | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthorDetailSheet({ author, open, onOpenChange }: AuthorDetailSheetProps) {
  const [selectedImage, setSelectedImage] = useState<string>('')

  useEffect(() => {
    if (author) {
      setSelectedImage(author.avatar!)
    }
  }, [author])

  if (!author) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='bg-white w-full sm:max-w-xl flex flex-col p-0'>
        <SheetHeader className='px-4 py-2 border-b border-b-gray-100 flex-none'>
          <SheetTitle>Chi tiết tác giả</SheetTitle>
        </SheetHeader>

        <ScrollArea className='flex-1 h-[calc(100vh-80px)] px-4 py-6 space-y-6'>
          {/* Ảnh bìa */}
          <div className='w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md'>
            <img src={selectedImage} alt={author.authorName} className='w-full h-full object-cover' />
          </div>

          {/* Thông tin mô tả */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Thông tin tác giả</h3>
            <div className='space-y-2'>
              <div>
                <label className='text-sm text-muted-foreground'>Tên tác giả</label>
                <p className='font-medium'>{author.authorName}</p>
              </div>

              <div>
                <label className='text-sm text-muted-foreground'>Mô tả</label>
                <p dangerouslySetInnerHTML={{ __html: author.authorDescription }} className='whitespace-pre-line'></p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
