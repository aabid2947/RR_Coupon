import { configureStore } from "@reduxjs/toolkit";
import couponReducer from "./CouponSlice.js";

export const store = configureStore({
  reducer: {
    coupon: couponReducer,
  },
});
