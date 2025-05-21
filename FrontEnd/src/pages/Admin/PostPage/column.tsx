import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Post } from '@/types'
import { ColumnDef, Row } from '@tanstack/react-table'
import { BookOpen, MoreVertical, PencilLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { DeletePostDialog } from '@/pages/Admin/PostPage/DeletePostDialog'

interface ActionsProps {
  row: Row<Post>
  onEdit: (author: Post) => void
  showDetail?: boolean
  onViewDetail: (author: Post) => void
  onDelete: (author: Post) => void
}
export function Actions({ row, onViewDetail, onDelete, onEdit, showDetail = true }: ActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = (post: Post) => {
    onDelete(post)
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

      <DeletePostDialog
        post={row.original}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </>
  )
}
interface ColumnsProps {
  onViewDetail: (post: Post) => void
  onDelete: (post: Post) => void
  onEdit: (book: Post) => void
}
export const getColumn = ({ onDelete, onViewDetail, onEdit }: ColumnsProps): ColumnDef<Post>[] => {
  return [
    {
      accessorKey: 'title',
      header: 'Tiêu đề',
      cell: ({ row }) => {
        const title = row.getValue('title') as string
        return (
          <span className='text-gray-700 font-semibold text-sm'>
            {title.length > 20 ? `${title.slice(0, 20)}...` : title}
          </span>
        )
      }
    },
    {
      accessorKey: 'thumbnail',
      header: 'Hình ảnh',

      cell: ({ row }) => {
        const image = row.original.thumbnail
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
      accessorKey: 'tag',
      header: 'Chủ đề',
      cell: ({ row }) => {
        const tags = row.original.tag[0]

        return (
          <span key={tags?.id} className=' text-gray-700 px-2 py-1 rounded-md'>
            {tags?.name}
          </span>
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
