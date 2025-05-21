import { useEffect, useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { getPostBySlugApi } from '@/apis/post.api'
import { Post } from '@/types'
import Breadscrumb from '@/components/Breadscrumb'
import { formatDateStringToVietnamese } from '@/utils'

export default function PostDetail() {
  const [showChat, setShowChat] = useState(false)
  const [post, setPost] = useState<Post>({
    content: '',
    id: '',
    slug: '',
    tagId: '',
    thumbnail: '',
    title: '',
    tag: []
  })
  const { slug } = useParams()
  const fetchPostBySlug = async () => {
    const res = await getPostBySlugApi(slug!)
    if (res.code === 0) {
      setPost(res.data)
    }
  }
  useEffect(() => {
    fetchPostBySlug()
  }, [slug])
  return (
    <div className='min-h-screen '>
      {/* Breadcrumb navigation */}
      <div className='text-sm p-4 text-gray-600  bg-green-50'>
        <div className='container !mx-auto '>
          <Breadscrumb
            breadcrumb={
              slug && post.tag.length > 0 ? { [slug]: post.title, [post.tag[0].slug]: post.tag[0]?.name } : {}
            }
          />
        </div>
      </div>

      {/* Article container */}
      <div className='max-w-4xl mx-auto p-6 bg-white  '>
        <h3 className='text-xl py-2'>{post.title}</h3>
        <div className=' py-2'>
          <span className='text-gray-400'>{formatDateStringToVietnamese(post.createdAt!)}</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </div>

      {/* Chat button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className='fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all'
      >
        <MessageSquare size={24} />
      </button>

      {showChat && (
        <div className='fixed bottom-24 right-6 bg-white shadow-xl rounded-lg p-4 w-72 border border-gray-200'>
          <div className='text-sm font-medium mb-2'>Chat với chúng tôi</div>
          <div className='text-xs text-gray-600'>Đội ngũ hỗ trợ sẽ phản hồi sớm nhất có thể.</div>
        </div>
      )}
    </div>
  )
}
