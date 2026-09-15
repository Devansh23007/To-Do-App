import type {
  Category,
  Priority,
  Recurrence,
} from "../types";


type AddTaskProps = {
  task: string;
  setTask: (task: string) => void;

  priority: Priority;
  setPriority: (priority: Priority) => void;

  category: Category;

  recurrence: Recurrence;
  setRecurrence: (recurrence: Recurrence) => void;

  addTask: () => void;

  dueDate: string;
  setDueDate: (dueDate: string) => void;

  reminder: string;
  setReminder: (value: string) => void;

  tags: string;
  setTags: (tags: string) => void;
};

function AddTask({
  task,
  setTask,
  priority,
  setPriority,
  category,
  recurrence,
  setRecurrence,
  dueDate,
  setDueDate,
  tags,
  setTags,
  addTask,
  reminder,
  setReminder,
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

      <input
        type="date"
        value={dueDate}
        onChange={(event) => setDueDate(event.target.value)}
      />

      <select
  value={recurrence}
  onChange={(event) =>
    setRecurrence(event.target.value as Recurrence)
  }
>
  <option value="none">No repeat</option>
  <option value="daily">Daily</option>
  <option value="weekly">Weekly</option>
  <option value="monthly">Monthly</option>
</select>

<input
  type="time"
  value={reminder}
  onChange={(event) => setReminder(event.target.value)}
/>

<input
  type="text"
  placeholder="Tags (comma separated)"
  value={tags}
  onChange={(event) => setTags(event.target.value)}
/>

      <button onClick={addTask}>
        Add
      </button>
    </div>
  );
}

export default AddTask;