import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { Book } from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import { bookNavItems } from './nav-item'

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className='border-b'>
        <div className='flex items-center gap-2 px-4 py-3'>
          <Book className='h-6 w-6' />
          <span className='font-bold'>NhaNam</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarItem items={bookNavItems} />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
