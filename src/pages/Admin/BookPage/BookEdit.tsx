import { getAllAuthorApi } from '@/apis/author.api'
import { createBookApi, updateBookApi } from '@/apis/book.api'
import { getCategoryApi } from '@/apis/category.api'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Author, Book, Category } from '@/types'
import { getBase64 } from '@/utils'
import { debounce } from 'lodash'
import { ChangeEvent, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import FroalaEditor from 'react-froala-wysiwyg'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const config = {
  placeholderText: 'Edit Your Content Here!',
  charCounterCount: false
}
export default function BookEdit() {
  const [categories, setCategories] = useState<Category[]>([])
  const location = useLocation()
  const [authors, setAuthors] = useState<Author[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setTimeout(() => setLoaded(true), 300)
  }, [])
  const [book, setBook] = useState<Book>(
    location.state || {
      id: '',
      productName: '',
      productPrice: 0,
      discountPrice: 0,
      discount: 0,
      productQuantity: 0,
      productDescription: '',
      slug: '',
      pageNumber: 0,
      translator: '',
      publicDate: new Date(),
      avatar: '',
      authorName: '',
      author: '',
      cat: [],
      category: [],
      isPublic: true // hoặc false tùy default bạn muốn
    }
  )
  const [url, setUrl] = useState(location.state ? location.state.avatar : '')
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return // check nếu không có file thì không làm gì cả

    const url = URL.createObjectURL(file)
    setUrl(url)

    const base64 = await getBase64(file)
    setBook((prev) => ({ ...prev, avatar: base64?.toString() || '' })) // base64 đã là string rồi, không cần toString()
  }
  const handleChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target
    console.log(checked, name)
    if (name === 'cat') {
      setBook({
        ...book,
        cat: checked
          ? [...book.cat, value] // Thêm giá trị nếu checked
          : book.cat.filter((item) => item !== value)
      })
    } else {
      setBook((prev) => ({ ...prev, [name]: value }))
    }
  }, 300)
  const handleDateChange = (newDate: any) => {
    if (!newDate) return
    // Nếu chọn kiểu range: newDate sẽ có { from, to }
    // Nếu chỉ chọn 1 ngày (mode: 'single')
    else {
      setBook((prev) => ({
        ...prev,
        publicDate: new Date(newDate)
      }))
    }
  }
  const fetchCategory = async () => {
    const res = await getCategoryApi()
    if (res.code === 0) {
      setCategories(res.data)
    }
  }
  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const res = location.state ? await updateBookApi(book) : await createBookApi(book)
      if (res.code === 0) {
        setBook({
          id: '',
          productName: '',
          productPrice: 0,
          discountPrice: 0,
          discount: 0,
          productQuantity: 0,
          productDescription: '',
          slug: '',
          pageNumber: 0,
          translator: '',
          publicDate: new Date(),
          avatar: '',
          authorName: '',
          author: '',
          cat: [],
          category: [],
          isPublic: true // hoặc false tùy default bạn muốn
        })
        toast.success(location.state ? 'Cập nhật thành công!' : 'Tạo mới thành công!')
        setTimeout(() => {
          navigate('/admin/book') // nếu bạn muốn chuyển trang thì bật dòng này
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

  async function fetchAuthors() {
    try {
      const response = await getAllAuthorApi()
      if (response.code === 0) {
        setAuthors(response.data)
      }
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    fetchCategory()
    fetchAuthors()
  }, [])
  return (
    <div className='w-full p-6 bg-white'>
      <div className='mb-4'>
        <Button variant='ghost' onClick={() => navigate('/admin/book')}>
          ← Quay lại danh sách
        </Button>
      </div>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>Product Settings</h1>

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
                model={book.productDescription}
                onModelChange={(e: string) => setBook((prev) => ({ ...prev, productDescription: e }))}
              />
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className='lg:col-span-2'>
          <div className='mb-6'>
            <h2 className='text-sm font-medium text-gray-500 mb-2'>Product Name</h2>
            <Input
              type='text'
              name='productName'
              onChange={handleChange}
              defaultValue={book.productName}
              className='mb-4'
            />

            <div className='grid grid-cols-2 gap-3 mb-4'>
              <div className='space-y-2'>
                <Label className='text-base font-semibold'>Tác giả:</Label>
                <Select
                  value={book.author}
                  onValueChange={(value) => {
                    const fakeEvent = {
                      target: {
                        name: 'author',
                        value
                      }
                    } as ChangeEvent<HTMLInputElement> // giả event để reuse handleChange
                    handleChange(fakeEvent)
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Chọn tác giả' />
                  </SelectTrigger>
                  <SelectContent className='bg-white'>
                    {authors.length > 0 &&
                      authors.map((author) => (
                        <SelectItem key={author.id} className='hover:bg-amber-50 cursor-pointer' value={author.id}>
                          {author.authorName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label className='text-base font-semibold'>Danh mục:</Label>
                <div className='flex flex-wrap gap-4'>
                  {categories.length > 0 &&
                    categories.map((category) => (
                      <div key={category.id} className='flex items-center space-x-2'>
                        <Checkbox
                          id={`category-${category.id}`}
                          name='cat'
                          value={category.id}
                          checked={book.cat.includes(category.id)}
                          onCheckedChange={(checked) => {
                            const fakeEvent = {
                              target: {
                                name: 'cat',
                                value: category.id,
                                checked: checked
                              }
                            } as ChangeEvent<HTMLInputElement> // giả lập event vì shadcn trả về `boolean` chứ không phải e.target
                            handleChange(fakeEvent)
                          }}
                        />
                        <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-3 mb-4'>
              <div>
                <label className='text-xs text-gray-500 block mb-1'>Giá gốc</label>
                <Input type='text' onChange={handleChange} name='productPrice' defaultValue={book.productPrice} />
              </div>
              <div>
                <label className='text-xs text-gray-500 block mb-1'>Giảm giá</label>
                <Input type='text' onChange={handleChange} name='discount' defaultValue={book.discount} />
              </div>
            </div>

            <div className='mb-4'>
              <label className='text-xs text-gray-500 block mb-1'>Dịch giả</label>
              <Input type='text' name='translator' onChange={handleChange} defaultValue={book.translator} />
            </div>

            <div className='grid grid-cols-3 gap-3 mb-4'>
              {/* <div>
                <label className='text-xs text-gray-500 block mb-1'>Stock Status</label>
                <Select defaultValue='In Stock'>
                  <SelectTrigger>
                    <SelectValue placeholder='Select stock status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='In Stock'>In Stock</SelectItem>
                    <SelectItem value='Out of Stock'>Out of Stock</SelectItem>
                    <SelectItem value='Back Order'>Back Order</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              <div>
                <label className='text-xs text-gray-500 block mb-1'>Quantity in Stock</label>
                <Input type='text' name='productQuantity' onChange={handleChange} defaultValue={book.productQuantity} />
              </div>
              <div>
                <label className='text-xs text-gray-500 block mb-1'>Số trang</label>
                <Input type='text' name='pageNumber' onChange={handleChange} defaultValue={book.pageNumber} />
              </div>
              <div>
                <label className='text-xs text-gray-500 block mb-1'>Schedule</label>
                <DatePicker
                  className='outline-1 p-1 rounded-md'
                  selected={book.publicDate}
                  onChange={handleDateChange}
                />
              </div>
            </div>
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
