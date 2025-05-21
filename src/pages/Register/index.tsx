import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { RegisterApi } from '@/apis/auth.api'

interface FormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agreeTerms: checked
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!formData.fullName) newErrors.fullName = 'Full name is required'

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match"
    }

    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      const res = await RegisterApi(formData)
      console.log()
      if (res.message) {
        setOpen(true)
      }
      alert('Registration successful!')
      // Here you would typically send the data to your API
    }
  }

  return (
    <>
      {' '}
      <div className='flex items-center justify-center min-h-screen bg-gray-100 !p-4'>
        <Card className='w-full max-w-md gap-0   border-none  shadow-xl'>
          <CardHeader className='!space-y-1 text-center bg-[url] bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg'>
            <CardTitle className='text-2xl font-bold tracking-tight'>Create an account</CardTitle>
            <CardDescription className='text-gray-100 !mb-1'>Enter your information to get started</CardDescription>
          </CardHeader>
          <CardContent className='!pt-6 !px-4'>
            <form onSubmit={handleSubmit} className='!space-y-4'>
              <div className='!space-y-1'>
                <Label className='!pl-2' htmlFor='fullName'>
                  Full Name
                </Label>
                <div className='relative'>
                  <User className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                  <Input
                    id='fullName'
                    name='fullName'
                    placeholder='John Doe'
                    className='!pl-10 focus-visible:ring-transparent'
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.fullName && <p className='text-sm text-red-500'>{errors.fullName}</p>}
              </div>

              <div className='!space-y-1'>
                <Label className='!pl-2' htmlFor='email'>
                  Email
                </Label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                  <Input
                    id='email'
                    name='email'
                    type='text'
                    placeholder='your.email@example.com'
                    className='!pl-10 focus-visible:ring-transparent'
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.email && <p className='text-sm text-red-500'>{errors.email}</p>}
              </div>

              <div className='!space-y-1'>
                <Label className='!pl-2' htmlFor='password'>
                  Password
                </Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                  <Input
                    id='password'
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='********'
                    className='!pl-10 focus-visible:ring-transparent'
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full !px-3'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5 text-gray-400' />
                    ) : (
                      <Eye className='h-5 w-5 text-gray-400' />
                    )}
                  </Button>
                </div>
                <p className='text-sm !pl-2 text-gray-500'>Must be at least 8 characters</p>
                {errors.password && <p className='text-sm text-red-500'>{errors.password}</p>}
              </div>

              <div className='!space-y-1'>
                <Label className='!pl-2' htmlFor='confirmPassword'>
                  Confirm Password
                </Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-2.5 h-5 w-5 text-gray-400' />
                  <Input
                    id='confirmPassword'
                    name='confirmPassword'
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='********'
                    className='!pl-10 focus-visible:ring-transparent'
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    className='absolute right-0 top-0 h-full !px-3'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className='h-5 w-5 text-gray-400' />
                    ) : (
                      <Eye className='h-5 w-5 text-gray-400' />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && <p className='text-sm text-red-500'>{errors.confirmPassword}</p>}
              </div>

              <div className='flex items-start  rounded-md '>
                <Checkbox id='agreeTerms' checked={formData.agreeTerms} onCheckedChange={handleCheckboxChange} />
                <div className=' leading-none'>
                  <Label className='!pl-2' htmlFor='agreeTerms'>
                    I agree to the terms of service and privacy policy
                  </Label>
                </div>
              </div>
              {!formData.agreeTerms && <p className='text-sm text-red-500'>{errors.agreeTerms}</p>}
              <Button
                type='submit'
                className='w-full !mb-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              >
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className='flex flex-col !space-y-1 border-t !mb-2 !pt-4'>
            <div className='text-sm text-center text-gray-500'>
              Already have an account?
              <Link to='/login' className='text-blue-600 hover:underline'>
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogClose asChild></DialogClose>
        <DialogContent className='sm:max-w-md w-[200px] [&>button:last-child]:hidden  cursor-pointer border-none !p-4 bg-white'>
          <button className='hidden' data-state='close'></button>
          <div className='flex items-center !space-x-2'>
            <p className='text-center'>
              Đăng ký thành công vui lòng
              <Link className='text-emerald-600' to={'/login'}>
                Đăng nhập
              </Link>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Register
