import type { Category, Priority } from "../types";

type AddTaskProps = {
  task: string;
  setTask: (task: string) => void;
  priority: Priority;
  setPriority: (priority: Priority) => void;
  category: Category;
  setCategory: (category: Category) => void;
  addTask: () => void;
  dueDate: string;
  setDueDate: (dueDate: string) => void;
};

function AddTask({
  task,
  setTask,
  priority,
  setPriority,
  category,
  setCategory,
  dueDate,
  setDueDate,
  addTask,
}: AddTaskProps) {
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  return (
    <div className="add-task">
      <input
        type="text"
        placeholder="What needs to be done?"
        value={task}
        onChange={(event) => setTask(event.target.value)}
        onKeyDown={handleKeyDown}
      />

      <select
        value={priority}
        onChange={(event) =>
          setPriority(event.target.value as Priority)
        }
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <select
        value={category}
        onChange={(event) =>
          setCategory(event.target.value as Category)
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
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
      />

      <button onClick={addTask}>Add</button>
    </div>
  );
}

export default AddTask;