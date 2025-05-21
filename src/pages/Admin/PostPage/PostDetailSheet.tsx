import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Post } from '@/types'
import { useEffect, useState } from 'react'

interface PostDetailProps {
  post: Post | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostDetailSheet({ post, open, onOpenChange }: PostDetailProps) {
  const [selectedImage, setSelectedImage] = useState<string>('')

  useEffect(() => {
    if (post) {
      setSelectedImage(post.thumbnail)
    }
  }, [post])

  if (!post) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='bg-white w-full sm:max-w-xl flex flex-col p-0'>
        <SheetHeader className='px-4 py-2 border-b border-b-gray-100 flex-none'>
          <SheetTitle>Chi tiết bài viết</SheetTitle>
        </SheetHeader>

        <ScrollArea className='flex-1 h-[calc(100vh-80px)] px-4 py-6 space-y-6'>
          {/* Ảnh bìa */}
          <div className='w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md'>
            <img src={selectedImage} alt={post.title} className='w-full h-full object-cover' />
          </div>

          {/* Thông tin mô tả */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Thông tin bài viết</h3>
            <div className='space-y-2'>
              <div>
                <label className='text-sm text-muted-foreground'>Tiêu đề</label>
                <p className='font-medium'>{post.title}</p>
              </div>

              <div>
                <label className='text-sm text-muted-foreground'>Nội dung</label>
                <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
