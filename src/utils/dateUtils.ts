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