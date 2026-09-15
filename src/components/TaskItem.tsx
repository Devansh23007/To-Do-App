import { useState } from "react";
import type {
  Category,
  Priority,
  Recurrence,
  Task,
} from "../types";

type TaskItemProps = {
  task: Task;
  toggleTask: (createdAt: number) => void;
  togglePin: (createdAt: number) => void;
  deleteTask: (createdAt: number) => void;
  editTask: (
  createdAt: number,
  newText: string,
  newPriority: Priority,
  newCategory: Category,
  newDueDate: string | null,
  newRecurrence: Recurrence,
  newTags: string[]
  ) => void;
};

function TaskItem({
  task,
  toggleTask,
  togglePin,
  deleteTask,
  editTask,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [editCategory, setEditCategory] = useState<Category>(task.category);
  const [editDueDate, setEditDueDate] = useState(task.dueDate ?? "");
  const [editRecurrence, setEditRecurrence] = useState<Recurrence>(task.recurrence);
  const [editTags, setEditTags] = useState(task.tags.join(", "));

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
  editDueDate || null,
  editRecurrence,
  editTags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "")
);
  setIsEditing(false);
};

const handleCancel = () => {
  setEditText(task.text);
  setEditPriority(task.priority);
  setEditCategory(task.category);
  setEditDueDate(task.dueDate ?? "");
  setEditRecurrence(task.recurrence);
  setEditTags(task.tags.join(", "));
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
    <li className="task-item editing">
      <div className="edit-task-form">
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
          <option value="general">General</option>
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

        <select
          value={editRecurrence}
          onChange={(event) =>
            setEditRecurrence(event.target.value as Recurrence)
          }
        >
          <option value="none">No repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <input
  type="text"
  placeholder="Tags (comma separated)"
  value={editTags}
  onChange={(event) => setEditTags(event.target.value)}
/>

        <div className="edit-task-actions">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
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

        <button
  type="button"
  onClick={() => togglePin(task.createdAt)}
  title={task.pinned ? "Unpin task" : "Pin task"}
>
  {task.pinned ? "★" : "☆"}
</button>
      </div>
    </div>

    {task.tags.length > 0 && (
  <div className="task-tags">
    {task.tags.map((tag) => (
      <span key={tag} className="task-tag">
        {tag}
      </span>
    ))}
  </div>
)}
  </li>
);
}

export default TaskItem;