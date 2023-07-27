import { Epic, EpicForm } from "@/models"
import http from "@/utils/http"

export async function fetchEpicsByProjectId(projectId: string) {
  try {
    const res = await http.get<Epic[]>(`/epics/project/${projectId}`)
    return res.data;
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function storeEpics(forms: EpicForm[]): Promise<Epic[]> {
  try {
    const res = await http.post<Epic[]>(`/epics/bulk`, {
      epics: forms
    })
    return res.data;
  } catch (error) {
    console.error(error)
    return []
  }
}
