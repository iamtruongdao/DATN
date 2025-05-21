import { resetPasswordApi } from '@/apis/auth.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import VerificationDialog from '@/components/Verify'
import { useAppSelector } from '@/hooks'
import { Eye, EyeOff } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const {
    userInfo: { email }
  } = useAppSelector((state) => state.user)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await resetPasswordApi({ email, password: confirmPassword })
    if (res.code === 0) {
      // Handle successful password reset
      toast.success('Mật khẩu đã được đặt lại thành công!')
      setPassword('')
      setConfirmPassword('')
      // You can redirect the user or show a success message here
    }

    // Handle password submission logic here
  }
  return (
    <>
      <VerificationDialog />

      <div className='mb-6'>
        <h2 className='text-lg font-medium text-gray-800 mb-1'>Thêm mật khẩu</h2>
        <p className='text-sm text-gray-500'>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
        <div className='mt-2 border-b border-gray-200'></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='space-y-4 m-auto'>
          <div className='relative w-1/3'>
            <div className='flex justify-between items-center mb-2'>
              <label htmlFor='password' className='text-sm text-amber-700'>
                Mật khẩu mới
              </label>
            </div>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='pr-10 focus-visible:ring-transparent border-gray-300 rounded'
              />
              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5 text-gray-500' />
                ) : (
                  <Eye className='h-5 w-5 text-gray-500' />
                )}
              </button>
            </div>
          </div>

          <div className='relative w-1/3'>
            <div className='flex justify-between items-center mb-2'>
              <label htmlFor='confirmPassword' className='text-sm text-amber-700'>
                Xác nhận mật khẩu
              </label>
            </div>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='pr-10 focus-visible:ring-transparent border-gray-300 rounded'
              />
              <button
                type='button'
                onClick={toggleConfirmPasswordVisibility}
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
              >
                {showConfirmPassword ? (
                  <EyeOff className='h-5 w-5 text-gray-500' />
                ) : (
                  <Eye className='h-5 w-5 text-gray-500' />
                )}
              </button>
            </div>
          </div>

          <div className='flex justify-start mt-6'>
            <Button type='submit' className='bg-red-200 hover:bg-red-300 text-gray-700 px-8 py-2 rounded'>
              Xác Nhận
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default ResetPassword
