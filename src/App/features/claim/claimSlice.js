import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const submitClaim = createAsyncThunk(
  "claim/submit",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/claims", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const claimSlice = createSlice({
  name: "claim",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetClaimState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitClaim.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitClaim.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Claim failed";
      });
  },
});

export const { resetClaimState } = claimSlice.actions;
export default claimSlice.reducer;
