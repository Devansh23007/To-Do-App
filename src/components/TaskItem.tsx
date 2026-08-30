import { useState } from "react";
import type { Category, Priority, Task } from "../types";

type TaskItemProps = {
  task: Task;
  toggleTask: (createdAt: number) => void;
  deleteTask: (createdAt: number) => void;
  editTask: (
  createdAt: number ,
  newText: string,
  newPriority: Priority,
  newCategory: Category,
  newDueDate: string | null
) => void;
};

function TaskItem({
  task,
  toggleTask,
  deleteTask,
  editTask,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editCategory, setEditCategory] = useState<Category>(task.category);
  const [editDueDate, setEditDueDate] = useState(task.dueDate ?? "");

  const handleSave = () => {
    const trimmedText = editText.trim();

    if (trimmedText === "") {
      deleteTask(task.createdAt);
      return;
    }

    editTask(
  task.createdAt,
  trimmedText,
  editPriority,
  editCategory,
  editDueDate || null
);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setEditPriority(task.priority);
    setIsEditing(false);
    setEditDueDate(task.dueDate ?? "");
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

        <input
          type="date"
          value={editDueDate}
          onChange={(event) => setEditDueDate(event.target.value)}
        />

        <button onClick={handleSave}>Save</button>

        <button onClick={handleCancel}>Cancel</button>
      </li>
    );
  }

  return (
  <li className="task-item">
    <div className="task-main">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask(task.createdAt)}
      />

      <div className="task-info">
        <span className={task.completed ? "completed" : ""}>
          {task.text}
        </span>

        {task.dueDate && (
          <span className="due-date">
            Due: {task.dueDate}
          </span>
        )}
      </div>
    </div>

    <div className="task-right">
      <span className={`priority priority-${task.priority}`}>
        {task.priority}
      </span>

      <div className="task-actions">
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>

        <button onClick={() => deleteTask(task.createdAt)}>
          Delete
        </button>
      </div>
    </div>
  </li>
);
}

export default TaskItem;