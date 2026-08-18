import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../authslice'
export const stores=configureStore({
    reducer:{
        auth:authReducer,
    }
})