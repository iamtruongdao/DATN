import { createPostApi, updatePostApi } from '@/apis/post.api'
import { getAllTagApi } from '@/apis/tag.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Post, Tag } from '@/types'
import { getBase64 } from '@/utils'
import MDEditor from '@uiw/react-md-editor'
import { debounce } from 'lodash'
import { marked } from 'marked'
import { ChangeEvent, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import TurndownService from 'turndown'
const turndownService = new TurndownService()
export default function PostEdit() {
  const location = useLocation()

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [tags, setTags] = useState<Tag[]>([])
  const [post, setPost] = useState<Post>(
    location.state || {
      content: '',
      id: '',
      slug: '',
      tag: [],
      tagId: '',
      title: '',
      thumbnail: ''
    }
  )
  const [markdown, setMarkdown] = useState('')
  const [url, setUrl] = useState(location.state ? location.state.thumbnail : '')
  const fetchTag = async () => {
    const res = await getAllTagApi({ pageSize: '10', pageIndex: '1' })
    if (res.code === 0) {
      setTags(res.data.items)
    } else {
      toast.error('Lấy danh sách tag thất bại!')
    }
  }
  useEffect(() => {
    fetchTag()
  }, [])

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return // check nếu không có file thì không làm gì cả

    const url = URL.createObjectURL(file)
    setUrl(url)

    const base64 = await getBase64(file)
    setPost((prev) => ({ ...prev, thumbnail: base64?.toString() || '' }))
  }
  const handleChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setPost((prev) => ({ ...prev, [name]: value }))
  }, 300)
  const handleMarkdownChange = async (e: string) => {
    setMarkdown(e)
    const value = marked.parse(e, { async: false })
    console.log(post.content)

    setPost((prev) => ({ ...prev, content: value }))
  }
  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      console.log(post)

      const res = location.state ? await updatePostApi(post) : await createPostApi(post)
      if (res.code === 0) {
        setPost({
          content: '',
          id: '',
          slug: '',
          tag: [],
          title: '',
          thumbnail: '',
          tagId: ''
        })
        toast.success(location.state ? 'Cập nhật thành công!' : 'Tạo mới thành công!')
        setTimeout(() => {
          navigate('/admin/post') // nếu bạn muốn chuyển trang thì bật dòng này
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
  useEffect(() => {
    if (location.state?.content) {
      const md = turndownService.turndown(location.state.content)
      setMarkdown(md)
    }
  }, [location.state])
  return (
    <div className='w-full p-6 bg-white'>
      <div className='mb-4'>
        <Button variant='ghost' onClick={() => navigate('/admin/post')}>
          ← Quay lại danh sách
        </Button>
      </div>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Post Settings</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column */}
        <div className='lg:col-span-1'>
          <div className='mb-6'>
            <h2 className='text-sm font-medium text-gray-500 mb-2'>Ảnh</h2>
            <div className='grid grid-cols-2 gap-3'>
              <div className='mb-3'>
                <Button variant={'outline'}>
                  <Label htmlFor='thumbnail'>Chọn ảnh</Label>
                </Button>
                <input
                  type='file'
                  id='thumbnail'
                  name='thumbnail'
                  hidden
                  onChange={handleFileChange}
                  required
                  className='form-control'
                />
              </div>
            </div>
            {url && <img width={100} height={100} src={url} alt='' />}
          </div>
        </div>

        {/* Right Column */}
        <div className='lg:col-span-2'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <div className='mb-6'>
              <h2 className='text-sm font-medium text-gray-500 mb-2'>Tiêu đề</h2>
              <Input type='text' name='title' onChange={handleChange} defaultValue={post.title} className='mb-4' />
            </div>
            <div className='mb-6'>
              <h2 className='text-sm font-medium text-gray-500 mb-2'>Chủ đề</h2>
              <Select
                value={post.tagId}
                onValueChange={(value) => {
                  const fakeEvent = {
                    target: {
                      name: 'tagId',
                      value
                    }
                  } as ChangeEvent<HTMLInputElement> // giả event để reuse handleChange
                  handleChange(fakeEvent)
                }}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Chọn Chủ đề' />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  {tags.length > 0 &&
                    tags.map((tag) => (
                      <SelectItem key={tag.id} className='hover:bg-amber-50 cursor-pointer' value={tag.id}>
                        {tag.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-1 gap-6'>
        <Label>Nội dung</Label>
        <div className='container'>
          <MDEditor className='h-[230px]' value={markdown} onChange={(value) => handleMarkdownChange(value || '')} />
          <MDEditor.Markdown source={post.content} style={{ whiteSpace: 'pre-wrap' }} />
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
