import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export interface FormProjectState {
  isOpen: boolean,
  id: string
}

const initState: FormProjectState = {
  isOpen: false,
  id: ''
}

export const formProjectSlice = createSlice({
  name: 'formProjectSlice',
  initialState: initState,
  reducers: {
    toggleDialogProject(state) {
      state.isOpen = !state.isOpen;
    },
    setFormProjectId(state, action: PayloadAction<string>) {
      state.id = action.payload
    },
    openProjectDialog(state, action: PayloadAction<string>) {
      state.id = action.payload;
      state.isOpen = true;
    },
    closeProjectDialog(state) {
      state.id = '';
      state.isOpen = false;
    },
  }
})

export const { toggleDialogProject, setFormProjectId, closeProjectDialog, openProjectDialog } = formProjectSlice.actions;

export default formProjectSlice.reducer;
