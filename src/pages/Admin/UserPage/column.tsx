import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Author, UserResponse } from '@/types'
import { ColumnDef, Row } from '@tanstack/react-table'
import { BookOpen, MoreVertical, PencilLine, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { DeleteAuthorDialog } from './DeleteAuthorDialog'
import { Switch } from '@/components/ui/switch'
interface ActionsProps {
  row: Row<UserResponse>
  onEdit: (author: UserResponse) => void
  showDetail?: boolean
  onViewDetail: (author: UserResponse) => void
  onDelete: (author: UserResponse) => void
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
  onStatusChange: (checked: boolean, id: string) => void
}
export const getColumn = ({ onStatusChange }: ColumnsProps): ColumnDef<UserResponse>[] => {
  return [
    {
      accessorKey: 'fullName',
      header: 'Tên'
    },
    {
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'isLocked',
      header: 'Trạng thái',
      cell: ({ row }) => {
        return (
          <Switch
            checked={row.original.isLocked}
            onCheckedChange={(checked) => onStatusChange(checked, row.original.id)}
          />
        )
      }
    },
    {
      accessorKey: 'roles',
      header: 'Role',
      cell: ({ row }) => {
        const roles = row.original.roles.map((role) => role).join(', ')
        return <div className='relative'>{roles}</div>
      },
      enableSorting: false
    }
  ]
}
