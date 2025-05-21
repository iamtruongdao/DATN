import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { statusMap } from '@/utils/constant'
import { Table } from '@tanstack/react-table'
import { debounce } from 'lodash'
import {
  ArrowDownWideNarrow,
  ArrowUpDown,
  ArrowUpNarrowWide,
  Eye,
  Filter,
  RefreshCcw,
  Search,
  Trash2,
  X
} from 'lucide-react'
import { ChangeEvent } from 'react'

interface TableToolbarProps<TData> {
  table: Table<TData>
  globalFilter: string
  setGlobalFilter: (value: string) => void
  onRefresh: () => void
  isRefreshing?: boolean /**/
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  showSort: boolean
  setShowSort: (show: boolean) => void
  onDeleteSelected?: () => void /** */
}

export function TableToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
  onRefresh,
  isRefreshing = false,
  showFilters,
  setShowFilters,
  showSort,
  setShowSort,
  onDeleteSelected
}: TableToolbarProps<TData>) {
  const allColumns = table.getAllColumns()

  const visibleColumns = allColumns.filter((column) => column.getIsVisible())
  const hideableColumns = allColumns.filter((column) => column.getCanHide())
  const sortableColumns = visibleColumns.filter((column) => column.getCanSort())

  const filterableColumns = visibleColumns.filter((column) => column.getCanFilter())
  console.log(filterableColumns)

  const selectedRows = table.getSelectedRowModel().rows
  const hasSelectedRows = selectedRows.length > 0

  const toggleAllColumns = (checked: boolean) => {
    table.toggleAllColumnsVisible(checked)
  }

  const getSortingInfo = () => {
    const currentSorting = table.getState().sorting
    if (currentSorting.length === 0) {
      return {
        column: null,
        direction: null
      }
    }
    return {
      column: allColumns.find((col) => col.id === currentSorting[0].id),
      direction: currentSorting[0].desc ? 'desc' : 'asc'
    }
  }

  const handleSort = (columnId: string) => {
    const currentSorting = table.getState().sorting
    const isCurrentColumn = currentSorting[0]?.id === columnId

    if (!isCurrentColumn) {
      table.setSorting([{ id: columnId, desc: false }])
    } else if (!currentSorting[0].desc) {
      table.setSorting([{ id: columnId, desc: true }])
    } else {
      table.setSorting([])
    }
  }
  const handleChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value)
  }, 300)
  const getSortIcon = () => {
    const { direction } = getSortingInfo()
    if (!direction) {
      return <ArrowUpDown className='h-4 w-4' />
    }
    return direction === 'desc' ? (
      <ArrowUpNarrowWide className='h-4 w-4' />
    ) : (
      <ArrowDownWideNarrow className='h-4 w-4' />
    )
  }

  const getFilterOptions = (columnId: string) => {
    switch (columnId) {
      case 'orderStatus':
        return {
          options: Object.entries(statusMap).map(([value, { text }]) => ({
            value: value,
            label: text
          })),
          multiple: false
        }
      default:
        return {
          options: [],
          multiple: false
        }
    }
  }

  const isColumnFiltered = (columnId: string) => {
    const filterValue = table.getColumn(columnId)?.getFilterValue()
    return Array.isArray(filterValue) ? filterValue.length > 0 : filterValue !== undefined
  }

  const hasActiveFilters = filterableColumns.some((column) => isColumnFiltered(column.id))

  return (
    <div className='flex items-center justify-between gap-2 px-4 py-2 border-b'>
      {/* Left Side */}
      <div className='flex items-center space-x-2'>
        <div className='relative'>
          <Search className='h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground' />
          <Input placeholder='Search...' className='pl-8 h-9' defaultValue={globalFilter} onChange={handleChange} />
        </div>
      </div>

      {/* Right Side */}
      <div className='flex items-center space-x-2'>
        {onDeleteSelected && (
          <Button
            variant='destructive'
            size='sm'
            onClick={onDeleteSelected}
            className='h-9'
            disabled={!hasSelectedRows}
          >
            <Trash2 className='h-4 w-4 mr-2' />
            Xóa nhiều
          </Button>
        )}

        {showFilters && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant='ghost' size='icon' className={cn('relative', hasActiveFilters && 'bg-accent')}>
                <Filter className='h-4 w-4' />
                {hasActiveFilters && <span className='absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-600' />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-[200px] bg-accent max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto'
            >
              {filterableColumns.map((column) => {
                const filterValue = column.getFilterValue()
                const { options, multiple } = getFilterOptions(column.id)
                if (options.length === 0) return null

                return (
                  <div key={column.id} className='px-2 py-1.5'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='text-sm font-medium'>
                        {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                      </span>
                      {isColumnFiltered(column.id) && (
                        <Badge variant='secondary' className='ml-2'>
                          {Array.isArray(filterValue) ? filterValue.length : 1}
                        </Badge>
                      )}
                    </div>
                    <div className='space-y-2'>
                      {options.map((option) => (
                        <div
                          key={option.value}
                          className='flex items-center space-x-2 px-1 py-1 rounded hover:bg-accent cursor-pointer'
                          onClick={(e) => {
                            e.preventDefault()
                            if (multiple) {
                              const values = (filterValue || []) as string[]
                              const newFilterValue = values.includes(option.value)
                                ? values.filter((v) => v !== option.value)
                                : [...values, option.value]
                              column.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
                            } else {
                              const currentValue = filterValue as string | undefined
                              column.setFilterValue(currentValue === option.value ? undefined : option.value)
                            }
                          }}
                        >
                          <Checkbox
                            checked={
                              multiple
                                ? Array.isArray(filterValue) && filterValue.includes(option.value)
                                : filterValue === option.value
                            }
                            className='mr-2'
                          />
                          <span className='text-sm'>{option.label}</span>
                        </div>
                      ))}
                    </div>
                    {isColumnFiltered(column.id) && (
                      <Button
                        variant='ghost'
                        size='sm'
                        className='w-full mt-2 h-8 text-destructive hover:text-destructive'
                        onClick={() => column.setFilterValue(undefined)}
                      >
                        <X className='mr-2 h-4 w-4' />
                        <span>Xóa bộ lọc</span>
                      </Button>
                    )}
                  </div>
                )
              })}
              {hasActiveFilters && (
                <div className='px-2 py-1.5'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full h-8 text-destructive hover:text-destructive'
                    onClick={() => {
                      filterableColumns.forEach((column) => {
                        column.setFilterValue(undefined)
                      })
                    }}
                  >
                    <X className='mr-2 h-4 w-4' />
                    <span>Xóa tất cả bộ lọc</span>
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {showSort && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                asChild
                variant='ghost'
                size='icon'
                className={cn('relative', table.getState().sorting.length > 0 && 'bg-accent')}
              >
                {getSortIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[200px] bg-white'>
              {sortableColumns.map((column) => {
                const { column: sortedColumn, direction } = getSortingInfo()

                const isCurrentColumn = sortedColumn?.id === column.id
                return (
                  <DropdownMenuItem
                    key={column.id}
                    onClick={() => handleSort(column.id)}
                    className='flex items-center justify-between '
                  >
                    <span>{typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}</span>
                    {isCurrentColumn &&
                      (direction === 'asc' ? (
                        <ArrowDownWideNarrow className='h-4 w-4' />
                      ) : (
                        <ArrowUpNarrowWide className='h-4 w-4' />
                      ))}
                  </DropdownMenuItem>
                )
              })}
              {table.getState().sorting.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => table.setSorting([])} className='text-destructive'>
                    Xóa sắp xếp
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant='ghost' size='icon' className='relative'>
              <Eye className='h-4 w-4' />
              {visibleColumns.length < allColumns.length && (
                <span className='absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-600' />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='w-[200px] bg-white max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto'
          >
            <div className='sticky top-0 bg-background z-10 border-b'>
              <div className='p-2'>
                <div className='flex items-center space-x-2 px-1 py-1'>
                  <Checkbox
                    checked={visibleColumns.length === allColumns.length}
                    onCheckedChange={(checked) => toggleAllColumns(!!checked)}
                    id='all-columns'
                  />
                  <label
                    htmlFor='all-columns'
                    className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                  >
                    Tất cả
                  </label>
                </div>
              </div>
            </div>
            <div className='p-2 pt-0'>
              {hideableColumns.map((column) => {
                const isVisible = column.getIsVisible()
                return (
                  <div key={column.id} className='flex items-center space-x-2 px-1 py-1.5 rounded hover:bg-accent'>
                    <Checkbox
                      checked={isVisible}
                      onCheckedChange={(checked) => column.toggleVisibility(!!checked)}
                      id={column.id}
                    />
                    <label
                      htmlFor={column.id}
                      className='flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
                    </label>
                  </div>
                )
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant='ghost' size='icon' onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCcw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
        </Button>
      </div>
    </div>
  )
}
