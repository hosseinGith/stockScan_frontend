import { createSlice } from "@reduxjs/toolkit";
import type { Users } from "../../../api/types";
interface InitialStateType {
  user: Users | null;
}
const initialState: InitialStateType = {
  user: null,
};

export const seSlice = createSlice({
  name: "se",
  initialState,
  reducers: {
    setUser: (state, payload: { payload: Users; type: string }) => {
      state.user = payload.payload;
    },
  },
});

// اکشن‌ها
export const { setUser } = seSlice.actions;

// ریدوسر
export default seSlice.reducer;
