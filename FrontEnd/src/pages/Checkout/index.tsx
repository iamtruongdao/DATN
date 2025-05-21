import { getDiscountAmount } from '@/apis/discount.api'
import { getDistrict, getFeeShip, getProvince, getWard, leadtimeShip } from '@/apis/ghn.api'
import { checkOutApi, createOrderApi, createPaymentApi } from '@/apis/order.api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAppSelector } from '@/hooks'
import { CartProduct, District, OrderCheckout, OrderProduct, Province, Ward } from '@/types'
import { formatMoney } from '@/utils'
import { PAYMENT } from '@/utils/constant'
import { formatDate } from 'date-fns'
import { debounce } from 'lodash'
import { ChevronLeft, CreditCard } from 'lucide-react'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
// Interface definitions for location data

// Payment method type
type PaymentMethod = 'cod' | 'vnpay'

export default function CheckoutPage() {
  // Form state
  const { cartCountProduct, cartProducts, id, userId } = useAppSelector((state) => state.cart)
  const [formData, setFormdata] = useState<{
    email: string
    name: string
    phoneNumber: string
    address: string
    notes: string
  }>({
    address: '',
    email: '',
    name: '',
    phoneNumber: '',
    notes: ''
  })
  const [deleveryDate, setDeleveryDate] = useState<string | null>(null)
  const [orderCheckout, setOrderCheckout] = useState<OrderCheckout>({
    totalPrice: 0,
    totalApplyDiscount: 0,
    feeShip: 0,
    voucherDiscount: 0
  })

  const [orderItems, setOrderItems] = useState<OrderProduct[]>([])
  const [provinceId, setProvinceId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const [wardCode, setWardCode] = useState('')
  const [discountCode, setDiscountCode] = useState('')
  const [shippingFee, setShippingFee] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  // Location data state
  const [provinces, setProvinces] = useState<Province[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false)
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false)
  const [isLoadingWards, setIsLoadingWards] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const buildData = (data: CartProduct[]) => {
    return data.map((item) => {
      return {
        productId: item.productId,
        price: item.productDetails.productPrice - item.productDetails.discount,
        discount: item.productDetails.discount,
        quantity: item.quantity
      }
    })
  }
  const provinceNameMap = useMemo(() => {
    const map: Record<string, string> = {}
    provinces.forEach((p) => {
      map[p.ProvinceID.toString()] = p.ProvinceName
    })
    return map
  }, [provinces])

  const handleChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormdata((prev) => ({
      ...prev,
      [name]: value
    }))
  }, 300)
  const validateForm = () => {
    const errors: Record<string, string> = {}

    // ✅ Email - bắt buộc, phải đúng định dạng
    if (!formData.email) {
      errors.email = 'Vui lòng nhập email'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ'
    }

    // ✅ Họ tên - bắt buộc
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Họ và tên là bắt buộc'
    }

    // ❌ SĐT - không bắt buộc, nhưng nếu có thì phải đúng
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Vui lòng nhập số điện thoại'
    } else if (!/^(0|\+84)[0-9]{9,10}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Số điện thoại không hợp lệ'
    }

    // ✅ Tỉnh thành - bắt buộc
    if (!provinceId) {
      errors.province = 'Vui lòng chọn tỉnh thành'
    }
    if (!formData.address || formData.address.trim() === '') {
      errors.address = 'Vui lòng điền địa chỉ'
    }
    // 📝 Địa chỉ và ghi chú: không kiểm tra vì là tùy chọn
    if (provinceId && !districtId) {
      errors.district = 'Vui lòng chọn quận huyện'
    }
    if (provinceId && !wardCode && districtId) {
      errors.ward = 'Vui lòng chọn phường xã'
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }
  // Cart items

  const fetchCartData = async () => {
    const data = buildData(cartProducts)
    const res = await checkOutApi({ cartId: id, userId: userId, items: data, vouchers: [] })
    if (res.code === 0) {
      setOrderCheckout(res.data.checkout)
      setOrderItems(res.data.items)
    }
  }
  const handleGetVoucher = async () => {
    const res = await getDiscountAmount({
      codeId: discountCode,
      userId: userId,
      items: buildData(cartProducts)
    })
    if (res.code === 0) {
      console.log(res.data)

      setOrderCheckout((prev) => ({ ...prev, voucherDiscount: res.data.amount }))
    }
  }
  useEffect(() => {
    fetchCartData()
  }, [cartProducts])
  // Calculate totals

  // Fetch provinces on component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true)
      try {
        const res = await getProvince()
        setProvinces(res.data)
      } catch (error) {
        console.error('Error fetching GHN provinces:', error)
      } finally {
        setIsLoadingProvinces(false)
      }
    }

    fetchProvinces()
  }, [])

  // Fetch districts when province changes
  useEffect(() => {
    if (!provinceId) {
      setDistricts([])
      setDistrictId('')
      return
    }

    const fetchDistricts = async () => {
      setIsLoadingDistricts(true)
      try {
        const res = await getDistrict(+provinceId)
        setDistricts(res.data)
      } catch (error) {
        console.error('Error fetching GHN districts:', error)
      } finally {
        setIsLoadingDistricts(false)
      }
    }

    fetchDistricts()
  }, [provinceId])

  // Fetch wards when district changes
  useEffect(() => {
    if (!districtId) {
      setWards([])
      setWardCode('')
      return
    }

    const fetchWards = async () => {
      setIsLoadingWards(true)
      try {
        const res = await getWard(districtId)
        setWards(res.data)
      } catch (error) {
        console.error('Error fetching GHN wards:', error)
      } finally {
        setIsLoadingWards(false)
      }
    }

    fetchWards()
  }, [districtId])
  // Handle province change
  const handleProvinceChange = (value: string) => {
    console.log(value)

    setProvinceId(value)

    setDistrictId('')
    setWardCode('')
  }

  // Handle district change
  const handleDistrictChange = (value: string) => {
    setDistrictId(value)
    setWardCode('')
  }
  const handleWardOnchange = async (value: string) => {
    setWardCode(value)
    const res = await getFeeShip({
      service_type_id: 2,
      from_district_id: 3255,
      from_ward_code: '1B2808',
      to_district_id: +districtId,
      to_ward_code: value,
      length: 30,
      width: 40,
      height: 20,
      weight: 30,
      insurance_value: 0,
      coupon: null
    })
    if (res.code === 200) {
      setShippingFee(res.data.total)
    }
    const response = await leadtimeShip({
      service_id: 53320,
      from_district_id: 3255,
      from_ward_code: '1B2808',
      to_district_id: +districtId,
      to_ward_code: value
    })
    if (response.code === 200) {
      setDeleveryDate(formatDate(new Date(response.data.leadtime * 1000), 'dd/MM'))
    }
  }
  // Handle payment method change
  const handlePaymentMethodChange = (value: PaymentMethod) => {
    setPaymentMethod(value)
  }

  // Handle place order
  const handlePlaceOrder = async () => {
    const { isValid, errors } = validateForm()
    if (!isValid) {
      setErrors(errors)
      toast.error('Vui lòng kiểm tra lại thông tin!')
      return
    }
    // Implement order placement logic
    if (paymentMethod === 'vnpay') {
      const res = await createOrderApi({
        address: {
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          fullName: formData.name,
          street: wardCode,
          district: districtId,
          city: provinceNameMap[provinceId]
        },
        orderPayment: PAYMENT.VNPAY,
        feeShip: shippingFee,
        checkout: {
          vouchers: discountCode ? [discountCode] : [],
          cartId: id,
          userId: userId,
          items: buildData(cartProducts)
        }
      })
      if (res.code === 0) {
        const response = await createPaymentApi({
          amount: orderCheckout.totalApplyDiscount + shippingFee - orderCheckout.voucherDiscount,
          orderId: res.data.id,
          description: 'Thanh toan don hang',
          createdDate: new Date().toISOString()
        })
        if (response.code === 0) {
          console.log(response.data)
          window.location.href = response.data.url
        }
      } else {
        toast.error('Đặt hàng thất bại!')
      }
    } else {
      // Handle COD order
      const res = await createOrderApi({
        address: {
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          fullName: formData.name,
          street: wardCode,
          district: districtId,
          city: provinceNameMap[provinceId]
        },
        orderPayment: PAYMENT.COD,
        feeShip: shippingFee,
        checkout: {
          vouchers: discountCode ? [discountCode] : [],
          cartId: id,
          userId: userId,
          items: buildData(cartProducts)
        }
      })
      if (res.code === 0) {
        toast.success('Đặt hàng thành công!')
        setTimeout(() => {
          window.location.href = `order/${res.data.id}`
        }, 1000)
      }
    }
  }

  return (
    <div className='max-w-7xl mx-auto p-4'>
      <div className='flex flex-wrap'>
        {/* Customer Information - Left Section */}
        <div className='w-full lg:w-1/3 p-4'>
          <h2 className='text-xl font-semibold mb-4'>Thông tin nhận hàng</h2>
          <div className='space-y-4'>
            {/* Email */}
            <div>
              <Input
                placeholder='Email'
                name='email'
                defaultValue={formData.email}
                onChange={handleChange}
                className='focus-visible:ring-transparent'
              />
              {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email}</p>}
            </div>

            {/* Họ và tên */}
            <div>
              <Input
                placeholder='Họ và tên'
                name='name'
                defaultValue={formData.name}
                onChange={handleChange}
                className='focus-visible:ring-transparent'
              />
              {errors.name && <p className='text-sm text-red-500 mt-1'>{errors.name}</p>}
            </div>

            {/* Số điện thoại */}
            <div className='flex flex-col'>
              <Input
                placeholder='Số điện thoại '
                name='phoneNumber'
                defaultValue={formData.phoneNumber}
                onChange={handleChange}
                className='focus-visible:ring-transparent'
              />
              {errors.phoneNumber && <p className='text-sm text-red-500 mt-1'>{errors.phoneNumber}</p>}
            </div>

            {/* Địa chỉ */}
            <div>
              <Input
                placeholder='Địa chỉ (bắt buộc)'
                defaultValue={formData.address}
                name='address'
                onChange={handleChange}
                className='focus-visible:ring-transparent'
              />
              {errors.address && <p className='text-sm text-red-500 mt-1'>{errors.address}</p>}
            </div>

            {/* Province Select */}
            <div>
              <Select value={provinceId} onValueChange={handleProvinceChange}>
                <SelectTrigger
                  className={`w-full focus-visible:ring-transparent ${isLoadingProvinces ? 'opacity-70' : ''}`}
                >
                  <SelectValue placeholder='Tỉnh thành' />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  {provinces.map((province) => (
                    <SelectItem
                      key={province.ProvinceID}
                      className='hover:bg-gray-100 cursor-pointer'
                      value={province.ProvinceID.toString()}
                    >
                      {province.ProvinceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.province && <p className='text-sm text-red-500 mt-1'>{errors.province}</p>}
            </div>

            {/* District Select */}
            <div>
              <Select
                value={districtId}
                onValueChange={handleDistrictChange}
                disabled={!provinceId || isLoadingDistricts}
              >
                <SelectTrigger
                  className={`w-full focus-visible:ring-transparent ${isLoadingDistricts ? 'opacity-70' : ''}`}
                >
                  <SelectValue placeholder='Quận huyện (tùy chọn)' />
                </SelectTrigger>
                <SelectContent className='bg-white w-full'>
                  {districts.map((district) => (
                    <SelectItem
                      className='hover:bg-gray-100 cursor-pointer'
                      key={district.DistrictID}
                      value={district.DistrictID.toString()}
                    >
                      {district.DistrictName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district && <p className='text-sm text-red-500 mt-1'>{errors.district}</p>}
            </div>

            {/* Ward Select */}
            <div>
              <Select value={wardCode} onValueChange={handleWardOnchange} disabled={!districtId || isLoadingWards}>
                <SelectTrigger
                  className={`w-full focus-visible:ring-transparent ${isLoadingWards ? 'opacity-70' : ''}`}
                >
                  <SelectValue placeholder='Phường xã (tùy chọn)' />
                </SelectTrigger>
                <SelectContent className='bg-white'>
                  {wards.map((ward) => (
                    <SelectItem className='hover:bg-gray-100 cursor-pointer' key={ward.WardCode} value={ward.WardCode}>
                      {ward.WardName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ward && <p className='text-sm text-red-500 mt-1'>{errors.ward}</p>}
            </div>

            {/* Notes */}
            <div>
              <Input
                placeholder='Ghi chú (tùy chọn)'
                defaultValue={formData.notes}
                name='notes'
                onChange={handleChange}
                className='focus-visible:ring-transparent'
              />
            </div>
          </div>
        </div>

        {/* Shipping and Payment - Center Section */}
        <div className='w-full lg:w-1/3 p-4'>
          <div className='mb-8'>
            <h2 className='text-xl font-semibold mb-4'>Vận chuyển</h2>
            <Card className='mb-6 shadow-md rounded-2xl border border-gray-200'>
              <CardContent className='px-6 py-4 bg-white'>
                {deleveryDate ? (
                  <div className='text-center space-y-1'>
                    <p className='text-sm text-gray-600 font-medium'>
                      Đơn vị vận chuyển: <span className='text-gray-800'>Giao hàng nhanh</span>
                    </p>
                    <p className='text-sm text-gray-600'>
                      Dự kiến giao: <span className='text-green-600 font-semibold'>{deleveryDate}</span>
                    </p>
                  </div>
                ) : (
                  <p className='text-center text-sm text-gray-500'>Vui lòng nhập thông tin giao hàng</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className='text-xl font-semibold mb-4'>Thanh toán</h2>
            <Card className='border-gray-400'>
              <CardContent className='p-4'>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={handlePaymentMethodChange as (value: string) => void}
                  className='space-y-3'
                >
                  <div className='flex items-center space-x-2 p-2 rounded shadow cursor-pointer  hover:bg-gray-100'>
                    <RadioGroupItem value='cod' id='cod' />
                    <Label htmlFor='cod' className='flex-grow'>
                      Thanh toán khi giao hàng (COD)
                    </Label>
                    <div className='text-blue-500'>₫</div>
                  </div>

                  <div className='flex items-center space-x-2 p-2 rounded shadow cursor-pointer  hover:bg-gray-100'>
                    <RadioGroupItem value='vnpay' id='vnpay' />
                    <Label htmlFor='vnpay' className='flex-grow flex items-center'>
                      <div className='mr-2'>Thanh toán qua VNPay</div>
                      <div className='h-6 w-12 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold'>
                        VNPAY
                      </div>
                    </Label>
                    <CreditCard className='text-green-500 h-5 w-5' />
                  </div>
                </RadioGroup>

                {paymentMethod === 'vnpay' && (
                  <div className='mt-3 p-3 bg-blue-50 rounded-md border border-blue-200'>
                    <p className='text-sm text-blue-700'>
                      Bạn sẽ được chuyển đến cổng thanh toán VNPay để hoàn tất giao dịch an toàn
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Summary - Right Section */}
        <div className='w-full lg:w-1/3 p-4'>
          <h2 className='text-xl font-semibold mb-4'>Đơn hàng ({cartCountProduct} sản phẩm)</h2>
          <Card>
            <CardContent className='px-4'>
              <div className='space-y-4  max-h-[240px] overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent'>
                {orderItems.length > 0 &&
                  orderItems.map((item, index) => (
                    <div key={item.item.productId} className={`flex items-start ${index === 0 ? 'pt-2' : ''}`}>
                      <div className='w-16 h-16 bg-gray-100 rounded flex items-center justify-center relative'>
                        <div className='absolute -top-2 -right-2 bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs'>
                          {item.item.quantity}
                        </div>
                        <img src={item.item.avatar} className='w-full h-full  rounded'></img>
                      </div>
                      <div className='ml-4 flex-grow'>
                        <h3 className='font-medium text-sm'>{item.item.productName}</h3>
                        <p className='text-xs text-gray-500'>Giảm {item.item.discount * item.item.quantity}</p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium text-sm text-gray-400'>{formatMoney(item.totalApplyDiscount)}</p>
                      </div>
                    </div>
                  ))}
              </div>

              <div className='mt-4 border-t border-t-gray-300 pt-4'>
                <div className='flex justify-between pb-4'>
                  <Input
                    placeholder='Nhập mã giảm giá'
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className='flex-grow focus-visible:ring-transparent'
                  />
                  <Button onClick={handleGetVoucher} className='ml-2 bg-blue-500 cursor-pointer hover:bg-blue-600'>
                    Áp dụng
                  </Button>
                </div>

                <div className='border-t border-t-gray-300 pt-4 space-y-2'>
                  <div className='flex justify-between py-2'>
                    <span className='text-gray-600'>Tạm tính</span>
                    <span>{formatMoney(orderCheckout.totalApplyDiscount)}</span>
                  </div>
                  <div className='flex justify-between py-2'>
                    <span className='text-gray-600'>Phí vận chuyển</span>
                    <span>{shippingFee > 0 ? formatMoney(shippingFee) : '-'}</span>
                  </div>
                  <div className='flex justify-between py-2'>
                    <span className='text-gray-600'>Voucher</span>
                    <span>{orderCheckout.voucherDiscount > 0 ? formatMoney(orderCheckout.voucherDiscount) : '-'}</span>
                  </div>
                  <div className='flex justify-between py-2 font-semibold text-lg border-t border-t-gray-300 mt-2 pt-3'>
                    <span>Tổng cộng</span>
                    <span className='text-blue-600'>
                      {formatMoney(orderCheckout.totalApplyDiscount + shippingFee - orderCheckout.voucherDiscount)}
                    </span>
                  </div>

                  <div className='flex items-center justify-between mt-6'>
                    <Link to='/cart'>
                      <Button variant='ghost' className='cursor-pointer bg-gray-300'>
                        <ChevronLeft className='mr-1 h-4 w-4' />
                        Quay về giỏ hàng
                      </Button>
                    </Link>
                    <Button className='bg-blue-500 cursor-pointer hover:bg-blue-600' onClick={handlePlaceOrder}>
                      ĐẶT HÀNG
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
