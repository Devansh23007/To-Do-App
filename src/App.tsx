import { useEffect, useState } from "react";
import Header from "./components/Header";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import Sidebar from "./components/Sidebar";
import "./App.css";
import type {
  Category,
  Priority,
  Recurrence,
  Task,
} from "./types";
import { loadTasks, saveTasks, loadDarkMode, saveDarkMode , loadNotifiedReminders, saveNotifiedReminders,} from "./storage";
import {
  getToday,
  isToday,
  isUpcoming,
  isOverdue,
  getNextDueDate,
} from "./utils/dateUtils";
import ModulePage from "./components/ModulePage";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

type Filter = "all" | "active" | "completed";
type PriorityFilter = "all" | Priority;
type SortOption = "newest" | "oldest" | "priority" | "dueDate";

type TaskView = "all" | "today" | "upcoming" | "overdue";

function App() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [recurrence, setRecurrence] =
  useState<Recurrence>("none");
  const [reminder, setReminder] = useState<string>("");
  const [notifiedReminders, setNotifiedReminders] = useState<Set<string>>(
  new Set()
);
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
  "main" | "modules" | "taskView"
>("main");

const [taskView, setTaskView] = useState<TaskView>("all");

const [activeModule, setActiveModule] = useState<Category | null>(null);

const requestNotificationPermission = async () => {
  let permissionGranted = await isPermissionGranted();

  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === "granted";
  }

  return permissionGranted;
};  

useEffect(() => {
  const checkReminders = async () => {
    const now = new Date();

    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    const today = getToday();

    const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const tomorrowDate = `${tomorrow.getFullYear()}-${String(
  tomorrow.getMonth() + 1
).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

for (const task of tasks) {
  if (task.completed) {
    continue;
  }

  let notificationType: string | null = null;

  // Explicit reminder
  if (task.reminder && task.reminder === currentTime) {
    notificationType = "explicit";
  }

  // Automatic due-date notifications
  if (!task.reminder && task.dueDate && now.getHours() >= 9) {
    if (task.dueDate === tomorrowDate) {
      notificationType = "due-tomorrow";
    } else if (task.dueDate === today) {
      notificationType = "due-date";
    } else if (task.dueDate < today) {
      notificationType = "overdue";
    }
  }

  if (!notificationType) {
    continue;
  }

  const reminderId = `${task.createdAt}-${task.dueDate ?? "none"}-${task.reminder ?? "none"}-${notificationType}`;

  if (notifiedReminders.has(reminderId)) {
    continue;
  }

  const permissionGranted = await requestNotificationPermission();

  if (!permissionGranted) {
    continue;
  }

  let title = "Task Reminder";

  if (notificationType === "due-tomorrow") {
    title = "Task Due Tomorrow";
  } else if (notificationType === "due-date") {
    title = "Task Due Today";
  } else if (notificationType === "overdue") {
    title = "Task Overdue";
  }

  sendNotification({
    title,
    body: task.text,
  });

  setNotifiedReminders((current) => {
    const updated = new Set(current);
    updated.add(reminderId);

    saveNotifiedReminders(Array.from(updated));

    return updated;
  });
}
  };

  checkReminders();

  const interval = setInterval(checkReminders, 60 * 1000);

  return () => clearInterval(interval);
}, [tasks, notifiedReminders]);

useEffect(() => {
  const loadReminderHistory = async () => {
    const reminders = await loadNotifiedReminders();
    setNotifiedReminders(new Set(reminders));
  };

  loadReminderHistory();
}, []);

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
  recurrence,
  reminder: reminder || null,
  createdAt: Date.now(),
};

  setTasks((currentTasks) => [
    ...currentTasks,
    newTask,
  ]);

  setTask("");
  setDueDate("");
  setPriority("medium");
  setRecurrence("none");  
  setReminder("");
};

const editTask = (
  createdAt: number,
  newText: string,
  newPriority: Priority,
  newCategory: Category,
  newDueDate: string | null,
  newRecurrence: Recurrence
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
            recurrence: newRecurrence,
          }
        : task
    )
  );
};

const toggleTask = (createdAt: number) => {
  setTasks((currentTasks) => {
    const currentTask = currentTasks.find(
      (task) => task.createdAt === createdAt
    );

    if (!currentTask) {
      return currentTasks;
    }

    // If the task is already completed,
    // simply uncomplete it.
    if (currentTask.completed) {
      return currentTasks.map((task) =>
        task.createdAt === createdAt
          ? { ...task, completed: false }
          : task
      );
    }

    // Normal task
    if (currentTask.recurrence === "none") {
      return currentTasks.map((task) =>
        task.createdAt === createdAt
          ? { ...task, completed: true }
          : task
      );
    }

    const nextDueDate = getNextDueDate(
      currentTask.dueDate,
      currentTask.recurrence
    );

    // If we cannot calculate a next date,
    // just complete the current task.
    if (!nextDueDate) {
      return currentTasks.map((task) =>
        task.createdAt === createdAt
          ? { ...task, completed: true }
          : task
      );
    }

    // Check whether the next occurrence already exists.
const nextOccurrenceExists = currentTasks.some(
  (task) =>
    task.text === currentTask.text &&
    task.category === currentTask.category &&
    task.recurrence === currentTask.recurrence &&
    task.dueDate === nextDueDate
);

    // Complete the current occurrence.
    const updatedTasks = currentTasks.map((task) =>
      task.createdAt === createdAt
        ? { ...task, completed: true }
        : task
    );

    // If the next occurrence already exists,
    // don't create another one.
    if (nextOccurrenceExists) {
      return updatedTasks;
    }

    // Create the next occurrence.
    const nextTask: Task = {
      ...currentTask,
      completed: false,
      dueDate: nextDueDate,
      createdAt: Date.now(),
    };

    return [...updatedTasks, nextTask];
  });
};

const deleteTask = (createdAt: number) => {
  setTasks((currentTasks) =>
    currentTasks.filter((task) => task.createdAt !== createdAt)
  );
};

const viewTasks = tasks.filter((task) => {
  if (taskView === "today") {
    return isToday(task.dueDate);
  }

  if (taskView === "upcoming") {
    return isUpcoming(task.dueDate, task.completed);
  }

  if (taskView === "overdue") {
    return isOverdue(task.dueDate, task.completed);
  }

  return true;
});

const filteredTasks = viewTasks
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
  recurrence,
  reminder: reminder || null,
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
  setRecurrence("none");
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
  recurrence={recurrence}
  setRecurrence={setRecurrence}
  reminder={reminder}
  setReminder={setReminder}
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

<div className="task-view-buttons">
  <button
    className={taskView === "all" ? "active" : ""}
    onClick={() => setTaskView("all")}
  >
    All
  </button>

  <button
    className={taskView === "today" ? "active" : ""}
    onClick={() => setTaskView("today")}
  >
    Today
  </button>

  <button
    className={taskView === "upcoming" ? "active" : ""}
    onClick={() => setTaskView("upcoming")}
  >
    Upcoming
  </button>

  <button
  className={taskView === "overdue" ? "active" : ""}
  onClick={() => setTaskView("overdue")}
>
  Overdue
</button>
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
    recurrence={recurrence}
    setRecurrence={setRecurrence}
    reminder={reminder}
    setReminder={setReminder}
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