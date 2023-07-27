import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  isOpen: boolean;
  onSuccess: () => Promise<void>;
  id: string;
}
const initialState: IInitialState = {
  id: '',
  onSuccess: async () => {},
  isOpen: false,
}

export const confirmDeleteSlice = createSlice({
  name: 'confirmDeleteSlice',
  initialState,
  reducers: {
    toggleDialogConfirmDelete(state) {
      state.isOpen = !state.isOpen
    },
    onConfirm(state) {
      state.onSuccess()
    }
  }
})

export const { toggleDialogConfirmDelete } = confirmDeleteSlice.actions;

export default confirmDeleteSlice.reducer;
