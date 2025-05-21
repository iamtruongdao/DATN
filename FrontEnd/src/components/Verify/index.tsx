import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog'
import { Check, Loader2, Mail, Shield } from 'lucide-react'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { sendOtpApi, verifyOtpApi } from '@/apis/auth.api'
import { useAppSelector } from '@/hooks'
import { toast } from 'react-toastify'

const VerificationDialog: React.FC = () => {
  const {
    userInfo: { email }
  } = useAppSelector((state) => state.user)
  const [open, setOpen] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)

  useEffect(() => {
    setOpen(true) // Open the dialog when the component mounts
  }, [])

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const handleSendOtp = async () => {
    setLoading(true)

    try {
      // Simulate API call with timeout
      const res = await sendOtpApi({ email })

      if (res.code === 0) {
        setOtpSent(true)
        setCountdown(60)
      }
      // Here you would implement the actual OTP sending logic
      // Start 60 second countdown
    } catch (error) {
      console.error('Error sending OTP:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) return

    setVerifyLoading(true)

    try {
      // Simulate API call with timeout
      const res = await verifyOtpApi({ email, otp })
      await new Promise((resolve) => setTimeout(resolve, 1500))
      if (res.code === 0) {
        toast.success('Xác minh thành công!')
        setTimeout(() => {
          setOpen(false)
        }, 300)
      }
      // Here you would implement OTP verification logic
      console.log('Verifying OTP:', otp)
      // If verification successful, you might want to close the dialog or redirect
    } catch (error) {
      console.error('Error verifying OTP:', error)
    } finally {
      setVerifyLoading(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogOverlay className='bg-black/50 backdrop-blur-sm fixed inset-0 transition-opacity' />
      <DialogContent className='p-0 [&>button:last-child]:hidden bg-white border-0 shadow-xl max-w-md rounded-xl overflow-hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:w-full'>
        <div className='flex flex-col items-center pt-10 pb-6 relative'>
          <div className='relative mb-6'>
            <div className='absolute inset-0 bg-orange-500 opacity-20 rounded-full blur-md transform scale-110'></div>
            <div className='relative bg-gradient-to-br from-orange-500 to-red-600 text-white p-4 rounded-full shadow-lg'>
              <div className='relative'>
                <Shield className='h-10 w-10' strokeWidth={1.5} />
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1'>
                  <Check className='h-5 w-5 text-orange-600' strokeWidth={3} />
                </div>
              </div>
            </div>
          </div>

          <CardContent className='text-center px-8 pb-8 space-y-6 w-full'>
            <div>
              <h2 className='text-xl font-bold mb-2 text-gray-800'>Xác minh tài khoản</h2>
              <p className='text-gray-600'>Để tăng cường bảo mật cho tài khoản của bạn, hãy xác minh bằng mã OTP.</p>
            </div>

            {otpSent && (
              <div className='space-y-2'>
                <div className='text-left'>
                  <label htmlFor='otp' className='text-sm font-medium text-gray-700'>
                    Nhập mã OTP
                  </label>
                  <Input
                    id='otp'
                    type='text'
                    placeholder='Nhập mã OTP từ email của bạn'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className='mt-1'
                  />
                </div>

                <Button
                  onClick={handleVerifyOtp}
                  disabled={verifyLoading || !otp}
                  className='w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg h-10 flex items-center justify-center gap-2'
                >
                  {verifyLoading ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      <span>Đang xác minh...</span>
                    </>
                  ) : (
                    <span>Xác nhận mã OTP</span>
                  )}
                </Button>
              </div>
            )}

            <Button
              variant='outline'
              disabled={countdown > 0 || loading}
              onClick={handleSendOtp}
              className={`w-full h-14 border-2 ${
                countdown > 0 || loading
                  ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                  : 'border-gray-200 hover:border-orange-500 hover:bg-orange-50 cursor-pointer'
              } rounded-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-sm hover:shadow`}
            >
              {loading ? (
                <>
                  <Loader2 className='h-5 w-5 text-gray-400 animate-spin' />
                  <span className='font-medium'>Đang gửi mã OTP...</span>
                </>
              ) : (
                <>
                  <div className={`${countdown > 0 ? 'bg-gray-200' : 'bg-orange-100'} p-2 rounded-full`}>
                    <Mail className={`h-5 w-5 ${countdown > 0 ? 'text-gray-400' : 'text-orange-600'}`} />
                  </div>
                  <span className='font-medium'>
                    {countdown > 0
                      ? `Gửi lại sau (${countdown}s)`
                      : otpSent
                        ? 'Gửi lại mã OTP'
                        : 'Gửi mã OTP vào email'}
                  </span>
                </>
              )}
            </Button>

            <p className='text-xs text-gray-500 pt-2'>
              {otpSent && countdown > 0
                ? 'Mã OTP đã được gửi. Vui lòng kiểm tra hộp thư của bạn.'
                : 'Chúng tôi sẽ gửi một mã OTP đến địa chỉ email đã đăng ký của bạn'}
            </p>
          </CardContent>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default VerificationDialog
