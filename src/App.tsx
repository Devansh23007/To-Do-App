import { useEffect, useState } from "react";
import Header from "./components/Header";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import "./App.css";
import type { Category, Priority, Task } from "./types";
import { loadTasks, saveTasks } from "./storage";

type Filter = "all" | "active" | "completed";
type PriorityFilter = "all" | Priority;
type CategoryFilter = "all" | Category;
type SortOption = "newest" | "oldest" | "priority" | "dueDate";

function App() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("other");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
  const loadSavedTasks = async () => {
    const savedTasks = await loadTasks();

    setTasks(savedTasks);
    setTasksLoaded(true);
  };

  loadSavedTasks();
}, []);
useEffect(() => {
  if (!tasksLoaded) {
    return;
  }

  saveTasks(tasks);
}, [tasks, tasksLoaded]);
  const [dueDate, setDueDate] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  const addTask = () => {
    if (task.trim() === "") {
      return;
    }

const newTask: Task = {
  text: task.trim(),
  completed: false,
  priority,
  category,
  dueDate: dueDate || null,
  createdAt: Date.now(),
};

    setTasks([...tasks, newTask]);
    setTask("");
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

    const matchesCategory =
      categoryFilter === "all" ||
      task.category === categoryFilter;

    return (
      matchesSearch &&
      matchesFilter &&
      matchesPriority &&
      matchesCategory
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



return (
  <div className={`app ${darkMode ? "dark" : ""}`}>
    <Header />
    <button
  className="theme-button"
  onClick={() => setDarkMode(!darkMode)}
>
  {darkMode ? "Light Mode" : "Dark Mode"}
</button>

    <main className="main-content">
  <AddTask
  task={task}
  setTask={setTask}
  priority={priority}
  setPriority={setPriority}
  category={category}
  setCategory={setCategory}
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

  <div className="filter-select">
    <label htmlFor="category-filter">
      Category:
    </label>

    <select
      id="category-filter"
      value={categoryFilter}
      onChange={(event) =>
        setCategoryFilter(
          event.target.value as CategoryFilter
        )
      }
    >
      <option value="all">All</option>
      <option value="work">Work</option>
      <option value="study">Study</option>
      <option value="personal">Personal</option>
      <option value="project">Project</option>
      <option value="other">Other</option>
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
    </main>
  </div>
);
}

export default App;