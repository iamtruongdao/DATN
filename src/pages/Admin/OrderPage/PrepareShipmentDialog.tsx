import { CreateOrderShip, getShop } from '@/apis/ghn.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Order, Shop } from '@/types'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import OrderPickupDialog from './OrderPickupDialog'
dayjs.extend(utc)
dayjs.extend(timezone)

interface PrepareShipmentDialogProps {
  open: boolean
  onConfirm: () => Promise<void>
  onOpenChange: (open: boolean) => void
  order: Order | null
}

export default function PrepareShipmentDialog({ open, onOpenChange, onConfirm, order }: PrepareShipmentDialogProps) {
  const [date, setDate] = useState(new Date())
  const [shop, setShop] = useState<Shop>({ _id: 0, address: '', name: '', phone: '' })
  const [showOrderPickUp, setShowOrderPickUp] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')

  const [note, setNote] = useState('')
  const [courier, setCourier] = useState('SPX Express')
  const getShopInfo = async () => {
    const res = await getShop()
    if (res.code === 200) {
      setShop(res.data.shops[2])
    }
  }
  useEffect(() => {
    if (open) {
      getShopInfo()
    }
  }, [open])
  const handleConfirm = async () => {
    // Handle confirmation logic
    onOpenChange(false)

    setShowOrderPickUp(true)
    if (order) {
      const res = await CreateOrderShip({
        address: order.orderAddress,
        total: order.orderCheckout,
        orderCode: order.orderCode,
        time: Math.floor(date.getTime() / 1000),
        isPaymentOnline: order.orderPayment === 'COD' ? false : true
      })
      if (res.code === 200) {
        setTrackingNumber(res.data.order_code)
      }
    }
    await onConfirm()
  }

  const handleDateChange = (newDate: Date) => {
    if (!newDate) return
    // Nếu chọn kiểu range: newDate sẽ có { from, to }
    // Nếu chỉ chọn 1 ngày (mode: 'single')

    setDate(newDate)
  }
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-xl font-medium'>Chuẩn bị hàng</DialogTitle>
          </DialogHeader>

          <div className='space-y-4 py-2'>
            <div className='space-y-2'>
              <Label>Vận chuyển</Label>
              <Select value={courier} onValueChange={setCourier}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Chọn đơn vị vận chuyển' />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  <SelectItem value='SPX Express'>SPX Express</SelectItem>
                  <SelectItem value='J&T Express'>J&T Express</SelectItem>
                  <SelectItem value='Giao Hàng Nhanh'>Giao Hàng Nhanh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label>Ngày lấy hàng</Label>
              <div className='flex items-start space-x-2'>
                <div className='w-full'>
                  <DatePicker className='outline-1 p-1 rounded-md' selected={date} onChange={handleDateChange} />
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <Label>Lưu ý</Label>
              <Input placeholder='Nhập vào' value={note} onChange={(e) => setNote(e.target.value)} />
            </div>

            <div className='space-y-2'>
              <Label>Địa chỉ lấy hàng</Label>
              <Card className='border border-gray-200'>
                <CardContent className='pt-4'>
                  <div className='flex justify-between'>
                    <span className='font-medium'>{shop.name}</span>
                    <p className='font-medium'>{shop.phone}</p>
                  </div>
                  <div className='text-sm text-gray-600 mt-1'>
                    <p>{shop.address}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <DialogFooter className='flex justify-end space-x-2'>
            <DialogClose asChild>
              <Button variant='outline'>Hủy</Button>
            </DialogClose>
            <Button onClick={handleConfirm} className='bg-red-500 hover:bg-red-600 text-white'>
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <OrderPickupDialog
        open={showOrderPickUp}
        shop={shop}
        trackingNumber={trackingNumber}
        onOpenChange={setShowOrderPickUp}
      />
    </>
  )
}
