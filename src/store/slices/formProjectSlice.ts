import { createSlice } from "@reduxjs/toolkit"

export interface FormProjectState {
  isOpen: boolean
}

const initState: FormProjectState = {
  isOpen: false,
}

export const formProjectSlice = createSlice({
  name: 'formProjectSlice',
  initialState: initState,
  reducers: {
    toggleDialogProject(state) {
      state.isOpen = !state.isOpen;
    }
  }
})

export const { toggleDialogProject } = formProjectSlice.actions;

export default formProjectSlice.reducer;
