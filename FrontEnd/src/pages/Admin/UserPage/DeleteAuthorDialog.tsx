import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Author } from '@/types'

interface DeleteAuthorDialogProps {
  author: Author | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (author: Author) => void
}

export function DeleteAuthorDialog({ author, open, onOpenChange, onConfirm }: DeleteAuthorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='bg-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa tác giả</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa tác giả "<span className='font-semibold'>{author?.authorName}</span>" không?
            <br />
            Hành động này sẽ không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(author!)} className='bg-red-600 text-white hover:bg-red-700'>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
