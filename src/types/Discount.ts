export interface Discount {
  id: string
  code: string
  description: string
  name: string
  startDate: Date
  endDate: Date
  value: number
  minOrderValue: number
  type: DiscountType
  applyTo: ApplyTo
  isActive: boolean
  userUsage: string[]
  productIds: string[]
  maxUsage: number
  useCount: number
  maxUsagePerUser: number
}

export enum DiscountType {
  Percentage = 'Percentage',
  FixedAmount = 'FixedAmount'
}

export enum ApplyTo {
  All = 'All',
  Specific = 'Specific'
}
