import { Book, CreditCard, Landmark, LucideIcon, SquareDashed, User } from 'lucide-react'

export interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavSubItem[]
}

export interface NavSubItem {
  title: string
  url: string
}

export const bookNavItems: NavItem[] = [
  {
    title: 'Thống kê',
    url: '/admin',
    icon: SquareDashed,
    isActive: true
  },
  {
    title: 'Quản lý sách',
    url: '/admin/book',
    icon: Book,
    isActive: true,
    items: [
      { title: 'Danh sách', url: '/admin/book' },
      { title: 'Edit', url: '/admin/book-edit' }
    ]
  },
  {
    title: 'Quản lý tác giả',
    url: '/admin/author',
    icon: User,
    isActive: true,
    items: [
      { title: 'Danh sách', url: '/admin/author' },
      { title: 'Edit', url: '/admin/author-edit' }
    ]
  },
  {
    title: 'Quản lý danh mục',
    url: '/admin/category',
    icon: User,
    isActive: true
  },
  {
    title: 'Quản lý đơn hàng',
    url: '/admin/order',
    icon: User,
    isActive: true
  },
  {
    title: 'Quản lý tài khoản',
    url: '/admin/user',
    icon: User,
    isActive: true
  },
  {
    title: 'Quản lý bài đăng',
    url: '/admin/post',
    icon: User,
    isActive: true,
    items: [
      { title: 'Danh sách', url: '/admin/post' },
      { title: 'Edit', url: '/admin/post-edit' }
    ]
  },
  {
    title: 'Quản lý chủ đề',
    url: '/admin/tag',
    icon: User,
    isActive: true,
    items: [
      { title: 'Danh sách', url: '/admin/tag' },
      { title: 'Edit', url: '/admin/tag-edit' }
    ]
  },
  {
    title: 'Quản lý voucher',
    url: '/admin/voucher',
    icon: User,
    isActive: true,
    items: [
      { title: 'Danh sách', url: '/admin/voucher' },
      { title: 'Edit', url: '/admin/voucher-edit' }
    ]
  }
]

export const transactionNavItems: NavItem[] = [
  {
    title: 'Quản lý giao dịch',
    url: '/dashboard/transaction',
    icon: CreditCard
  },

  {
    title: 'Nạp tiền',
    url: '/dashboard/deposit',
    icon: Landmark
  }
]
