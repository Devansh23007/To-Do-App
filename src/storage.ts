import { load } from "@tauri-apps/plugin-store";
import type { Recurrence, Task } from "./types";

const NOTIFIED_REMINDERS_KEY = "notifiedReminders";

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
  const store = await getStore();
  const tasks = await store.get<Task[]>("tasks");

  return (
    tasks?.map((task) => ({
      ...task,
      recurrence: task.recurrence ?? ("none" as Recurrence),
      reminder: task.reminder ?? null,
      pinned: task.pinned ?? false,
    })) ?? []
  );
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

export const loadNotifiedReminders = async (): Promise<string[]> => {
  const store = await getStore();
  return (await store.get<string[]>(NOTIFIED_REMINDERS_KEY)) ?? [];
};

export const saveNotifiedReminders = async (
  reminders: string[]
): Promise<void> => {
  const store = await getStore();
  await store.set(NOTIFIED_REMINDERS_KEY, reminders);
  await store.save();
};