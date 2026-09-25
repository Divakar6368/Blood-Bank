import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./Utils/axiosclient";

export const fetchSampleByStore = createAsyncThunk(
  "booking/fetchSampleByStore",
  async (storeId, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/admin/getsample/${storeId}`);

      return res.data?.data || res.data?.samples || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch sample details"
      );
    }
  }
);

const bookingSlice = createSlice({
  name: "booking",

  initialState: {
    currentSamples: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchSampleByStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSampleByStore.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSamples = action.payload;
      })

      .addCase(fetchSampleByStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentSamples = [];
      });
  },
});

export default bookingSlice.reducer;