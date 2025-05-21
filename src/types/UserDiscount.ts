import { Discount } from '@/types'

export interface UserDiscount {
  id: string // tương ứng với public string? Id
  discountId: string // tương ứng với DiscountId
  userId: string // tương ứng với UserId
  isUsed: boolean // tương ứng với IsUsed
  discounts: Discount[]
}
