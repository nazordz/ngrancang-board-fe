import { User } from "@/models";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IAuthenticateSliceState {
  user: User|null
}

const initialState: IAuthenticateSliceState = {
  user: null
}

export const authenticateSlice = createSlice({
  name: 'authenticateSlice',
  initialState,
  reducers: {
    userLogged(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    userLogout(state) {
      state.user = null;
    },
  }
})

export const { userLogged, userLogout } = authenticateSlice.actions;

export default authenticateSlice.reducer;
