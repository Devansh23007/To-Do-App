import { useState } from "react";
import type { Category, Priority, Task } from "../types";

type TaskItemProps = {
  task: Task;
  index: number;
  toggleTask: (index: number) => void;
  deleteTask: (index: number) => void;
  editTask: (
  index: number,
  newText: string,
  newPriority: Priority,
  newCategory: Category
) => void;
};

function TaskItem({
  task,
  index,
  toggleTask,
  deleteTask,
  editTask,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editCategory, setEditCategory] = useState<Category>(
    task.category
  );

  const handleSave = () => {
    const trimmedText = editText.trim();

    if (trimmedText === "") {
      deleteTask(index);
      return;
    }

    editTask(
  index,
  trimmedText,
  editPriority,
  editCategory
);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditPriority(task.priority);
    setIsEditing(false);
  };

  const handleEditKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      handleSave();
    }

    if (event.key === "Escape") {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <li className="task-item">
        <input
          type="text"
          value={editText}
          onChange={(event) => setEditText(event.target.value)}
          onKeyDown={handleEditKeyDown}
          autoFocus
        />

        <select
          value={editPriority}
          onChange={(event) =>
            setEditPriority(event.target.value as Priority)
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={editCategory}
          onChange={(event) =>
            setEditCategory(event.target.value as Category)
          }
        >
          <option value="work">Work</option>
          <option value="study">Study</option>
          <option value="personal">Personal</option>
          <option value="project">Project</option>
          <option value="other">Other</option>
        </select>

        <button onClick={handleSave}>Save</button>

        <button onClick={handleCancel}>Cancel</button>
      </li>
    );
  }

  return (
    <li className="task-item">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask(index)}
      />

      <span className={task.completed ? "completed" : ""}>
        {task.text}
      </span>

      <span className={`priority priority-${task.priority}`}>
        {task.priority}
      </span>

      <span className="category">
        {task.category}
      </span>

      <button onClick={() => setIsEditing(true)}>
        Edit
      </button>

      <button onClick={() => deleteTask(index)}>
        Delete
      </button>
    </li>
  );
}

export default TaskItem;