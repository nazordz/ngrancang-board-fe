import { ActiveSprintLog, CreateActiveSprintLogRequest, CreateSprintRequest, Sprint } from "@/models";
import http from "@/utils/http";

export async function fetchSprintsByProjectId(projectId: string) {
  try {
    const { data } = await http.get<Sprint[]>(`/sprints/project/${projectId}`);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
export async function fetchEndedSprintsByProjectId(projectId: string) {
  try {
    const { data } = await http.get<Sprint[]>(`/sprints/project/${projectId}`, {
      params: {
        has_ended: "yes"
      }
    });
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function createSprint(form: CreateSprintRequest) {
  try {
    const { data } = await http.post<Sprint>("/sprints", form);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function startSprint(sprintId:string) {
  try {
    const { data } = await http.patch<Sprint>(`/sprints/${sprintId}/start`);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function endSprint(sprintId:string) {
  try {
    const { data } = await http.patch<Sprint>(`/sprints/${sprintId}/end`);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchActiveSprint(projectId: string) {
  try {
    const { data } = await http.get<Sprint>(`/sprints/${projectId}/active`);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function fetchSprintById(sprintId: string) {
  try {
    const { data } = await http.get<Sprint>(`/sprints/${sprintId}`);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createActiveSprintLog(request: CreateActiveSprintLogRequest): Promise<ActiveSprintLog | null> {
  try {
    const { data } = await http.post<ActiveSprintLog>("/active-sprint-log", request)
    return data;
  } catch (error) {
    return null;
  }
}

export async function fetchVelocityReport(projectId: string) {
  try {
    const { data } = await http.get<Sprint[]>(`/sprints/project/${projectId}/velocity-chart`);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
