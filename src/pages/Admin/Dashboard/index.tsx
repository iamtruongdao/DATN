import { useEffect, useState } from 'react'
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Calendar, ChevronDown, DollarSign, Package, ShoppingCart, TrendingUp, Users } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Book, OrderStatisticResponse } from '@/types'
import { dashBoardApi, getOrderStatisticApi } from '@/apis/order.api'
import { formatMoney } from '@/utils'
import { OrderState } from '@/utils/constant'
import DatePicker from 'react-datepicker'
import { getTopBookApi } from '@/apis/book.api'

// Dữ liệu mẫu
const revenueData = [
  { name: 'T1', revenue: 4000, orders: 240, visitors: 2400 },
  { name: 'T2', revenue: 3000, orders: 198, visitors: 2210 },
  { name: 'T3', revenue: 2000, orders: 120, visitors: 2290 },
  { name: 'T4', revenue: 2780, orders: 168, visitors: 2000 },
  { name: 'T5', revenue: 1890, orders: 115, visitors: 2181 },
  { name: 'T6', revenue: 2390, orders: 145, visitors: 2500 },
  { name: 'T7', revenue: 3490, orders: 210, visitors: 2800 },
  { name: 'T8', revenue: 3490, orders: 210, visitors: 2800 },
  { name: 'T9', revenue: 3490, orders: 210, visitors: 2800 },
  { name: 'T10', revenue: 5490, orders: 300, visitors: 3800 },
  { name: 'T11', revenue: 4490, orders: 270, visitors: 3200 },
  { name: 'T12', revenue: 6490, orders: 350, visitors: 4100 }
]

const productPerformance = [
  { id: 1, name: 'Áo Thun Nam', stock: 120, sold: 98, revenue: 5880000, category: 'Thời trang nam' },
  { id: 2, name: 'Váy Đầm Nữ', stock: 85, sold: 72, revenue: 8640000, category: 'Thời trang nữ' },
  { id: 3, name: 'Điện Thoại XYZ', stock: 35, sold: 28, revenue: 140000000, category: 'Điện tử' },
  { id: 4, name: 'Tai Nghe Bluetooth', stock: 150, sold: 130, revenue: 9100000, category: 'Phụ kiện' },
  { id: 5, name: 'Bàn Làm Việc', stock: 30, sold: 18, revenue: 12600000, category: 'Nhà cửa' }
]

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState<Date | null>(new Date())
  const [data, setData] = useState<OrderStatisticResponse[]>([])
  const [topBooks, setTopBooks] = useState<Book[]>([])
  // Định dạng số tiền
  const [orderCount, setOrderCount] = useState<{ [key in OrderState]: number }>({
    Pending: 0,
    Delivered: 0,
    Cancel: 0,
    Shipping: 0,
    WaitingPickup: 0
  })
  const fetchOrderStatistic = async () => {
    const res = await getOrderStatisticApi(selectedYear!.getFullYear())
    if (res.code === 0) {
      setData(res.data)
    }
  }
  const getOrder = async () => {
    const res = await dashBoardApi()
    if (res.code === 0) {
      const copyState = { ...orderCount }
      const arr = res.data
      arr.forEach((element) => {
        copyState[element.status] = element.count
      })
      setOrderCount(copyState)
    }
  }
  const getTopBook = async () => {
    const res = await getTopBookApi({ year: selectedYear!.getFullYear().toString() })
    if (res.code === 0) {
      setTopBooks(res.data.items)
    }
  }
  useEffect(() => {
    getOrder()
  }, [])
  useEffect(() => {
    getTopBook()
    fetchOrderStatistic()
  }, [selectedYear])
  // Tính tổng doanh thu

  const totalRevenue = data.reduce((sub, item) => sub + item.totalRevenue, 0)

  const totalOrders = data.reduce((sub, item) => sub + item.totalOrders, 0)

  const totalVisitors = revenueData.reduce((sum, item) => sum + item.visitors, 0)
  const conversionRate = ((totalOrders / totalVisitors) * 100).toFixed(2)

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      {/* Main Content */}
      <main className='container mx-auto p-4 flex-grow pt-6'>
        {/* Time range selector */}
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center bg-white border rounded-md p-2 shadow-sm'>
            <DatePicker
              selected={selectedYear}
              onChange={(date) => setSelectedYear(date)}
              showYearPicker
              dateFormat='yyyy'
              placeholderText='Select year'
            />
          </div>
        </div>

        {/* Thông báo */}

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
          <div className='bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Tổng Doanh Thu</p>
                <h3 className='text-xl font-bold text-gray-800'>{formatMoney(totalRevenue)}</h3>
              </div>
              <div className='bg-orange-100 p-3 rounded-full'>
                <DollarSign size={20} className='text-orange-600' />
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Đơn Hàng</p>
                <h3 className='text-xl font-bold text-gray-800'>{totalOrders}</h3>
              </div>
              <div className='bg-blue-100 p-3 rounded-full'>
                <ShoppingCart size={20} className='text-blue-600' />
              </div>
            </div>
          </div>

          {/* <div className='bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Lượt Truy Cập</p>
                <h3 className='text-xl font-bold text-gray-800'>{totalVisitors}</h3>
                <p className='text-xs text-green-600 mt-1'>+15% so với tháng trước</p>
              </div>
              <div className='bg-green-100 p-3 rounded-full'>
                <Users size={20} className='text-green-600' />
              </div>
            </div>
          </div> */}

          <div className='bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500'>
            <div className='flex justify-between items-start'>
              <div>
                <p className='text-sm text-gray-500 mb-1'>Tỷ Lệ Chuyển Đổi</p>
                <h3 className='text-xl font-bold text-gray-800'>{conversionRate}%</h3>
                {/* <p className='text-xs text-green-600 mt-1'>+2% so với tháng trước</p> */}
              </div>
              <div className='bg-purple-100 p-3 rounded-full'>
                <TrendingUp size={20} className='text-purple-600' />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
          <div className='bg-white rounded-lg shadow-md p-4'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Doanh Thu Theo Tháng</h3>
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip formatter={(value: number) => formatMoney(value)} />
                <Legend />
                <Line type='monotone' dataKey='totalRevenue' stroke='#ee4d2d' activeDot={{ r: 8 }} name='Doanh Thu' />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className='bg-white rounded-lg shadow-md p-4'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Đơn Hàng Theo Tháng</h3>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis yAxisId='left' orientation='left' />
                <YAxis yAxisId='right' orientation='right' />
                <Tooltip />
                <Legend />
                <Bar yAxisId='left' dataKey='totalOrders' fill='#2196f3' name='Đơn Hàng' />
                {/* <Bar yAxisId='right' dataKey='visitors' fill='#4caf50' name='Lượt Truy Cập' /> */}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Products Table */}
        <div className='bg-white rounded-lg shadow-md mb-6'>
          <div className='p-4 border-b'>
            <h3 className='text-lg font-semibold text-gray-800'>Hiệu Suất Sản Phẩm</h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead className='bg-gray-50 border-b'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ID</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Tên Sản Phẩm
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Danh Mục
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Tồn Kho
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Đã Bán
                  </th>
                  {/* <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Doanh Thu
                  </th> */}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200'>
                {topBooks.length > 0 &&
                  topBooks.map((product, index) => (
                    <tr key={product.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{index + 1}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{product.productName}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{product.category[0].name}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{product.productQuantity}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{product.sold}</td>
                      {/* <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {formatMoney(product.revenue)}
                    </td> */}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className='p-4 border-t flex justify-between'>
            <span className='text-sm text-gray-500'>Hiển thị 1-5 trên 5 sản phẩm</span>
            <div className='flex'>
              <button className='px-3 py-1 border text-sm rounded-l-md bg-gray-50'>Trước</button>
              <button className='px-3 py-1 border-t border-b border-r text-sm bg-orange-500 text-white'>1</button>
              <button className='px-3 py-1 border-t border-b border-r text-sm rounded-r-md bg-gray-50'>Sau</button>
            </div>
          </div>
        </div>

        {/* Category Stats */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* <div className='bg-white rounded-lg shadow-md p-4'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Top Danh Mục</h3>
            <div className='space-y-4'>
              <div>
                <div className='flex justify-between mb-1'>
                  <span className='text-sm font-medium text-gray-700'>Thời trang nữ</span>
                  <span className='text-sm font-medium text-gray-700'>35%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div className='bg-orange-500 h-2 rounded-full' style={{ width: '35%' }}></div>
                </div>
              </div>
              <div>
                <div className='flex justify-between mb-1'>
                  <span className='text-sm font-medium text-gray-700'>Điện tử</span>
                  <span className='text-sm font-medium text-gray-700'>28%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div className='bg-orange-500 h-2 rounded-full' style={{ width: '28%' }}></div>
                </div>
              </div>
              <div>
                <div className='flex justify-between mb-1'>
                  <span className='text-sm font-medium text-gray-700'>Thời trang nam</span>
                  <span className='text-sm font-medium text-gray-700'>18%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div className='bg-orange-500 h-2 rounded-full' style={{ width: '18%' }}></div>
                </div>
              </div>
              <div>
                <div className='flex justify-between mb-1'>
                  <span className='text-sm font-medium text-gray-700'>Nhà cửa</span>
                  <span className='text-sm font-medium text-gray-700'>12%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div className='bg-orange-500 h-2 rounded-full' style={{ width: '12%' }}></div>
                </div>
              </div>
              <div>
                <div className='flex justify-between mb-1'>
                  <span className='text-sm font-medium text-gray-700'>Phụ kiện</span>
                  <span className='text-sm font-medium text-gray-700'>7%</span>
                </div>
                <div className='w-full bg-gray-200 rounded-full h-2'>
                  <div className='bg-orange-500 h-2 rounded-full' style={{ width: '7%' }}></div>
                </div>
              </div>
            </div>
          </div> */}

          <div className='bg-white rounded-lg shadow-md p-4'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Thống Kê Đơn Hàng</h3>
            <div className='space-y-4'>
              <div className='flex justify-between items-center p-3 bg-gray-50 rounded-md'>
                <div className='flex items-center'>
                  <div className='bg-green-100 p-2 rounded-md mr-3'>
                    <Package size={20} className='text-green-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Đơn Hàng Hoàn Thành</p>
                    <p className='text-xs text-gray-500'>Trong tháng này</p>
                  </div>
                </div>
                <p className='text-xl font-bold text-gray-800'>{orderCount.Delivered}</p>
              </div>
              <div className='flex justify-between items-center p-3 bg-gray-50 rounded-md'>
                <div className='flex items-center'>
                  <div className='bg-blue-100 p-2 rounded-md mr-3'>
                    <Package size={20} className='text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Chờ lấy hàng</p>
                    <p className='text-xs text-gray-500'>Đang vận chuyển hoặc chuẩn bị</p>
                  </div>
                </div>
                <p className='text-xl font-bold text-gray-800'>{orderCount.WaitingPickup}</p>
              </div>
              <div className='flex justify-between items-center p-3 bg-gray-50 rounded-md'>
                <div className='flex items-center'>
                  <div className='bg-red-100 p-2 rounded-md mr-3'>
                    <Package size={20} className='text-red-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Đơn Hủy</p>
                    <p className='text-xs text-gray-500'>Trong tháng này</p>
                  </div>
                </div>
                <p className='text-xl font-bold text-gray-800'>{orderCount.Cancel}</p>
              </div>
              <div className='flex justify-between items-center p-3 bg-gray-50 rounded-md'>
                <div className='flex items-center'>
                  <div className='bg-yellow-100 p-2 rounded-md mr-3'>
                    <Package size={20} className='text-yellow-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Chờ xác nhận</p>
                    <p className='text-xs text-gray-500'>Trong tháng này</p>
                  </div>
                </div>
                <p className='text-xl font-bold text-gray-800'>{orderCount.Pending}</p>
              </div>
              <div className='flex justify-between items-center p-3 bg-gray-50 rounded-md'>
                <div className='flex items-center'>
                  <div className='bg-yellow-100 p-2 rounded-md mr-3'>
                    <Package size={20} className='text-gray-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Đang giao</p>
                    <p className='text-xs text-gray-500'>Trong tháng này</p>
                  </div>
                </div>
                <p className='text-xl font-bold text-gray-800'>{orderCount.Shipping}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
    </div>
  )
}

export default Dashboard
