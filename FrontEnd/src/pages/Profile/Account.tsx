import { updateInfoApi } from '@/apis/user.api'
import { AvatarFallback, Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAppSelector } from '@/hooks'

import { User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
interface ProfileData {
  fullName: string
  email: string
  phoneNumber: string
  address: string
}
const Account = () => {
  const {
    userInfo: { fullName, email, phoneNumber, address }
  } = useAppSelector((state) => state.user)
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: '',
    email: 'tr**********@gmail.com',
    phoneNumber: '',
    address: ''
  })

  useEffect(() => {
    setProfileData({
      fullName: fullName || '',
      email: email || 'tr**********@gmail.com',
      phoneNumber: phoneNumber || '',
      address: address || ''
    })
  }, [fullName, email, phoneNumber])
  console.log(fullName)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await updateInfoApi(profileData)
    if (res.code === 0) {
      toast.success('Cập nhật thông tin thành công')
      // dispatch(getUserAction())
      window.location.reload()
    }
    // Handle form submission
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className='bg-white p-6 rounded shadow'>
      <h1 className='text-xl font-medium mb-1'>Hồ Sơ Của Tôi</h1>
      <p className='text-gray-500 text-sm mb-6'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>

      <div className='border-t border-gray-200 pt-6'>
        <form onSubmit={handleSubmit} className='grid grid-cols-3 gap-6'>
          <div className='col-span-2'>
            <div className='space-y-6'>
              <div className='flex items-center'>
                <Label className='w-32 text-gray-600'>Tên</Label>
                <div className='flex-1'>
                  <Input
                    className='focus-visible:ring-transparent'
                    name='fullName'
                    value={profileData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className='flex items-center'>
                <Label className='w-32 text-gray-600'>Email</Label>
                <div className='flex-1'>
                  <div className='flex items-center'>
                    <Input value={profileData.email} readOnly className='bg-gray-100 focus-visible:ring-transparent' />
                    <Button variant='link' className='ml-2 text-blue-500'>
                      Thay Đổi
                    </Button>
                  </div>
                </div>
              </div>

              <div className='flex items-center'>
                <Label className='w-32 text-gray-600'>Số điện thoại</Label>
                <div className='flex-1'>
                  <div className='flex items-center'>
                    <Input
                      className='focus-visible:ring-transparent'
                      name='phoneNumber'
                      value={profileData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder=''
                    />
                    <Button variant='link' className='ml-2 text-blue-500'>
                      Thêm
                    </Button>
                  </div>
                </div>
              </div>
              <div className='flex items-center'>
                <Label className='w-32 text-gray-600'>Địa chỉ</Label>
                <div className='flex-1'>
                  <div className='flex items-center'>
                    <Input
                      className='focus-visible:ring-transparent'
                      name='address'
                      value={profileData.address}
                      onChange={handleInputChange}
                      placeholder=''
                    />
                    <Button variant='link' className='ml-2 text-blue-500'>
                      Thêm
                    </Button>
                  </div>
                </div>
              </div>
              <div className='flex pt-4'>
                <div className='w-32'></div>
                <div className='flex-1'>
                  <Button type='submit' className='bg-orange-500 hover:bg-orange-600 cursor-pointer text-white'>
                    Lưu
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className='col-span-1 flex flex-col items-center justify-start'>
            <Avatar className='w-24 h-24'>
              <AvatarFallback className='bg-gray-200'>
                <User size={40} className='text-gray-400' />
              </AvatarFallback>
            </Avatar>

            <Button variant='outline' className='mt-4'>
              Chọn Ảnh
            </Button>

            <div className='text-xs text-gray-500 text-center mt-4'>
              <p>Dụng lượng file tối đa 1 MB</p>
              <p>Định dạng: JPEG, PNG</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Account
