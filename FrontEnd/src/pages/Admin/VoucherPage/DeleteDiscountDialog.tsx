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
import { Discount } from '@/types'

interface DeleteDiscountDialogProps {
  discount: Discount | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (discount: Discount) => void
}

export function DeleteDiscountDialog({ discount, open, onOpenChange, onConfirm }: DeleteDiscountDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='bg-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa voucher</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa voucher "<span className='font-semibold'>{discount?.code}</span>" không?
            <br />
            Hành động này sẽ không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(discount!)} className='bg-red-600 text-white hover:bg-red-700'>
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
