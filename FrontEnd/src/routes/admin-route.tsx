import AdminLayout from '@/layouts/AdminLayout'
import AuthorPage from '@/pages/Admin/AuthorPage'
import AuthorEdit from '@/pages/Admin/AuthorPage/AuthorEdit'
import BookPage from '@/pages/Admin/BookPage'
import BookEdit from '@/pages/Admin/BookPage/BookEdit'
import CategoryPage from '@/pages/Admin/CategoryPage'
import Dashboard from '@/pages/Admin/Dashboard'
import OrderPage from '@/pages/Admin/OrderPage'
import OrderDetailAdmin from '@/pages/Admin/OrderPage/Detail'
import PostPage from '@/pages/Admin/PostPage'
import PostEdit from '@/pages/Admin/PostPage/PostEdit'
import TagPage from '@/pages/Admin/TagPage'
import TagEdit from '@/pages/Admin/TagPage/TagEdit'
import UserPage from '@/pages/Admin/UserPage'
import VoucherPage from '@/pages/Admin/VoucherPage'
import VoucherCreator from '@/pages/Admin/VoucherPage/VoucherEdit'
import { RouteObject } from 'react-router-dom'

export const adminRoutes: RouteObject = {
  path: '/admin',
  element: <AdminLayout />,
  children: [
    { index: true, element: <Dashboard /> },
    { path: 'book', element: <BookPage /> },
    { path: 'book-edit', element: <BookEdit /> },
    { path: 'author', element: <AuthorPage /> },
    { path: 'author-edit', element: <AuthorEdit /> },
    { path: 'category', element: <CategoryPage /> },
    { path: 'order', element: <OrderPage /> },
    { path: 'user', element: <UserPage /> },
    { path: 'post', element: <PostPage /> },
    { path: 'post-edit', element: <PostEdit /> },
    { path: 'tag-edit', element: <TagEdit /> },
    { path: 'tag', element: <TagPage /> },
    { path: 'order/:orderId', element: <OrderDetailAdmin /> },
    { path: 'voucher', element: <VoucherPage /> },
    { path: 'voucher-edit', element: <VoucherCreator /> }
  ]
}
