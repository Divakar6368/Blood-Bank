import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axiosClient from './Utils/axiosclient'

export const registerUser=createAsyncThunk(
    'auth/register',
    async (userinfo,{ rejectWithValue })=>{
        try{
         const response= await axiosClient.post('/user/register',userinfo);
          return response.data?.user;
        }
        catch(err){
            const errorMessage =err.response?.data?.message || err.message || 'Registration failed';
            return rejectWithValue(errorMessage);
        }
    }
)


export const loginUser=createAsyncThunk(
    'auth/login',
    async (credentials,{ rejectWithValue })=>{
        try {
            const response = await axiosClient.post('/user/login', credentials);
            return response.data?.user;
        }
        catch (error) {
           const message = error.response?.data?.message || error.message || 'Login failed';
           return rejectWithValue(message);
        }
    }
)

export const checkAuth=createAsyncThunk(
     'auth/check',
      async (_, { rejectWithValue }) => {
        try {
          const { data } = await axiosClient.get('/user/check');
          return data?.user;
        } catch (error) {
          const errorMessage =err.response?.data?.message || err.message || 'Registration failed';
          return rejectWithValue(errorMessage);
        }
      }
)
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout');
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const adminRegister=createAsyncThunk(
    'auth/admin',
    async (userinfo,{ rejectWithValue })=>{
        try{
         const response= await axiosClient.post('/user/admin',userinfo);
          return response.data?.user;
        }
        catch(err){
            const errorMessage =err.response?.data?.message || err.message || 'Registration failed';
            return rejectWithValue(errorMessage);
        }
    }
)

const authSlice=createSlice({
    name:'auth',
    initialState:{
        user:null,
        loading:false,
        error: null,
        isAuthenticated: false
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        
            .addCase(registerUser.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
              state.loading = false;
              state.isAuthenticated = !!action.payload;
              state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload?.message || 'Something went wrong';
              state.isAuthenticated = false;
              state.user = null;
            })

            .addCase(loginUser.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
              state.loading = false;
              state.isAuthenticated = !!action.payload;
              state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload?.message || 'Something went wrong';
              state.isAuthenticated = false;
              state.user = null;
            })
        
            .addCase(checkAuth.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
              state.loading = false;
              state.isAuthenticated = !!action.payload;
              state.user = action.payload;
            })
            .addCase(checkAuth.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload?.message || 'Something went wrong';
              state.isAuthenticated = false;
              state.user = null;
            })
        
            .addCase(logoutUser.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
              state.loading = false;
              state.user = null;
              state.isAuthenticated = false;
              state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload?.message || 'Something went wrong';
              state.isAuthenticated = false;
              state.user = null;
            })
            .addCase(adminRegister.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(adminRegister.fulfilled, (state, action) => {
              state.loading = false;
              state.isAuthenticated = !!action.payload;
              state.user = action.payload;
            })
            .addCase(adminRegister.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload?.message || 'Something went wrong';
              state.isAuthenticated = false;
              state.user = null;
            })
    }
})

export default authSlice.reducer;