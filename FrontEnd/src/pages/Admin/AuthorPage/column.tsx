import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Author } from '@/types'
import { ColumnDef, Row } from '@tanstack/react-table'
import { BookOpen, MoreVertical, PencilLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { DeleteAuthorDialog } from './DeleteAuthorDialog'

interface ActionsProps {
  row: Row<Author>
  onEdit: (author: Author) => void
  showDetail?: boolean
  onViewDetail: (author: Author) => void
  onDelete: (author: Author) => void
}
export function Actions({ row, onViewDetail, onDelete, onEdit, showDetail = true }: ActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = (author: Author) => {
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

      <DeleteAuthorDialog
        author={row.original}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </>
  )
}
interface ColumnsProps {
  onViewDetail: (post: Author) => void
  onDelete: (post: Author) => void
  onEdit: (book: Author) => void
}
export const getColumn = ({ onDelete, onViewDetail, onEdit }: ColumnsProps): ColumnDef<Author>[] => {
  return [
    {
      accessorKey: 'authorName',
      header: 'Tên tác giả',
      cell: ({ row }) => {
        return (
          <div className='font-medium max-w-[150px] truncate overflow-hidden whitespace-nowrap'>
            {row.getValue('authorName')}
          </div>
        )
      }
    },
    {
      accessorKey: 'authorDescription',
      header: 'Mô tả',
      cell: ({ row }) => {
        const des: string = row.getValue('authorDescription')

        return (
          <div
            dangerouslySetInnerHTML={{ __html: des }}
            className='font-medium  whitespace-normal w-[500px]  line-clamp-4 '
          />
        )
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
