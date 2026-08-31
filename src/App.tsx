import { useEffect, useState } from "react";
import Header from "./components/Header";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import Sidebar from "./components/Sidebar";
import "./App.css";
import type { Category, Priority, Task } from "./types";
import { loadTasks, saveTasks, loadDarkMode, saveDarkMode } from "./storage";
import ModulePage from "./components/ModulePage";

type Filter = "all" | "active" | "completed";
type PriorityFilter = "all" | Priority;
type SortOption = "newest" | "oldest" | "priority" | "dueDate";

function App() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
  const loadSavedData = async () => {
    const savedTasks = await loadTasks();
    const savedDarkMode = await loadDarkMode();

    setTasks(savedTasks);
    setDarkMode(savedDarkMode);
    setTasksLoaded(true);
  };

  loadSavedData();
}, []);
useEffect(() => {
  if (!tasksLoaded) {
    return;
  }

  saveTasks(tasks);
}, [tasks, tasksLoaded]);
useEffect(() => {
  if (!tasksLoaded) {
    return;
  }

  saveDarkMode(darkMode);
}, [darkMode, tasksLoaded]);
  const [dueDate, setDueDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [currentPage, setCurrentPage] = useState<
    "main" | "modules"
    >("main");

  const [activeModule, setActiveModule] = useState<Category | null>(null);

 const addTask = () => {
  if (task.trim() === "") {
    return;
  }

  const newTask: Task = {
    text: task.trim(),
    completed: false,
    priority,
    category: "general",
    dueDate: dueDate || null,
    createdAt: Date.now(),
  };

  setTasks((currentTasks) => [
    ...currentTasks,
    newTask,
  ]);

  setTask("");
  setDueDate("");
  setPriority("medium");
};

const editTask = (
  createdAt: number,
  newText: string,
  newPriority: Priority,
  newCategory: Category,
  newDueDate: string | null
) => {
  setTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.createdAt === createdAt
        ? {
            ...task,
            text: newText,
            priority: newPriority,
            category: newCategory,
            dueDate: newDueDate,
          }
        : task
    )
  );
};

const toggleTask = (createdAt: number) => {
  setTasks((currentTasks) =>
    currentTasks.map((task) =>
      task.createdAt === createdAt
        ? { ...task, completed: !task.completed }
        : task
    )
  );
};

const deleteTask = (createdAt: number) => {
  setTasks((currentTasks) =>
    currentTasks.filter((task) => task.createdAt !== createdAt)
  );
};

const filteredTasks = tasks
  .filter((task) => {
    const matchesSearch = task.text
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed);

    const matchesPriority =
      priorityFilter === "all" ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesFilter &&
      matchesPriority
    );
  })
  .sort((a, b) => {
    if (sortOption === "newest") {
  return b.createdAt - a.createdAt;
}

if (sortOption === "oldest") {
  return a.createdAt - b.createdAt;
}

    if (sortOption === "priority") {
      const priorityValue = {
        high: 1,
        medium: 2,
        low: 3,
      };

      return (
        priorityValue[a.priority] -
        priorityValue[b.priority]
      );
    }

    if (sortOption === "dueDate") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      return a.dueDate.localeCompare(b.dueDate);
    }

    return 0;
  });

const completedCount = tasks.filter(
  (task) => task.completed
).length;

const activeCount = tasks.length - completedCount;

const clearCompleted = () => {
  setTasks((currentTasks) =>
    currentTasks.filter((task) => !task.completed)
  );
};

const modules: {
  category: Category;
  name: string;
  description: string;
}[] = [
  {
    category: "work",
    name: "Work",
    description: "Tasks related to your work.",
  },
  {
    category: "study",
    name: "Study",
    description: "Tasks related to learning and study.",
  },
  {
    category: "personal",
    name: "Personal",
    description: "Personal tasks and activities.",
  },
  {
    category: "project",
    name: "Project",
    description: "Tasks related to your projects.",
  },
  {
    category: "other",
    name: "Other",
    description: "Everything else.",
  },
];

const addModuleTask = () => {
  if (!activeModule || task.trim() === "") {
    return;
  }

  const newTask: Task = {
    text: task.trim(),
    completed: false,
    priority,
    category: activeModule,
    dueDate: dueDate || null,
    createdAt: Date.now(),
  };

  setTasks((currentTasks) => [
    ...currentTasks,
    newTask,
  ]);

  setTask("");
  setDueDate("");
};

const openModule = (category: Category) => {
  setActiveModule(category);
  setCurrentPage("modules");

  setTask("");
  setDueDate("");
  setPriority("medium");
};

const closeModule = () => {
  setActiveModule(null);
  setCurrentPage("modules");
};


return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <main className="main-content">
       {currentPage === "main" ? (
        <>
        <div className="page-header">
    <Header />
    <button
  className="theme-button"
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "Light Mode" : "Dark Mode"}
</button>
</div>
  <AddTask
  task={task}
  setTask={setTask}
  priority={priority}
  setPriority={setPriority}
  category="general"
  dueDate={dueDate}
  setDueDate={setDueDate}
  addTask={addTask}
/>

<div className="search-box">
  <input
    type="text"
    placeholder="Search tasks..."
    value={searchText}
    onChange={(event) => setSearchText(event.target.value)}
  />
</div>

<div className="filter-buttons">
  <button
    className={filter === "all" ? "active" : ""}
    onClick={() => setFilter("all")}
  >
    All
  </button>

  <button
    className={filter === "active" ? "active" : ""}
    onClick={() => setFilter("active")}
  >
    Active
  </button>

  <button
    className={filter === "completed" ? "active" : ""}
    onClick={() => setFilter("completed")}
  >
    Completed
  </button>
</div>

<div className="advanced-filters">
  <div className="filter-select">
    <label htmlFor="priority-filter">
      Priority:
    </label>

    <select
      id="priority-filter"
      value={priorityFilter}
      onChange={(event) =>
        setPriorityFilter(
          event.target.value as PriorityFilter
        )
      }
    >
      <option value="all">All</option>
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
  </div>
</div>

<div className="task-summary">
  <span>Total: {tasks.length}</span>
  <span>Active: {activeCount}</span>
  <span>Completed: {completedCount}</span>

  {completedCount > 0 && (
    <button onClick={clearCompleted}>
      Clear completed
    </button>
  )}
</div>

<div className="sort-box">
  <label htmlFor="sort">Sort by:</label>

  <select
    id="sort"
    value={sortOption}
    onChange={(event) =>
      setSortOption(event.target.value as SortOption)
    }
  >
    <option value="newest">Newest</option>
    <option value="oldest">Oldest</option>
    <option value="priority">Priority</option>
    <option value="dueDate">Due date</option>
  </select>
</div>

<TaskList 
  tasks={filteredTasks} 
  toggleTask={toggleTask} 
  deleteTask={deleteTask} 
  editTask={editTask} 
/> 
    </>
    ) : activeModule ? (
  <ModulePage
    category={activeModule}
    tasks={tasks.filter(
      (task) => task.category === activeModule
    )}
    task={task}
    setTask={setTask}
    priority={priority}
    setPriority={setPriority}
    dueDate={dueDate}
    setDueDate={setDueDate}
    addTask={addModuleTask}
    toggleTask={toggleTask}
    deleteTask={deleteTask}
    editTask={editTask}
    onBack={closeModule}
  />
) : (
  <div className="module-page">
    <div className="page-header">
      <div>
        <h1>Modules</h1>
        <p>Organize your tasks by area.</p>
      </div>
    </div>

    <div className="module-grid">
      <button
        className="module-card"
        onClick={() => openModule("work")}
      >
        <h2>Work</h2>
        <p>Work related tasks</p>
      </button>

      <button
        className="module-card"
        onClick={() => openModule("study")}
      >
        <h2>Study</h2>
        <p>Study and learning tasks</p>
      </button>

      <button
        className="module-card"
        onClick={() => openModule("personal")}
      >
        <h2>Personal</h2>
        <p>Personal tasks</p>
      </button>

      <button
        className="module-card"
        onClick={() => openModule("project")}
      >
        <h2>Project</h2>
        <p>Project related tasks</p>
      </button>

      <button
        className="module-card"
        onClick={() => openModule("other")}
      >
        <h2>Other</h2>
        <p>Everything else</p>
      </button>
    </div>
  </div>
)}
</main>
  </div>
);
}

export default App;