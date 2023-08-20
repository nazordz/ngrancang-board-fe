import { FormProjectRequest as IFormProject, Pagination, Project } from "@/models";
import http from "@/utils/http";

async function fetchPaginateProjects(page = 0, rowsPerPage = 10, search = ''): Promise<Pagination<Project> | null> {
  try {
    const response = await http.get<Pagination<Project>>('/projects/paginate', {
      params: {
        page, size: rowsPerPage, search
      }
    })
    return response.data;
  } catch (error) {
    return null
  }
}

async function fetchProjectById(id: string) {
  try {
    const { data } = await http.get<Project>(`/projects/${id}`);
    return data;
  } catch (error) {
    return null;
  }
}

async function saveProject(request: IFormProject) {
  try {
    var formData = new FormData();
    formData.append('key', request.key)
    formData.append('name', request.name)
    if (request.avatar) {
      formData.append('avatar', request.avatar)
    }
    formData.append('description', request.description)
    const res = await http.post<Project>('/projects', formData);
    return res.data;
  } catch (error) {
    return null;
  }
}

async function updateProject(request: IFormProject, id: string) {
  try {
    var formData = new FormData();
    formData.append('key', request.key)
    formData.append('name', request.name)
    if (request.avatar) {
      formData.append('avatar', request.avatar)
    }
    formData.append('description', request.description)
    const res = await http.put<Project>('/projects/' + id, formData);
    return res.data;
  } catch (error) {
    return null;
  }
}

async function deleteProject(projectId: string) {
  try {
    await http.delete(`/projects/${projectId}`)
  } catch (error) {
    console.error(error)
  }
}

export {
  updateProject,
  fetchProjectById,
  saveProject,
  fetchPaginateProjects,
  deleteProject
}
