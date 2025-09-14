import { createSlice } from "@reduxjs/toolkit";

const facebookSlice = createSlice({
  name: "facebook",
  initialState: {
    isFetching: false,
    data: null,
    error: null,
  },
  reducers: {
    start: (state) => {
      state.isFetching = true;
      state.error = null;
    },
    success: (state, action) => {
      state.isFetching = false;
      state.data = action.payload;
    },
    error: (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    },
    getFacebookFields: (state, action) => {
      state.isFetching = false;
      state.error = null;
      state.data = action.payload;
    },
    createFacebookFields: (state, action) => {
      state.isFetching = false;
      state.error = null;
      state.data = action.payload;
    },
    end: (state) => {
      state.isFetching = false;
      state.error = null;
    },
  }
});

export const { start, success, error, getFacebookFields, createFacebookFields, end } =
  facebookSlice.actions;

export default facebookSlice.reducer;
