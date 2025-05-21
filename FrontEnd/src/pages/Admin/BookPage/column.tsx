import { Book, Category } from '@/types'
import { ColumnDef, Row } from '@tanstack/react-table'
import { BookOpen, MoreVertical, PencilLine, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { formatMoney } from '@/utils'
import { DeleteBookDialog } from './DeleteBookDialog'
interface ActionsProps {
  row: Row<Book>
  onEdit: (book: Book) => void
  onViewDetail: (post: Book) => void
  onDelete: (post: Book) => void
}
export function Actions({ row, onViewDetail, onDelete, onEdit }: ActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = (book: Book) => {
    onDelete(book)
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
            <Button variant='ghost' className='flex cursor-pointer h-8 w-8 p-0 data-[state=open]:bg-muted'>
              <MoreVertical className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[160px] bg-white'>
            <DropdownMenuItem className='cursor-pointer hover:bg-gray-300' onClick={() => onViewDetail(row.original)}>
              <BookOpen className='mr-2 h-4 w-4' /> Chi tiết
            </DropdownMenuItem>
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

      <DeleteBookDialog
        book={row.original}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </>
  )
}
interface ColumnsProps {
  onViewDetail: (post: Book) => void
  onDelete: (post: Book) => void
  onEdit: (book: Book) => void
}
export const getColumn = ({ onDelete, onViewDetail, onEdit }: ColumnsProps): ColumnDef<Book>[] => {
  return [
    {
      accessorKey: 'authorName',
      header: 'Tác giả',
      cell: ({ row }) => {
        return (
          <div className='font-medium max-w-[150px] truncate overflow-hidden whitespace-nowrap'>
            {row.getValue('authorName')}
          </div>
        )
      }
    },
    {
      accessorKey: 'productName',
      header: 'Tên',
      cell: ({ row }) => {
        return (
          <div className='font-medium max-w-[150px] truncate overflow-hidden whitespace-nowrap'>
            {row.getValue('productName')}
          </div>
        )
      },
      enableSorting: true
    },
    {
      accessorKey: 'productPrice',
      header: 'Giá',
      cell: ({ row }) => {
        return <div className=' font-medium'>{formatMoney(row.getValue('productPrice'))}</div>
      }
    },
    {
      accessorKey: 'category',
      header: 'Danh mục',
      cell: ({ row }) => {
        const categories = row.getValue<Category[]>('category')
        const label = categories?.map((c) => c.name).join(', ')
        return <div className='font-medium'>{label}</div>
      }
    },
    {
      accessorKey: 'avatar',
      header: 'Hình ảnh',
      cell: ({ row }) => {
        const image = row.getValue('avatar') as string
        const title = row.getValue('title') as string
        return (
          <div className='relative w-50 h-30'>
            <img
              src={image}
              alt={`Hình ảnh ${title || 'Bất động sản'}`}
              className='object-cover rounded-md w-full h-full'
            />
          </div>
        )
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
