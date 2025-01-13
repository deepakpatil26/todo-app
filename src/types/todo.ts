export type Priority = "low" | "medium" | "high";
export type Category = string;

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  categories: Category[];
  createdAt: string;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
}
