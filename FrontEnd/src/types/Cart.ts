export interface Cart {
  id: string
  userId: string
  cartProducts: CartProduct[]
  cartCountProduct: number
}

export interface CartProduct {
  quantity: number
  productId: string
  productDetails: ProductDetail
}

export interface ProductDetail {
  productName: string
  slug: string
  productPrice: number
  discount: number
  discountPrice: number
  avatar: string
}
