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

export const saveDarkMode = async (darkMode: boolean) => {
  const store = await getStore();

  await store.set("darkMode", darkMode);
  await store.save();
};

export const loadDarkMode = async (): Promise<boolean> => {
  const store = await getStore();

  const darkMode = await store.get<boolean>("darkMode");

  return darkMode ?? false;
};