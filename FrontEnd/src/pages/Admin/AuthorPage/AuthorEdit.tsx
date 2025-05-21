import { createAuthorApi, updateAuthorApi } from '@/apis/author.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Author } from '@/types'
import { getBase64 } from '@/utils'
import { debounce } from 'lodash'
import { ChangeEvent, useEffect, useState } from 'react'
import FroalaEditor from 'react-froala-wysiwyg'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const config = {
  placeholderText: 'Edit Your Content Here!',
  charCounterCount: false
}
export default function AuthorEdit() {
  const location = useLocation()
  const [loaded, setLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    setTimeout(() => setLoaded(true), 500)
  }, [])
  const [author, setAuthor] = useState<Author>(
    location.state || {
      id: '',
      authorDescription: '',
      authorName: '',
      avatar: ''
    }
  )
  const [url, setUrl] = useState(location.state ? location.state.avatar : '')
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return // check nếu không có file thì không làm gì cả

    const url = URL.createObjectURL(file)
    setUrl(url)

    const base64 = await getBase64(file)
    setAuthor((prev) => ({ ...prev, avatar: base64?.toString() || '' })) // base64 đã là string rồi, không cần toString()
  }
  const handleChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setAuthor((prev) => ({ ...prev, [name]: value }))
  }, 300)

  const handleSubmit = async () => {
    if (!author.authorName) return
    try {
      setIsLoading(true)
      const res = location.state ? await updateAuthorApi(author) : await createAuthorApi(author)
      if (res.code === 0) {
        setAuthor({
          id: '',
          authorDescription: '',
          authorName: '',
          avatar: '',
          slug: ''
        })
        toast.success(location.state ? 'Cập nhật thành công!' : 'Tạo mới thành công!')
        setTimeout(() => {
          navigate('/admin/author') // nếu bạn muốn chuyển trang thì bật dòng này
        }, 500)
      } else {
        toast.error(location.state ? 'Cập nhật thất bại!' : 'Tạo mới thất bại!')
      }
    } catch (error) {
      console.error(error)
      toast.error('Đã xảy ra lỗi!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='w-full p-6 bg-white'>
      <div className='mb-4'>
        <Button variant='ghost' onClick={() => navigate('/admin/author')}>
          ← Quay lại danh sách
        </Button>
      </div>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Author Settings</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column */}
        <div className='lg:col-span-1'>
          <div className='mb-6'>
            <h2 className='text-sm font-medium text-gray-500 mb-2'>Ảnh</h2>
            <div className='grid grid-cols-2 gap-3'>
              <div className='mb-3'>
                <Button variant={'outline'}>
                  <Label htmlFor='avatar'>Chọn ảnh</Label>
                </Button>
                <input
                  type='file'
                  id='avatar'
                  name='avatar'
                  hidden
                  onChange={handleFileChange}
                  required
                  className='form-control'
                />
              </div>
            </div>
            {url && <img width={100} height={100} src={url} alt='' />}
          </div>

          <div>
            <h2 className='text-sm font-medium text-gray-500 mb-2'>Mô tả</h2>
            {loaded && (
              <FroalaEditor
                tag='textarea'
                config={config}
                model={author.authorDescription}
                onModelChange={(e: string) => setAuthor((prev) => ({ ...prev, authorDescription: e }))}
              />
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className='lg:col-span-2'>
          <div className='mb-6'>
            <h2 className='text-sm font-medium text-gray-500 mb-2'>Tên tác giả</h2>
            <Input
              type='text'
              name='authorName'
              onChange={handleChange}
              defaultValue={author.authorName}
              className='mb-4'
            />

            <div className='text-center'>
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
        </div>
      </div>
    </div>
  )
}
