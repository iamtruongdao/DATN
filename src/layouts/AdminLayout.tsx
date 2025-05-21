import { AppbarUser } from '@/components/Admin/AppbarUser'
import { AppSidebar } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useAppSelector } from '@/hooks'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  const {
    userInfo: { fullName, email }
  } = useAppSelector((state) => state.user)
  return (
    <SidebarProvider>
      <div className='flex min-h-screen w-full'>
        <AppSidebar />
        <SidebarInset className='w-full !bg-white'>
          <div className='sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <header className='flex h-16 shrink-0 items-center transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
              <div className='flex w-full items-center justify-between px-4'>
                <div className='flex items-center gap-2'>
                  <SidebarTrigger className='-ml-1' />
                  <Separator orientation='vertical' className='mr-2 h-4' />
                  {/* <BreadcrumbNav /> */}
                </div>
                <AppbarUser user={{ name: fullName, email: email, avatar: '/avatars/admin.jpg' }} />
              </div>
            </header>
          </div>
          <main className='flex-1'>
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default AdminLayout
