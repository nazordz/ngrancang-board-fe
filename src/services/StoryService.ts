import { FilterFetchStories, Story, StoryForm } from "@/models";
import http from "@/utils/http";

export async function fetchStoriesByProject(filters: FilterFetchStories) {
  try {
    var params = {
      epic_id: filters.epicId,
      sprint_id: filters.sprintId,
      show_backlog_only: filters.showBacklogOnly
    }
    const { data } = await http.get<Story[]>(`/stories/project/${filters.projectId}`, { params })
    return data;
  } catch (error) {
    return [];
  }
}

export async function getStoryById(id:string) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiI2MmRlNWQ2Ni1kODBjLTQyYzQtYTBhMy0wODFiOWQyYTJiNDUiLCJzdWIiOiJuYXpvci5kekBnbWFpbC5jb20iLCJpYXQiOjE2ODg0NDAyNTksImV4cCI6MTY4ODUyNjY1OSwidXNlciI6eyJpZCI6IjYyZGU1ZDY2LWQ4MGMtNDJjNC1hMGEzLTA4MWI5ZDJhMmI0NSIsIm5hbWUiOiJOYXpvciIsInBvc2l0aW9uIjoiSVQgTGVhZCIsImVtYWlsIjoibmF6b3IuZHpAZ21haWwuY29tIiwicGhvbmUiOiIwODEyODc2MTc4MDciLCJpc19hY3RpdmUiOnRydWUsImNyZWF0ZWRfYXQiOjE2ODA0MjI3ODQwMDAsInVwZGF0ZWRfYXQiOjE2ODA0MjI3ODQwMDAsInJvbGVzIjpbeyJpZCI6IjA4OWVhNDk2LTA5M2YtNGUzYS1hMDYyLTM5NDFkMTUxNGM0YyIsIm5hbWUiOiJST0xFX0FETUlOIiwiY3JlYXRlZF9hdCI6MTY4MDAyNzU2NzAwMCwidXBkYXRlZF9hdCI6MTY4MDAyNzU2NzAwMH0seyJpZCI6IjIyOGZjMjZlLTNmODgtNGVlNS1iYTkzLWFjZTJmYWI0ZjNkNyIsIm5hbWUiOiJST0xFX1VTRVIiLCJjcmVhdGVkX2F0IjoxNjgwMDI3NTY3MDAwLCJ1cGRhdGVkX2F0IjoxNjgwMDI3NTY3MDAwfV0sInByb2plY3RzIjpbXSwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfQURNSU4ifSx7ImF1dGhvcml0eSI6IlJPTEVfVVNFUiJ9XSwiYWNjb3VudF9ub25fZXhwaXJlZCI6dHJ1ZSwiYWNjb3VudF9ub25fbG9ja2VkIjp0cnVlLCJjcmVkZW50aWFsc19ub25fZXhwaXJlZCI6dHJ1ZSwidXNlcm5hbWUiOiJuYXpvci5kekBnbWFpbC5jb20iLCJlbmFibGVkIjp0cnVlfX0.GJkJfdf6DuyBHPsHu0JdX8dY3KZx4gTGsO9i1urqt0_TUi2VBbHPvggSNWAAFi2fVGbSVbtY_j3KAM9iOz-U6Q");

  var requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const result: Story = await fetch("http://localhost:8080/api/stories/c2104945-c00a-42dc-a114-d6194d09e3bb", requestOptions)
    .then(response => response.json())
  console.log(result)
  return result
}

export async function fetchStoryById(id: string) {
  try {
    const response = await http.get<Story>(`/stories/${id}`)
    return response.data;
  } catch (error) {
    console.error(error)
    return null;
  }
}

export async function updateStory(form: StoryForm, id: string) {
  try {
    const { data } = await http.put<Story>(`/stories/${id}`, form)
    return data;
  } catch (error) {
    console.error(error)
    return null;
  }
}


export async function deleteStoryById(storyId: string) {
  try {
    await http.delete(`/stories/${storyId}`)
  } catch (error) {
    console.error(error)
  }
}
