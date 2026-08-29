import { load } from "@tauri-apps/plugin-store";
import type { Task } from "./types";

const getStore = async () => {
  return await load("tasks.json");
};

export const saveTasks = async (tasks: Task[]) => {
  const store = await getStore();

  await store.set("tasks", tasks);
  await store.save();
};

export const loadTasks = async (): Promise<Task[]> => {
  const store = await getStore();

  const tasks = await store.get<Task[]>("tasks");

  return tasks ?? [];
};  