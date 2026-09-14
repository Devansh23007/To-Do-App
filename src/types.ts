export type Priority = "low" | "medium" | "high";

export type Category =
  | "general"
  | "work"
  | "study"
  | "personal"
  | "project"
  | "other";

export type Recurrence =
  | "none"
  | "daily"
  | "weekly"
  | "monthly";

export type Task = {
  text: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  dueDate: string | null;
  recurrence: Recurrence;
  reminder: string | null;
  pinned: boolean;
  createdAt: number;
};