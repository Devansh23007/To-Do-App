import { useState } from "react";
import Header from "./components/Header";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import "./App.css";
import type { Category, Priority, Task } from "./types";

function App() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("other");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [dueDate, setDueDate] = useState("");

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
};

    setTasks([...tasks, newTask]);
    setTask("");
  };

const editTask = (
  index: number,
  newText: string,
  newPriority: Priority,
  newCategory: Category,
  newDueDate: string | null
) => {
  setTasks((currentTasks) =>
    currentTasks.map((task, taskIndex) =>
      taskIndex === index
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

  const toggleTask = (index: number) => {
    setTasks(
      tasks.map((task, taskIndex) =>
        taskIndex === index
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (index: number) => {
  setTasks(tasks.filter((_, taskIndex) => taskIndex !== index));
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

      <TaskList
  tasks={tasks}
  toggleTask={toggleTask}
  deleteTask={deleteTask}
  editTask={editTask}
/>
    </main>
  </div>
);
}

export default App;