import { createAsyncThunk } from '@reduxjs/toolkit'
import { setLoading } from '@/redux/slice/appSlice'
import { getAuthorByIdApi } from '@/apis/author.api'

export const getAuthorByIdAction = createAsyncThunk('author/fetbyId', async (id: string, { dispatch }) => {
  dispatch(setLoading(true))
  const res = await getAuthorByIdApi(id)
  if (res.code === 0) {
    dispatch(setLoading(false))
    return res.data
  }
  return {}
})
