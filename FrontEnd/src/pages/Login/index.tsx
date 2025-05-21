import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAppDispatch } from '@/hooks'
import { loginAction } from '@/redux/slice/userSlice'
import { ArrowRight, Github, LockKeyhole, Mail } from 'lucide-react'
import React, { ChangeEvent, useState } from 'react'
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const dispatch = useAppDispatch()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // const res = await LoginApi(formData)
    // console.log(res)
    // toast.success(res.message)
    try {
      await dispatch(loginAction(formData))
      window.location.href = '/'
    } catch (error) {
      console.log(error)
    }
  }
  const handleOnchage = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 !p-4'>
      <div className='w-full max-w-md'>
        <div className='text-center !mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 !mb-2'>Welcome Back</h1>
          <p className='text-gray-600'>Sign in to your account to continue</p>
        </div>

        <Card className='bg-white shadow-lg border-none !p-4'>
          <CardHeader>
            <CardTitle className='text-xl text-center'>Sign In</CardTitle>
            <CardDescription className='text-center'>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className='!space-y-4'>
                <div className='!space-y-2'>
                  <Label htmlFor='email' className='flex items-center gap-2'>
                    <Mail className='w-4 h-4' />
                    Email
                  </Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='your.email@example.com'
                    value={formData.email}
                    name='email'
                    onChange={(e) => handleOnchage(e)}
                    className='focus:ring-2 focus:ring-transparent !p-2'
                    required
                  />
                </div>

                <div className='!space-y-2'>
                  <Label htmlFor='password' className='flex items-center gap-2'>
                    <LockKeyhole className='w-4 h-4' />
                    Password
                  </Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    name='password'
                    value={formData.password}
                    onChange={(e) => handleOnchage(e)}
                    className='focus:ring-2 focus:ring-transparent !p-2'
                    required
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center !space-x-2'>
                    <Checkbox
                      id='remember'
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor='remember' className='text-sm cursor-pointer'>
                      Remember me
                    </Label>
                  </div>
                  <Link to='#' className='text-sm font-medium text-blue-600 hover:text-blue-500'>
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type='submit'
                  className='w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2'
                >
                  Sign In
                  <ArrowRight className='w-4 h-4' />
                </Button>
              </div>
            </form>

            <div className='!mt-6'>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <Separator className='w-full  bg-black' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='!px-2 bg-white text-gray-500'>Or continue with</span>
                </div>
              </div>

              {/* <div className='!mt-6'>
                <Button
                  variant='outline'
                  className='w-full border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2'
                >
                  <Github className='w-4 h-4' />
                  GitHub
                </Button>
              </div> */}
            </div>
          </CardContent>
          <CardFooter className='flex justify-center'>
            <p className='text-sm text-gray-600'>
              Don't have an account?
              <Link to={'/register'} className='font-medium text-blue-600 hover:text-blue-500'>
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
