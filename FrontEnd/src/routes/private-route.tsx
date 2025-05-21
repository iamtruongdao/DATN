import AdminLogin from '@/pages/Admin/Login'
import LoginPage from '@/pages/Login'
import Register from '@/pages/Register'
import { RouteObject } from 'react-router-dom'

export const privateRoute: RouteObject[] = [
  { path: '/admin/login', element: <AdminLogin /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <Register /> }
]
