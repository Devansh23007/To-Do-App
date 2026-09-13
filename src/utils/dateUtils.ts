import type { Recurrence } from "../types";

export const getToday = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const isToday = (dueDate: string | null): boolean => {
  if (!dueDate) {
    return false;
  }

  return dueDate === getToday();
};

export const isOverdue = (
  dueDate: string | null,
  completed: boolean
): boolean => {
  if (!dueDate || completed) {
    return false;
  }

  return dueDate < getToday();
};

export const isUpcoming = (
  dueDate: string | null,
  completed: boolean
): boolean => {
  if (!dueDate || completed) {
    return false;
  }

  return dueDate > getToday();
};

export const getNextDueDate = (
  dueDate: string | null,
  recurrence: Recurrence
): string | null => {
  if (!dueDate || recurrence === "none") {
    return null;
  }

  const date = new Date(`${dueDate}T00:00:00`);

  if (recurrence === "daily") {
    date.setDate(date.getDate() + 1);
  }

  if (recurrence === "weekly") {
    date.setDate(date.getDate() + 7);
  }

  if (recurrence === "monthly") {
    date.setMonth(date.getMonth() + 1);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};