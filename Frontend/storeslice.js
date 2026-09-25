import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./Utils/axiosclient";

export const getstoreinformation=createAsyncThunk(
    'store/info',
    async (_,{rejectWithValue})=>{
        try {
            const response = await axiosClient.get("/admin/storeinfoforuser");
             return response.data?.data;
        } catch (err) {
             const errorMessage =err.response?.data?.message || err.message || 'Registration failed';
            return rejectWithValue(errorMessage);
        }
    }
)


const storeslice=createSlice({
    name:'str',
    initialState:{
        info:[],
        loading:false,
        error: null,
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getstoreinformation.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(getstoreinformation.fulfilled,(state,action)=>{
            state.info=action.payload;
            state.loading=false;
            state.error=null;
        })
        .addCase(getstoreinformation.rejected,(state,action)=>{
            state.loading=false;
            state.error= action.payload?.message || 'Something went wrong';
            state.info=[];
        })
    }
})


export default storeslice.reducer;