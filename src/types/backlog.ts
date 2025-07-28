export type TaskStatus = 'todo' | 'doing' | 'testing' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskType = 'bug' | 'feature' | 'improvement' | 'technical-debt';

export interface BacklogItem {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  dueDate?: string;
  epic?: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
  subtasks?: BacklogItem[];
  tags?: string[];
  softDeleted?: boolean;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface BacklogGroup {
  id: string;
  title: string;
  color: string;
  collapsed: boolean;
  items: BacklogItem[];
}

export interface IdeaSubmission {
  title: string;
  description: string;
  department: string;
  impact: 'low' | 'medium' | 'high';
}

export type ViewMode = 'table' | 'kanban' | 'calendar' | 'timeline';

export interface FilterState {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  type?: TaskType[];
  assignee?: string[];
  search?: string;
}