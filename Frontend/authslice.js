import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./Utils/axiosclient";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userinfo, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/register", userinfo);
      return response.data?.user;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";
      return rejectWithValue(errorMessage);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/login", credentials);
      return response.data?.user;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      return rejectWithValue(message);
    }
  },
);

export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/user/check");
      return data?.user;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Authentication check failed";
      return rejectWithValue(errorMessage);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("/user/logout");
      return null;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Logout failed";
      return rejectWithValue(errorMessage);
    }
  },
);

export const adminRegister = createAsyncThunk(
  "auth/admin",
  async (userinfo, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/admin", userinfo);
      return response.data?.user;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed";
      return rejectWithValue(errorMessage);
    }
  },
);

export const fetchMedicalInfo = createAsyncThunk(
  "auth/fetchMedicalInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/info/medicalinfo");
      return response.data?.data ?? null;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch medical details";
      return rejectWithValue(errorMessage);
    }
  },
);

export const saveMedicalInfo = createAsyncThunk(
  "auth/saveMedicalInfo",
  async (medicalData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/info/medical", medicalData);
      return response.data?.data ?? null;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to save medical details";
      return rejectWithValue(errorMessage);
    }
  },
);
export const fetchPendingBookings = createAsyncThunk(
  "auth/fetchPendingBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("item/my-booking");

      const allBookings = response.data?.data || response.data || [];

      const pendingOnly = allBookings.filter(
        (booking) =>
          booking.status && booking.status.toLowerCase() === "pending",
      );

      return pendingOnly;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch bookings";
      return rejectWithValue(errorMessage);
    }
  },
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    medicalInfo: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    authInitialized: false,
    bookingsLoading: false,
    pendingBookings: [],
  },
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
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
        state.error = action.payload || "Something went wrong";
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
        state.error = action.payload || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })

      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.authInitialized = false;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.authInitialized = true;
        state.isAuthenticated = !!action.payload;
        state.user = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.authInitialized = true;
        state.error = action.payload || "Something went wrong";
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
        state.medicalInfo = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
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
        state.error = action.payload || "Something went wrong";
        state.isAuthenticated = false;
        state.user = null;
      })

      .addCase(fetchMedicalInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalInfo = action.payload;
      })
      .addCase(fetchMedicalInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch medical details";
      })

      .addCase(saveMedicalInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveMedicalInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.medicalInfo = action.payload;
      })
      .addCase(saveMedicalInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to save medical details";
      });

    builder
      .addCase(fetchPendingBookings.pending, (state) => {
        state.bookingsLoading = true;
      })
      .addCase(fetchPendingBookings.fulfilled, (state, action) => {
        state.bookingsLoading = false;
        state.pendingBookings = action.payload;
      })
      .addCase(fetchPendingBookings.rejected, (state) => {
        state.bookingsLoading = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
