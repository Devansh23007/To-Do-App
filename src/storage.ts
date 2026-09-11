import { load } from "@tauri-apps/plugin-store";
import type { Task } from "./types";

const getStore = async () => {
  return await load("tasks.json");
};

export const saveTasks = async (tasks: Task[]) => {
  try {
    const store = await getStore();

    await store.set("tasks", tasks);
    await store.save();
  } catch (error) {
    console.error("Failed to save tasks:", error);
  }
};

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const store = await getStore();

    const tasks = await store.get<Task[]>("tasks");

    return tasks ?? [];
  } catch (error) {
    console.error("Failed to load tasks:", error);

    return [];
  }
};

export const saveDarkMode = async (darkMode: boolean) => {
  try {
    const store = await getStore();

    await store.set("darkMode", darkMode);
    await store.save();
  } catch (error) {
    console.error("Failed to save theme:", error);
  }
};

export const loadDarkMode = async (): Promise<boolean> => {
  try {
    const store = await getStore();

    const darkMode = await store.get<boolean>("darkMode");

    return darkMode ?? false;
  } catch (error) {
    console.error("Failed to load theme:", error);

    return false;
  }
};