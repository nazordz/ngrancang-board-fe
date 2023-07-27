import { Pagination, Project } from "@/models"
import http from "@/utils/http"
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"

interface INavbarSliceState {
  projects: Pagination<Project> | null,
  selectedProject: Project | null

}

const initialState: INavbarSliceState = {
  projects: null,
  selectedProject: null
}

export const fetchProjects = createAsyncThunk(
  'navbarSlice/fetchProjects',
  async () => {
    const response = await http.get<Pagination<Project> | null>('/projects/paginate', {
      params: {
        page: 0, size: 5
      }
    })
    return response.data;
  }
)

export const NavbarSlice = createSlice({
  name: 'navbarSlice',
  initialState,
  reducers: {
    updateProjects(state, action: PayloadAction<Pagination<Project> | null>) {
      state.projects = action.payload;
    },
    selectProject(state, action: PayloadAction<Project>) {
      state.selectedProject = action.payload;
    }
  },
  extraReducers(builder) {
      return builder.addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload
      })
  },
})

export const { updateProjects, selectProject } = NavbarSlice.actions

export default NavbarSlice.reducer
