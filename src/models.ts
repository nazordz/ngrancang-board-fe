import { SvgIconComponent } from "@mui/icons-material";

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface Role {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}
export type Authority = "ROLE_ADMIN" | "ROLE_USER";

export interface Authorities {
  authorities: Authority;
}

export interface ISignupRequest {
  name: string;
  email: string;
  phone: string;
  position: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  roles: Role[];
  projects: Project[];
  username: string;
  account_non_expired: boolean;
  account_non_locked: boolean;
  credentials_non_expired: boolean;
  authorities: Authorities;
  enabled: boolean;
}

export interface JwtPayload {
  jti: string;
  sub: string;
  iat: Date;
  exp: Date;
  user: User;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  avatar: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface IMenu {
  link: string;
  icon: SvgIconComponent;
  title: string;
  roles: string[];
}

export interface FormProjectRequest {
  name: string;
  description: string;
  key: string;
  avatar: File | null;
}

export interface Pagination<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: Sort;
  empty: boolean;
}

export interface Epic {
  id: string;
  user_id: string;
  key: string;
  project_id: string;
  summary: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Sprint {
  id: string;
  project_id: string;
  user_id: string;
  sprint_name: string;
  start_date: string;
  end_date: string;
  actual_start_date: string | null;
  actual_end_date: string | null;
  is_running: boolean;
  sprint_goal: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  stories: Story[];
}

export enum IssuePriorityEnum {
  Highest = "HIGHEST",
  High = "HIGH",
  Medium = "MEDIUM",
  Low = "LOW",
  Lowest = "LOWEST",
}

export enum IssueStatusEnum {
  Todo = "TODO",
  InProgress = "IN_PROGRESS",
  Review = "REVIEW",
  Done = "DONE",
}

export interface Story {
  id: string;
  key: string;
  sequence: number;
  user_id: string;
  user: User;
  sprint_id: string | null;
  sprint: Sprint | null;
  project_id: string;
  project: Project;
  priority: IssuePriorityEnum;
  status: IssueStatusEnum;
  summary: string;
  assignee_id: string | null;
  assignee: User | null;
  attachments: string;
  description: string;
  story_point: number;
  epic: Epic;
  epic_id: string;
  sub_tasks: SubTask[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface Pageable {
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface InputStory {
  id: string;
  summary: string;
  draft: boolean;
  sequence: number;
  sprint_id: string | null;
  is_backlog: boolean;
  status?: IssueStatusEnum
}

export interface DroppableSprint extends Sprint {
  inputStories: InputStory[];
}

export interface UpdateStorySequenceRequest {
  stories: Story[];
}

export interface SubTask {
  id: string;
  key: string;
  story_id: string;
  story: Story;
  attachments: string | null;
  description: string;
  status: string;
  assignee_id: string | null;
  assignee: User | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user_id: string;
  sequence: number;
}

export interface InputSubTask {
  id: string;
  description: string;
  draft: boolean;
  isEditing: boolean;
  sequence: number;
  assignee_id: string | null;
  avatarAnchorEl: HTMLButtonElement | null;
}

export interface StoryForm {
  summary: string;
  description: string;
  priority: IssuePriorityEnum;
  status: IssueStatusEnum;
  assignee_id: string;
  story_point: number;
  sprint: string;
  epic_id: string;
}

export interface FilterFetchStories {
  projectId: string;
  sprintId?: string;
  epicId?: string;
  showBacklogOnly?: boolean;
}

export interface CreateSprintRequest {
  project_id: string;
  user_id: string;
  sprint_name: string;
  sprint_goal: string;
  start_date: string;
  end_date: string;
}

export interface EpicForm {
  key: string;
  summary: string;
  project_id: string;
}

export interface UserProfileForm {
  name: string;
  position: string;
  email: string;
  phone: string;
  changePassword: boolean;
  newPassword: string;
}
