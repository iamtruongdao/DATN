import { getCartApi } from '@/apis/cart.api'
import { Cart } from '@/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export const getCartAction = createAsyncThunk('cart/getCart', async (userId: string) => {
  const response = await getCartApi(userId)
  return response.data // Assuming the API returns the cart data in the response.data
})

const initialState: Cart = {
  id: '',
  userId: '',
  cartProducts: [],
  cartCountProduct: 0
}
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getCartAction.fulfilled, (state, action: PayloadAction<Cart>) => {
      state.id = action.payload.id
      state.userId = action.payload.userId
      state.cartProducts = action.payload.cartProducts
      state.cartCountProduct = action.payload.cartCountProduct
    })
  }
})

export default cartSlice.reducer
