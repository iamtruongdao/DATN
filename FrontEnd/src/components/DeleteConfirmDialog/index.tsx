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

interface DeleteConfirmDialogProps {
  open: boolean
  isLoading: boolean
  productName?: string
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteConfirmDialog({
  productName,
  open,
  onCancel,
  onConfirm,
  isLoading
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className='bg-white'>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa sản phẩm</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa sản phẩm <span className='text-red-400'>{productName}</span> khỏi giỏ hàng?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer' onClick={onCancel}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`bg-gray-500 cursor-pointer hover:bg-gray-600 flex items-center justify-center w-20  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span className='animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full'></span>
            ) : (
              'Xóa'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
