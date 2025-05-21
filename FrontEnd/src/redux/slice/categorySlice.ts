import { getCategoryApi } from '@/apis/category.api'
import { Category } from '@/types'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export const getCategoryAction = createAsyncThunk('category/getCategory', async () => {
  const response = await getCategoryApi()
  return response.data // Assuming the API returns the cart data in the response.data
})

const initialState = {
  categories: [] as Category[]
}
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getCategoryAction.fulfilled, (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload
    })
  }
})

export default categorySlice.reducer
