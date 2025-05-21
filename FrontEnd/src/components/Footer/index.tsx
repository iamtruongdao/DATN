import React from 'react'
import { Facebook, Instagram, ShoppingBag, MessageCircleHeart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import logo from '@/assets/logo.webp'
const Footer = () => {
  return (
    <div className='flex flex-col w-full'>
      {/* Top green bar with social icons and newsletter signup */}
      <div className='bg-green-600 text-white !py-2 !px-4'>
        <div className='container !mx-auto flex flex-col md:flex-row justify-between items-center gap-4'>
          <div className='flex items-center gap-3'>
            {/* Social icons */}
            <div className='cursor-pointer bg-blue-800 !p-2 rounded-full'>
              <Facebook size={16} />
            </div>
            <div className='cursor-pointer bg-gradient-to-r from-purple-500 to-pink-500 !p-2 rounded-full'>
              <Instagram size={16} />
            </div>
            <div className='cursor-pointer bg-blue-600 !p-2 rounded-full'>
              <MessageCircleHeart size={16} />
            </div>
            <div className='cursor-pointer bg-orange-500 !p-2 rounded-full'>
              <ShoppingBag size={16} />
            </div>
            <div className='cursor-pointer bg-black !p-2 rounded-full'>
              <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M8 0C3.582 0 0 3.582 0 8C0 12.418 3.582 16 8 16C12.418 16 16 12.418 16 8C16 3.582 12.418 0 8 0ZM11.98 6.938C11.939 8.197 11.401 10.516 9.245 10.516C8.203 10.516 7.453 9.766 7.453 8.724C7.453 7.682 8.203 6.932 9.245 6.932C10.089 6.932 10.788 7.464 10.928 8.229C10.928 8.229 11.151 7.182 9.557 6.313C9.557 6.313 8.88 5.922 8 5.922C6.287 5.922 4.896 7.313 4.896 9.026C4.896 10.739 6.287 12.13 8 12.13C9.713 12.13 11.104 10.739 11.104 9.026C11.104 8.313 10.828 7.651 10.359 7.182C10.359 7.182 11.714 7.464 11.98 6.938Z'
                  fill='white'
                />
              </svg>
            </div>
          </div>

          <div className='uppercase font-bold'>NHẬN THÔNG TIN KHUYẾN MÃI TỪ CHÚNG TÔI</div>

          <div className='flex gap-2'>
            <Input
              type='email'
              placeholder='Nhận email ưu đãi'
              className='bg-white focus-visible:ring-[1px] !px-2 h-8 text-black'
            />
            <Button className='bg-green-500 cursor-pointer hover:bg-green-600 h-8 !px-4'>Đăng kí</Button>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className='bg-white !py-6'>
        <div className='container !mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 !px-4'>
          {/* Column 1 - Logo and contact */}
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <img src={logo} alt='Nhà Nam Logo' className='h-12' />
              <div>
                <div className='text-green-600 font-bold text-lg'>nhà nam</div>
                <div className='text-green-600 italic text-sm'>Đời vì sách là thế giới</div>
              </div>
            </div>

            <div className='flex flex-col gap-2 text-sm'>
              <div className='flex items-start gap-2'>
                <svg className='w-5 h-5 text-green-600 !mt-1 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>Số 59, Đỗ Quang, Trung Hoà, Cầu Giấy, Hà Nội.</span>
              </div>

              <div className='flex items-center gap-2'>
                <svg className='w-5 h-5 text-green-600 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                  <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                </svg>
                <span>info@nhanam.vn</span>
              </div>

              <div className='flex items-center gap-2'>
                <svg className='w-5 h-5 text-green-600 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z' />
                </svg>
                <span>02435146876</span>
              </div>

              <div className='flex items-center gap-2'>
                <svg className='w-5 h-5 text-green-600 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>02435146875</span>
              </div>

              <a href='https://nhanam.vn' className='text-green-600 underline mt-2'>
                https://nhanam.vn
              </a>
            </div>
          </div>

          {/* Column 2 - GIỚI THIỆU */}
          <div>
            <h3 className='text-green-600 font-bold text-lg mb-4'>GIỚI THIỆU</h3>
            <ul className='flex flex-col gap-2 text-sm'>
              <li>
                <a href='#' className='hover:text-green-600'>
                  Về Nhà Nam
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-green-600'>
                  Hệ thống hiệu sách
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-green-600'>
                  Hệ thống phát hành
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-green-600'>
                  Tuyển dụng
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-green-600'>
                  Liên hệ với chúng tôi
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - CHÍNH SÁCH */}
          <div>
            <h3 className='text-green-600 font-bold text-lg mb-4'>CHÍNH SÁCH</h3>
            <ul className='flex flex-col gap-2 text-sm'>
              <li>
                <a href='#' className='hover:text-green-600'>
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-green-600'>
                  Chính sách đổi trả/hoàn tiền
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-green-600'>
                  Chính sách thanh toán/ vận chuyển
                </a>
              </li>
            </ul>

            <div className='!mt-6'>
              <img src='/api/placeholder/150/50' alt='Đã thông báo Bộ Công Thương' className='max-w-full h-auto' />
            </div>
          </div>

          {/* Column 4 - PHƯƠNG THỨC THANH TOÁN */}
          <div>
            <h3 className='text-green-600 font-bold text-lg !mb-4'>PHƯƠNG THỨC THANH TOÁN</h3>
            <div className='grid grid-cols-3 gap-2'>
              <img src='/api/placeholder/60/40' alt='Visa' className='h-8' />
              <img src='/api/placeholder/60/40' alt='Mastercard' className='h-8' />
              <img src='/api/placeholder/60/40' alt='JCB' className='h-8' />
              <img src='/api/placeholder/60/40' alt='MOMO' className='h-8' />
              <img src='/api/placeholder/60/40' alt='COD' className='h-8' />
              <img src='/api/placeholder/60/40' alt='Banking' className='h-8' />
              <img src='/api/placeholder/60/40' alt='Napas' className='h-8' />
              <img src='/api/placeholder/60/40' alt='VNPay' className='h-8' />
              <img src='/api/placeholder/60/40' alt='Payoo' className='h-8' />
            </div>

            <div className='!mt-4 flex justify-end'>
              <button className='bg-green-600 text-white !p-2 rounded-full hover:bg-green-700'>
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
