import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'

interface QuantityInputProps {
  itemId: string
  quantity: number
  isDisabled: boolean
  debounceOnChange: (newValue: number, itemId: string, oldQuantity: number) => void
  onZeroQuantity: () => void
}

export default function QuantityInput({
  itemId,
  quantity,
  isDisabled,
  debounceOnChange,
  onZeroQuantity
}: QuantityInputProps) {
  const [inputQuantity, setInputQuantity] = useState(quantity)
  const oldQuantity = useRef(quantity)
  // Cập nhật state local khi prop thay đổi
  useEffect(() => {
    setInputQuantity(quantity)
  }, [quantity])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    oldQuantity.current = quantity
    let newQuantity = parseInt(e.target.value, 10)

    if (isNaN(newQuantity)) newQuantity = 1

    if (newQuantity <= 0) {
      // Kích hoạt dialog xác nhận xóa thay vì đặt số lượng = 0
      onZeroQuantity()
      return
    }

    setInputQuantity(newQuantity)
    debounceOnChange(newQuantity, itemId, oldQuantity.current)
  }

  const handleIncrease = () => {
    oldQuantity.current = quantity
    setInputQuantity((prev) => {
      const newQuantity = prev + 1
      debounceOnChange(newQuantity, itemId, oldQuantity.current)
      return newQuantity
    })
  }

  const handleDecrease = () => {
    if (inputQuantity <= 1) {
      // Kích hoạt dialog xác nhận xóa thay vì giảm xuống 0
      onZeroQuantity()
      return
    }

    oldQuantity.current = quantity
    setInputQuantity((prev) => {
      const newQuantity = prev - 1
      debounceOnChange(newQuantity, itemId, oldQuantity.current)
      return newQuantity
    })
  }

  return (
    <div className='flex items-center border border-gray-200 rounded-md'>
      <Button
        onClick={handleDecrease}
        variant='ghost'
        size='icon'
        className='h-8 w-8 border-r border-gray-200 cursor-pointer rounded-r-none text-gray-600'
        disabled={isDisabled}
      >
        -
      </Button>
      <input
        type='number'
        value={inputQuantity}
        onChange={handleInputChange}
        className='w-10 h-8 text-center border-0 focus:outline-none focus:ring-0 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
        disabled={isDisabled}
        min='1'
      />
      <Button
        onClick={handleIncrease}
        variant='ghost'
        size='icon'
        className='h-8 w-8 border-l cursor-pointer border-gray-200 rounded-l-none text-gray-600'
        disabled={isDisabled}
      >
        +
      </Button>
    </div>
  )
}
