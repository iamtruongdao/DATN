import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Discount } from '@/types'
import { formatDate } from '@/utils'
import { ColumnDef, Row } from '@tanstack/react-table'
import { BookOpen, MoreVertical, PencilLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { DeleteDiscountDialog } from './DeleteDiscountDialog'

interface ActionsProps {
  row: Row<Discount>
  onEdit: (author: Discount) => void
  showDetail?: boolean
  onViewDetail: (author: Discount) => void
  onDelete: (author: Discount) => void
}
export function Actions({ row, onViewDetail, onDelete, onEdit, showDetail = true }: ActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = (author: Discount) => {
    onDelete(author)
    setShowDeleteDialog(false)
  }

  const handleClickDelete = () => {
    setMenuOpen(false) // đóng menu trước
    setTimeout(() => {
      setShowDeleteDialog(true) // mở dialog sau
    }, 100)
  }

  return (
    <>
      <div className='flex justify-end px-1'>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger>
            <Button variant='outline' className='flex cursor-pointer h-8 w-8 p-0 data-[state=open]:bg-muted'>
              <MoreVertical className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[160px] bg-white'>
            {showDetail && (
              <DropdownMenuItem className='cursor-pointer hover:bg-gray-300' onClick={() => onViewDetail(row.original)}>
                <BookOpen className='mr-2 h-4 w-4' /> Chi tiết
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className='cursor-pointer hover:bg-gray-300'
              // TODO: implement Edit function
              onClick={() => onEdit(row.original)}
            >
              <PencilLine className='mr-2 h-4 w-4' /> Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-destructive focus:text-destructive cursor-pointer hover:bg-gray-300'
              onClick={handleClickDelete}
            >
              <Trash2 className='mr-2 h-4 w-4' color='red' /> Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteDiscountDialog
        discount={row.original}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </>
  )
}
interface ColumnsProps {
  onViewDetail: (post: Discount) => void
  onDelete: (post: Discount) => void
  onEdit: (book: Discount) => void
}
export const getColumn = ({ onDelete, onViewDetail, onEdit }: ColumnsProps): ColumnDef<Discount>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'Tên'
    },
    // {
    //   accessorKey: 'description',
    //   header: 'Mô tả',
    //   cell: ({ row }) => {
    //     const des: string = row.getValue('description')

    //     return (
    //       <div
    //         dangerouslySetInnerHTML={{ __html: des }}
    //         className='font-medium  whitespace-normal w-[100px]  line-clamp-1 '
    //       />
    //     )
    //   }
    // },
    {
      accessorKey: 'code',
      header: 'Mã giảm giá',
      enableSorting: false
    },
    {
      accessorKey: 'startDate',
      header: 'Ngày bắt đầu',
      cell({ row }) {
        return <div>{formatDate(row.original.startDate.toString())}</div>
      },
      enableSorting: false
    },
    {
      accessorKey: 'endDate',
      header: 'Ngày kết thúc',
      cell({ row }) {
        return <div>{formatDate(row.original.endDate.toString())}</div>
      },
      enableSorting: false
    },
    {
      id: 'actions',
      size: 40,
      enableHiding: false,
      header: () => null,
      cell: ({ row }) => <Actions onEdit={onEdit} row={row} onViewDetail={onViewDetail} onDelete={onDelete} />
    }
  ]
}
