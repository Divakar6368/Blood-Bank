import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../authslice'
import storeSlice from '../storeslice'
import bookingReducer from '../bookingSlice'
export const stores=configureStore({
    reducer:{
        auth:authReducer,
        str:storeSlice,
        booking: bookingReducer,
    }
})