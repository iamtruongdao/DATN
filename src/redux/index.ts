import { configureStore, Reducer } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import userReducer from '@/redux/slice/userSlice'
import appReducer from '@/redux/slice/appSlice'
import cartReducer from '@/redux/slice/cartSlice'
import categoryReducer from '@/redux/slice/categorySlice'
import { injectStore } from '@/config/axios'
type CombinedState = typeof userReducer extends Reducer<infer U> ? U : never

const persistConfig = {
  key: 'userInfor',
  storage,
  stateReconciler: autoMergeLevel2 as (inboundState: CombinedState) => CombinedState,
  whitelist: ['userInfo', 'isLogin']
}
const persistedReducer = persistReducer(persistConfig, userReducer)

export const store = configureStore({
  reducer: {
    user: persistedReducer,
    app: appReducer,
    cart: cartReducer,
    category: categoryReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
})
injectStore(store)
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
