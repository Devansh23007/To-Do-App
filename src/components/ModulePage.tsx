import AddTask from "./AddTask";
import TaskList from "./TaskList";
import type { Category, Priority, Task } from "../types";

type ModulePageProps = {
  category: Category;
  tasks: Task[];

  task: string;
  setTask: (task: string) => void;

  priority: Priority;
  setPriority: (priority: Priority) => void;

  dueDate: string;
  setDueDate: (dueDate: string) => void;

  addTask: () => void;

  toggleTask: (createdAt: number) => void;
  deleteTask: (createdAt: number) => void;

  editTask: (
    createdAt: number,
    newText: string,
    newPriority: Priority,
    newCategory: Category,
    newDueDate: string | null
  ) => void;

  onBack: () => void;
};

const moduleNames: Record<Category, string> = {
  general: "General",
  work: "Work",
  study: "Study",
  personal: "Personal",
  project: "Project",
  other: "Other",
};

function ModulePage({
  category,
  tasks,
  task,
  setTask,
  priority,
  setPriority,
  dueDate,
  setDueDate,
  addTask,
  toggleTask,
  deleteTask,
  editTask,
  onBack,
}: ModulePageProps) {
  const moduleName = moduleNames[category];

  return (
    <div className="module-page">
      <button className="back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="module-header">
        <h1>{moduleName}</h1>
        <p>Tasks in your {moduleName.toLowerCase()} module.</p>
      </div>

      <AddTask
        task={task}
        setTask={setTask}
        priority={priority}
        setPriority={setPriority}
        category={category}
        dueDate={dueDate}
        setDueDate={setDueDate}
        addTask={addTask}
      />

      <TaskList
        tasks={tasks}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    </div>
  );
}

export default ModulePage;