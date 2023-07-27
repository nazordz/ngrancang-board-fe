import { InputSubTask, SubTask } from "@/models";
import http from "@/utils/http";

export async function storeSimpleSubTask(storyId: string, description: string) {
  try {
    const { data } = await http.post<SubTask>(`/subtasks/store-simple`, {
      story_id: storyId,
      description
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateDescriptionSubTask(subTaskId: string, description: string) {
  try {
    const { data } = await http.patch<SubTask>(`/subtasks/update-description/${subTaskId}`, {
      description
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateAssigneeSubTask(subTaskId: string, assigneeId: string) {
  try {
    const { data } = await http.patch<SubTask>(`/subtasks/update-assignee/${subTaskId}`, {
      assignee_id: assigneeId
    });
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateListSubTaskSequence(subtasks: InputSubTask[]): Promise<SubTask[]> {
  try {
    const { data } = await http.put<SubTask[]>(`/subtasks/update-list-subtask`,{
      subtasks
    });
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
