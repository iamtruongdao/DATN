import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tag } from '@/types'
import { ColumnDef, Row } from '@tanstack/react-table'
import { MoreVertical, PencilLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { DeleteTagDialog } from './DeleteTagDialog'

interface ActionsProps {
  row: Row<Tag>
  onEdit: (author: Tag) => void
  showDetail?: boolean

  onDelete: (author: Tag) => void
}
export function Actions({ row, onDelete, onEdit, showDetail = true }: ActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = (tag: Tag) => {
    onDelete(tag)
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

      <DeleteTagDialog
        tag={row.original}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
      />
    </>
  )
}
interface ColumnsProps {
  onDelete: (tag: Tag) => void
  onEdit: (tag: Tag) => void
}
export const getColumn = ({ onDelete, onEdit }: ColumnsProps): ColumnDef<Tag>[] => {
  return [
    {
      accessorKey: 'name',
      header: 'Tên chủ để',
      cell: ({ row }) => {
        const title = row.getValue('name') as string
        return (
          <span className='text-gray-700 font-semibold text-sm'>
            {title.length > 20 ? `${title.slice(0, 20)}...` : title}
          </span>
        )
      }
    },
    {
      accessorKey: 'slug',
      header: 'Mã code',
      enableSorting: false
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
