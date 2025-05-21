import logo from '@/assets/logo.webp'
import Nav from '@/components/Nav'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { setLoading } from '@/redux/slice/appSlice'
import { logoutAction } from '@/redux/slice/userSlice'
import { Search, ShoppingBag, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Notification from '@/components/Notification'

const Header = () => {
  const { cartCountProduct } = useAppSelector((state) => state.cart)
  const { isLogin } = useAppSelector((state) => state.user)
  const [searchValue, setSearchValue] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const handleSearch = () => {
    if (!searchValue) return
    navigate(`/search?q=${searchValue}`)
  }
  const handleLogout = async () => {
    // Handle logout logic here (e.g., API call, state update)
    // For example:
    try {
      dispatch(setLoading(true))
      await dispatch(logoutAction()) // Đảm bảo logout xong mới chuyển trang
      await new Promise((resolve) => setTimeout(resolve, 100)) // Giả lập thời gian xử lý logout
      // Sau khi logout thành công, chuyển trang luôn
      navigate('/login', { replace: true }) // dùng replace để không lưu history
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      dispatch(setLoading(false)) // Ẩn loading nếu cần trong component khác
    }

    // Redirect to login page or show a success message
  }
  return (
    <>
      {/* Top notification bar */}

      <header className='sticky z-10 top-0 left-0 right-0 h-20 bg-white w-full border-b-2 border-b-[#228b22]'>
        <div className='container w-full h-full flex items-center justify-between mx-auto'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link to={'/'}>
              {/* <img src={logo} alt='Nhã Nam Logo' />
               */}
              <h1 className='text-2xl'>NhaNam</h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <Nav />
          {/* Search and Actions */}
          <div className='flex items-center gap-2'>
            <div className='relative hidden md:block'>
              <Input
                type='text'
                placeholder='Tìm kiếm...'
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.code === 'Enter' && handleSearch()}
                className='w-48 lg:w-64 focus-visible:ring-[1px] rounded-full bg-gray-50 focus:border-none !pl-4 !pr-8'
              />
              <Search
                className='absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500'
                onClick={handleSearch}
              />
            </div>
            <div className='relative group'>
              <Button variant='ghost' size='icon' className='cursor-pointer group-hover:bg-accent'>
                <User className='h-5 w-5' />
              </Button>

              {isLogin ? (
                <div className='absolute right-0 mt-1 w-48 bg-white shadow-md rounded border border-gray-200 z-10 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200'>
                  <Link to={'profile'}>
                    <div className='py-3 px-4 cursor-pointer text-sm hover:bg-gray-100 border-b border-gray-100'>
                      Tài Khoản Của Tôi
                    </div>
                  </Link>
                  <Link to={'/order'}>
                    <div className='py-3 px-4 cursor-pointer text-sm hover:bg-gray-100 border-b border-gray-100'>
                      Đơn Mua
                    </div>
                  </Link>
                  <div
                    onClick={handleLogout}
                    className='py-3 px-4 cursor-pointer text-sm hover:bg-gray-100 text-red-500'
                  >
                    Đăng Xuất
                  </div>
                </div>
              ) : (
                <div className='absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50'>
                  <div className='py-1 flex flex-col'>
                    <Link to='/login' className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
                      Đăng nhập
                    </Link>

                    <Link
                      to='/register'
                      className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    >
                      Đăng ký
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Notification />

            <Link to={'/cart'}>
              <Button variant='ghost' size='icon' className='cursor-pointer text-gray-700 relative'>
                <ShoppingBag size={20} />
                <span className='absolute top-0 right-0 h-4 w-4 bg-green-600 text-white rounded-full text-xs flex items-center justify-center'>
                  {cartCountProduct}
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
