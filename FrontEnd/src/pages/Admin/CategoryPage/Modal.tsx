import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { Category } from '@/types'

interface CategoryModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (category: Category) => void
  category?: Category | null // nếu có thì mode Sửa
}

export function CategoryModal({ open, onClose, onSubmit, category }: CategoryModalProps) {
  const [cat, setCategory] = useState<Category>(category ? category : { id: '', name: '', slug: '' })

  useEffect(() => {
    if (category) setCategory(category) // reset khi mở modal
  }, [category, open])

  const handleSubmit = () => {
    onSubmit(cat)
    setCategory({ id: '', name: '', slug: '' }) // reset sau khi submit
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{category ? 'Cập nhật danh mục' : 'Thêm danh mục'}</DialogTitle>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Tên danh mục:</label>
            <Input
              value={cat.name}
              placeholder='Nhập tên danh mục'
              onChange={(e) => setCategory((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>{category ? 'Cập nhật' : 'Thêm'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
