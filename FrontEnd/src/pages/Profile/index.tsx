// Profile.tsx
import { Bell, ShoppingBag, Tag, User, Wallet } from 'lucide-react'
import React from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'

const Profile: React.FC = () => {
  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <div className='w-64 bg-white p-4 border-r border-gray-200'>
        <div className='flex items-center space-x-3 mb-8'>
          <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
            <User size={20} className='text-gray-500' />
          </div>
          <div>
            <Link to='/profile/edit' className='text-xs text-gray-500 hover:text-gray-700'>
              Sửa Hồ Sơ
            </Link>
          </div>
        </div>

        <nav className='space-y-1'>
          {/* <Link
            to='/notifications'
            className='flex items-center space-x-3 py-2 text-orange-500 hover:bg-orange-50 rounded px-2'
          >
            <Bell size={18} />
            <span>Thông Báo</span>
          </Link> */}

          <div className='flex items-center space-x-3 py-2'>
            <User size={18} className='text-gray-600' />
            <span>Tài Khoản Của Tôi</span>
          </div>

          <NavLink
            to='/profile'
            className={({ isActive }) =>
              `${isActive ? 'text-orange-500  ' : 'text-gray-600'} block pl-8 py-2  hover:bg-gray-50 rounded px-2`
            }
            end
          >
            <span>Hồ Sơ</span>
          </NavLink>
          {/* 
          <NavLink to='/profile/address' className='block pl-8 py-2 text-gray-600 hover:bg-gray-50 rounded px-2'>
            <span>Địa Chỉ</span>
          </NavLink> */}

          <NavLink
            to='/profile/password'
            className={({ isActive }) =>
              `${isActive ? 'text-orange-500  ' : 'text-gray-600'} block pl-8 py-2  hover:bg-gray-50 rounded px-2`
            }
          >
            <span>Đổi Mật Khẩu</span>
          </NavLink>

          {/* <Link to='/profile/notifications' className='block pl-8 py-2 text-gray-600 hover:bg-gray-50 rounded px-2'>
            <span>Cài Đặt Thông Báo</span>
          </Link>

          <Link to='/profile/privacy' className='block pl-8 py-2 text-gray-600 hover:bg-gray-50 rounded px-2'>
            <span>Những Thiết Lập Riêng Tư</span>
          </Link> */}

          <Link to='/order' className='flex items-center space-x-3 py-2 text-gray-600 hover:bg-gray-50 rounded px-2'>
            <ShoppingBag size={18} />
            <span>Đơn Mua</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className='flex-1 p-6'>
        <Outlet />
      </div>
    </div>
  )
}

export default Profile
