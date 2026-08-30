import type { Priority } from "../types";

type AddTaskProps = {
  task: string;
  setTask: (task: string) => void;
  priority: Priority;
  setPriority: (priority: Priority) => void;
  addTask: () => void;
  dueDate: string;
  setDueDate: (dueDate: string) => void;
};

function AddTask({
  task,
  setTask,
  priority,
  setPriority,
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
        className="task-input"
        type="text"
        placeholder="What needs to be done?"
        value={task}
        onChange={(event) => setTask(event.target.value)}
        onKeyDown={handleKeyDown}
      />

      <select
        className="priority-select"
        value={priority}
        onChange={(event) =>
          setPriority(event.target.value as Priority)
        }
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        className="date-input"
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
      />

      <button className="add-button" onClick={addTask}>
        Enter
      </button>
    </div>
  );
}

export default AddTask;