import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

// import paymentReducer from '../features/payment/paymentSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: import.meta.env.VITE_NODE_ENV !== "production",
});
