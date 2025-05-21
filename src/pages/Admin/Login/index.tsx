import { useState } from 'react'
import { Eye, EyeOff, Lock, LogIn, User } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAppDispatch } from '@/hooks'
import { loginAction } from '@/redux/slice/userSlice'
import { toast } from 'react-toastify'
import { Role } from '@/utils/constant'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const dispatch = useAppDispatch()
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // Reset validation errors
    setEmailError('')
    setPasswordError('')
    setError('')

    // Validate email
    if (!email) {
      setEmailError('Email không được để trống')
      return
    } else if (!validateEmail(email)) {
      setEmailError('Email không đúng định dạng')
      return
    }

    // Validate password
    if (!password) {
      setPasswordError('Mật khẩu không được để trống')
      return
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    try {
      setLoading(true)

      // Giả lập quá trình đăng nhập

      // Ở đây bạn sẽ thêm logic xác thực thực tế
      const res = await dispatch(loginAction({ email, password })).unwrap()

      if (res.code === 0 && res.data.roles.includes(Role.Admin)) {
        window.location.replace('/admin') // Redirect tới trang dashboard
        // Redirect tới trang dashboard
      } else {
        toast.error('Email hoặc mật khẩu không chính xác!')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100 p-4'>
      <div className='bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl'>
        <div className='flex flex-col md:flex-row'>
          {/* Đổi thành responsive flex-row từ md breakpoint */}
          {/* Phần bên trái - Hình ảnh */}
          <div className='hidden md:block md:w-2/5 bg-blue-600 p-8'>
            <div className='h-full flex flex-col justify-center'>
              <h1 className='text-white text-3xl font-bold mb-4'>Hệ Thống Quản Trị</h1>
              <p className='text-blue-100'>
                Quản lý nội dung, người dùng và dữ liệu một cách dễ dàng từ bảng điều khiển.
              </p>
            </div>
          </div>

          {/* Phần bên phải - Form đăng nhập */}
          <div className='w-full md:w-3/5 p-6'>
            <div className='max-w-md mx-auto'>
              <div className='text-center mb-8'>
                <h2 className='text-2xl font-bold text-gray-900'>Đăng nhập quản trị</h2>
                <p className='text-gray-600 text-sm mt-1'>Vui lòng đăng nhập để truy cập trang quản trị</p>
              </div>

              {error && (
                <Alert className='mb-6 border-red-400 bg-red-50 text-red-800'>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className='space-y-6'>
                {/* Email field */}
                <div className='space-y-2'>
                  <label htmlFor='email' className='text-sm font-medium text-gray-700'>
                    Email
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <User className='h-5 w-5 text-gray-400' />
                    </div>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      autoComplete='email'
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-2 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        emailError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='admin@example.com'
                    />
                  </div>
                  {emailError && <p className='mt-1 text-sm text-red-600'>{emailError}</p>}
                </div>

                {/* Password field */}
                <div className='space-y-2'>
                  <label htmlFor='password' className='text-sm font-medium text-gray-700'>
                    Mật khẩu
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                      <Lock className='h-5 w-5 text-gray-400' />
                    </div>
                    <input
                      id='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      autoComplete='current-password'
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`block w-full pl-10 pr-10 py-2 border rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        passwordError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='••••••••'
                    />
                    <div className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='text-gray-400 hover:text-gray-500 focus:outline-none'
                      >
                        {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                      </button>
                    </div>
                  </div>
                  {passwordError && <p className='mt-1 text-sm text-red-600'>{passwordError}</p>}
                </div>

                {/* Forgot password */}
                <div className='flex items-center justify-end'>
                  <div className='text-sm'>
                    <a href='#' className='font-medium text-blue-600 hover:text-blue-500'>
                      Quên mật khẩu?
                    </a>
                  </div>
                </div>

                {/* Login button */}
                <div>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                      <LogIn className='h-5 w-5 text-blue-500 group-hover:text-blue-400' aria-hidden='true' />
                    </span>
                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                  </button>
                </div>
              </div>

              <div className='mt-6'>
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-gray-300' />
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-2 bg-white text-gray-500'>Hoặc tiếp tục với</span>
                  </div>
                </div>

                <div className='mt-6 grid grid-cols-2 gap-3'>
                  <button
                    type='button'
                    className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'
                  >
                    Google
                  </button>
                  <button
                    type='button'
                    className='w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'
                  >
                    Microsoft
                  </button>
                </div>
              </div>
            </div>

            <div className='mt-8 text-center text-sm text-gray-600'>
              <p>© 2025 Công ty của bạn. Tất cả các quyền được bảo lưu.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
