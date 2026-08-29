export type Priority = "low" | "medium" | "high";

export type Task = {
  text: string;
  completed: boolean;
  priority: Priority;
};