import { RefreshToken } from '@/apis/auth.api'
import { getNotificationsApi, markAsReadApi } from '@/apis/notify.api'
import { useAppSelector } from '@/hooks'
import { NotificationType } from '@/types'
import * as signalR from '@microsoft/signalr'
import Cookies from 'js-cookie'
import { Bell, X } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'

const ShopeeNotification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasNewNotification, setHasNewNotification] = useState(false)
  const [notifications, setNotification] = useState<NotificationType[]>([])
  const connectionRef = useRef<signalR.HubConnection | null>(null)

  // Danh sách thông báo

  // Hiệu ứng bounce cho biểu tượng thông báo khi có thông báo mới
  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await getNotificationsApi()
      if (res.code === 0) {
        setNotification(res.data)
      }
    }
    fetchNotifications()
  }, [])
  useEffect(() => {
    const buildConnection = () =>
      new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7091/notification', {
          accessTokenFactory: () => Cookies.get('act')!
        })
        .configureLogging(signalR.LogLevel.Information)
        .withAutomaticReconnect()
        .build()

    const registerHandlers = (conn: signalR.HubConnection) => {
      conn.on('Send', (message: NotificationType) => {
        setHasNewNotification(true)
        setNotification((prev) => [message, ...prev])
      })

      conn.onreconnecting((err) => {
        console.log('dang kết nối lại...')

        if (err?.message?.includes('410')) {
          console.log('Token hết hạn → tạo lại kết nối')
          conn.stop().then(() => {
            console.log('Đã dừng kết nối')
            RefreshToken().then(async () => {
              await startConnection() // sẽ dùng ref nên luôn đúng bản
            })
          })
        }
      })
      conn.onclose((err) => {
        console.log('Kết nối đã đóng:', err)
        if (err?.message?.includes('410')) {
          console.log('Lỗi 410 khi đóng → làm mới token và thử lại')
          RefreshToken().then(() => {
            startConnection()
          })
        }
      })
    }

    const startConnection = async () => {
      const conn = buildConnection()
      connectionRef.current = conn
      registerHandlers(conn)

      try {
        await conn.start()
        console.log('Đã kết nối SignalR')
      } catch (err: any) {
        console.log('Không thể kết nối:', err)
        if (err.message.includes('410')) {
          console.log('Lỗi 410 khi start → thử lại sau 1 giây')
          setTimeout(startConnection, 1000)
        }
      }
    }

    startConnection()

    return () => {
      connectionRef.current?.stop()
    }
  }, [])

  const toggleNotification = async () => {
    setIsOpen(!isOpen)
    if (hasNewNotification) {
      setHasNewNotification(false)
    }
    const unreadNotifications = notifications
      .filter((notification) => !notification.isRead)
      .map((notification) => notification.id)
    if (unreadNotifications.length > 0) {
      const res = await markAsReadApi(unreadNotifications)
      if (res.code === 0) {
        setNotification((prev) =>
          prev.map((notification) => {
            if (unreadNotifications.includes(notification.id)) {
              return { ...notification, isRead: true }
            }
            return notification
          })
        )
      } else {
        console.error('Error marking notifications as read:', res.message)
      }
    }
  }

  // Render Avatar

  return (
    <div className='relative'>
      {/* Notification Bell Button */}
      <button onClick={toggleNotification} className='flex items-center gap-1 '>
        <div className='relative'>
          <Bell id='notification-bell' className='h-5 w-5 text-black' />
          {hasNewNotification && <span className='absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full'></span>}
        </div>
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-96 bg-white rounded shadow-lg z-50 border border-gray-200 max-h-[70vh] overflow-y-auto'>
          <div className='p-2 border-b border-gray-200 flex justify-between items-center bg-gray-50'>
            <h3 className='font-medium text-gray-700'>Thông Báo Mới Nhận</h3>
            <button onClick={() => setIsOpen(false)} className='text-gray-500 hover:text-gray-700'>
              <X size={16} />
            </button>
          </div>

          <div className='divide-y divide-gray-100'>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50/40' : ''}`}
              >
                <div className='flex gap-3'>
                  <div className='flex-1'>
                    {/* <div className='font-medium text-sm mb-1'>{notification.title}</div> */}
                    <div>{notification.content}</div>

                    {/* Images */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='p-2 text-center border-t border-gray-200'>
            <button className='text-sm text-blue-600 hover:underline'>Xem tất cả</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShopeeNotification
