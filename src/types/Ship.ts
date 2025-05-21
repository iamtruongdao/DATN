export interface Province {
  ProvinceID: number
  ProvinceName: string
}

export interface District {
  Code: string
  DistrictID: number
  DistrictName: string
  ProvinceID: number
}

export interface Ward {
  WardCode: string
  WardName: string
  DistrictID: number
}
export interface ShopResponse {
  code: number
  message: string
  data: ShopData
}

export interface ShopData {
  shops: Shop[]
}

export interface Shop {
  _id: number
  name: string
  phone: string
  address: string
}
export interface GhnOrderDataDto {
  order_code: string
}

export interface CreateOrderRespone {
  code: number
  message: string
  data: GhnOrderDataDto
  message_display: string
}
