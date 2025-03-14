import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCoupons, claimCouponAPI, checkUserEligibility } from "../api";

const initialState = {
  coupons: [],
  currentCoupon: null,
  currentIndex: 0, //  field to track the round-robin position
  claimedCoupon: null,
  isEligible: false,
  timeRemaining: 0,
  loading: false,
  error: null,
};

export const fetchCoupons = createAsyncThunk(
  "coupon/fetchCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const coupons = await getCoupons();
      return coupons;
    } catch (error) {
      return rejectWithValue("Failed to fetch coupons");
    }
  }
);

export const checkEligibility = createAsyncThunk(
  "coupon/checkEligibility",
  async (_, { rejectWithValue }) => {
    try {
      const result = await checkUserEligibility();
      return result;
    } catch (error) {
      return rejectWithValue("Failed to check eligibility");
    }
  }
);

export const claimCoupon = createAsyncThunk(
  "coupon/claimCoupon",
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    if (!state.coupon.currentCoupon) {
      return rejectWithValue("No coupon available");
    }

    if (!state.coupon.isEligible) {
      return rejectWithValue("You are not eligible to claim a coupon yet");
    }

    try {
      const claimedCoupon = await claimCouponAPI(state.coupon.currentCoupon.id);
      return claimedCoupon;
    } catch (error) {
      return rejectWithValue("Failed to claim coupon");
    }
  }
);

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {
    updateTimeRemaining: (state, action) => {
      state.timeRemaining = action.payload;
      if (state.timeRemaining <= 0) {
        state.isEligible = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch coupons
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
        // Reset the index and current coupon on fetch
        state.currentIndex = 0;
        state.currentCoupon = action.payload[0] || null;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Check eligibility
      .addCase(checkEligibility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkEligibility.fulfilled, (state, action) => {
        state.loading = false;
        state.isEligible = action.payload.isEligible;
        state.timeRemaining = action.payload.timeRemaining;
        state.claimedCoupon = action.payload.claimedCoupon;
        // Optionally, update currentCoupon if provided from eligibility check
        if (action.payload.nextCoupon) {
          state.currentCoupon = action.payload.nextCoupon;
        }
      })
      .addCase(checkEligibility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Claim coupon
      .addCase(claimCoupon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(claimCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.claimedCoupon = action.payload;
        state.isEligible = false;
        state.timeRemaining = 3600; // 1 hour cooldown

        // Advance the round-robin index
        if (state.coupons.length > 0) {
          state.currentIndex = (state.currentIndex + 1) % state.coupons.length;
          state.currentCoupon = state.coupons[state.currentIndex];
        }
      })
      .addCase(claimCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateTimeRemaining } = couponSlice.actions;
export default couponSlice.reducer;
