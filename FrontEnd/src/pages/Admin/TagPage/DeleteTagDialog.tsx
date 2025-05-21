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
import { Tag } from '@/types'

interface DeleteTagDialogProps {
  tag: Tag | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (author: Tag) => void
}

export function DeleteTagDialog({ tag, open, onOpenChange, onConfirm }: DeleteTagDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='bg-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa chủ đề</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa chủ đề "<span className='font-semibold'>{tag?.name}</span>" không?
            <br />
            Hành động này sẽ không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(tag!)} className='bg-red-600 text-white hover:bg-red-700'>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
