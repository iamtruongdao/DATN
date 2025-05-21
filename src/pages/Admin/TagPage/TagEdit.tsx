import { createTagApi, updateTagApi } from '@/apis/tag.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tag } from '@/types'
import { debounce } from 'lodash'
import { ChangeEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function TagEdit() {
  const location = useLocation()

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [tag, setTag] = useState<Tag>(
    location.state || {
      id: '',
      name: '',
      posts: [],
      slug: '',
      createdAt: ''
    }
  )

  const handleChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setTag((prev) => ({ ...prev, [name]: value }))
  }, 300)

  const handleSubmit = async () => {
    try {
      setIsLoading(true)

      const res = location.state ? await updateTagApi(tag) : await createTagApi(tag)
      if (res.code === 0) {
        setTag({
          id: '',
          name: '',
          posts: [],
          slug: '',
          createdAt: ''
        })
        toast.success(location.state ? 'Cập nhật thành công!' : 'Tạo mới thành công!')
        setTimeout(() => {
          navigate('/admin/tag') // nếu bạn muốn chuyển trang thì bật dòng này
        }, 500)
      } else {
        toast.error(location.state ? 'Cập nhật thất bại!' : 'Tạo mới thất bại!')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full p-6 bg-white'>
      <div className='mb-4'>
        <Button variant='ghost' onClick={() => navigate('/admin/tag')}>
          ← Quay lại danh sách
        </Button>
      </div>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Tag Settings</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column */}

        {/* Right Column */}
        <div className='lg:col-span-2'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <div className='mb-6'>
              <h2 className='text-sm font-medium text-gray-500 mb-2'>Tên chủ đề</h2>
              <Input type='text' name='name' onChange={handleChange} defaultValue={tag.name} className='mb-4' />
            </div>
          </div>
        </div>
      </div>

      <div className='text-center mt-3'>
        <Button variant='outline' onClick={handleSubmit} type='button' disabled={isLoading}>
          {isLoading ? (
            <div className='flex items-center justify-center gap-2'>
              <div className='w-4 h-4 border-2 border-t-2 border-gray-200 border-t-primary rounded-full animate-spin' />
              Đang xử lý...
            </div>
          ) : location.state ? (
            'Sửa'
          ) : (
            'Thêm mới'
          )}
        </Button>
      </div>
    </div>
  )
}
