'use client'

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CircleUser,
  CreditCard,
  KeyRound,
  LogOut,
  Newspaper,
  Sparkles
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { Link, useNavigate } from 'react-router-dom'
import { setLoading } from '@/redux/slice/appSlice'
import { useAppDispatch } from '@/hooks'
import { logoutAction } from '@/redux/slice/userSlice'

export function AppbarUser({
  user
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    // Handle logout logic here (e.g., API call, state update)
    // For example:
    try {
      dispatch(setLoading(true))
      await dispatch(logoutAction()) // Đảm bảo logout xong mới chuyển trang
      await new Promise((resolve) => setTimeout(resolve, 100)) // Giả lập thời gian xử lý logout
      // Sau khi logout thành công, chuyển trang luôn
      navigate('/admin/login', { replace: true }) // dùng replace để không lưu history
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      dispatch(setLoading(false)) // Ẩn loading nếu cần trong component khác
    }

    // Redirect to login page or show a success message
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant='ghost' className='h-auto p-2'>
          <div className='flex items-center gap-2'>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>{user.name}</span>
              <span className='truncate text-xs text-muted-foreground'>{user.email}</span>
            </div>
            <ChevronsUpDown className='ml-2 h-4 w-4 text-muted-foreground' />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-[--radix-dropdown-menu-trigger-width] bg-white min-w-56 rounded-lg'
        side={'bottom'}
        align='end'
        sideOffset={4}
      >
        {/* <DropdownMenuLabel className='p-0 font-normal'>
          <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-semibold'>{user.name}</span>
              <span className='truncate text-xs'>{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel> */}
        {/* <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link to={'/user'} className='flex items-center'>
              <CircleUser className='mr-2 h-4 w-4' />
              Hồ sơ cá nhân
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Newspaper className='mr-2 h-4 w-4' />
            Quản lý tin đăng
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className='mr-2 h-4 w-4' />
            Quản lý giao diịch
          </DropdownMenuItem>
          <DropdownMenuItem>
            <KeyRound className='mr-2 h-4 w-4' />
            Đổi mật khẩu
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className='mr-2 h-4 w-4' />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
