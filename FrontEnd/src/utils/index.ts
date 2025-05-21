export const formatMoney = (amount?: number) => {
  return Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount || 0)
}
export function formatDateStringToVietnamese(dateString: string) {
  // Tạo đối tượng Date từ chuỗi ISO
  const date = new Date(dateString)

  // Mảng tên các thứ trong tuần bằng tiếng Việt
  const weekdaysVN = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']

  // Lấy tên thứ trong tuần
  const weekday = weekdaysVN[date.getDay()]

  // Format ngày tháng theo dạng dd/MM/yyyy
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  // Kết hợp thành chuỗi định dạng cuối cùng
  return `${weekday}, ${day}/${month}/${year}`
}

export const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise(function (resolve, reject) {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
export function capitalizeFirstLetter(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}
export const formatDate = (date: string): string => {
  const parsedDate = new Date(date)
  const hours = parsedDate.getHours().toString().padStart(2, '0')
  const minutes = parsedDate.getMinutes().toString().padStart(2, '0')
  const day = parsedDate.getDate().toString().padStart(2, '0')
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0')
  const year = parsedDate.getFullYear()

  return `${hours}:${minutes} - ${day}/${month}/${year}`
}
