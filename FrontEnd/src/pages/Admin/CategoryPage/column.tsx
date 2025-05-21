import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Category } from '@/types'
import { ColumnDef, Row } from '@tanstack/react-table'
import { MoreVertical, PencilLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { DeleteCategoryDialog } from './DeleteCategoryDialog'

interface ActionsProps {
  row: Row<Category>
  onEdit: (author: Category) => void
  onDelete: (author: Category) => void
}
export function Actions({ row, onDelete, onEdit }: ActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = (category: Category) => {
    onDelete(category)
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
      <div className='flex justify-end px-1 '>
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger>
            <Button variant='ghost' className='cursor-pointer flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
              <MoreVertical className='h-4 w-4' />
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-[160px] bg-white'>
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

      <DeleteCategoryDialog
        category={row.original}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </>
  )
}
interface ColumnsProps {
  onDelete: (post: Category) => void
  onEdit: (book: Category) => void
}
export const getColumn = ({ onDelete, onEdit }: ColumnsProps): ColumnDef<Category>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'Tên danh mục',
      cell: ({ row }) => {
        return (
          <div className='font-medium max-w-[350px] truncate overflow-hidden whitespace-nowrap'>
            {row.getValue('name')}
          </div>
        )
      }
    },

    {
      id: 'actions',
      size: 40,
      enableHiding: false,
      header: () => null,
      cell: ({ row }) => <Actions onEdit={onEdit} row={row} onDelete={onDelete} />
    }
  ]
}
