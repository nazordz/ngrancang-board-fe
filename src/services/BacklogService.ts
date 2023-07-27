import { InputStory, Sprint, Story } from "@/models";
import http from "@/utils/http";

export async function fetchStoryByProjectId(projectId: string) {
  try {
    var req = await http.get<Story[]>(`/stories/project/${projectId}`)
    return req.data
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function fetchSprintWithStoriesByProjectId(projectId: string) {
  try {
    var req = await http.get<Sprint[]>(`/sprints/project/${projectId}/stories`)
    return req.data
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function storeSimpleStory(id: string, summary: String, projectId: string) {
  try {
    const { data } = await http.post<Story>('/stories/simple-story', {
      id, summary, "project_id": projectId
    })
    return data;
  } catch (error) {
    console.warn(error)
    return null
  }
}

export async function updateListStory(stories: InputStory[], sprintId: string | null = null): Promise<Story[]> {
  try {
    const { data } = await http.put<Story[]>(`/stories/update-list-story`, {
      stories, sprint_id: sprintId
    })
    return data;
  } catch (error) {
    console.warn(error)
    return []
  }
}

export async function updateListStoryInActiveSprint(stories: Story[], sprintId: string | null = null): Promise<Story[]> {
  try {
    const { data } = await http.put<Story[]>(`/stories/update-list-story-active-sprint`, {
      stories, sprint_id: sprintId
    })
    return data;
  } catch (error) {
    console.warn(error)
    return []
  }
}
