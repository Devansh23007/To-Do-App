import { useState } from "react";
import Header from "./components/Header";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import "./App.css";
import type { Task, Priority } from "./types";

function App() {
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  const addTask = () => {
    if (task.trim() === "") {
      return;
    }

   const newTask: Task = {
  text: task.trim(),
  completed: false,
  priority,
};

    setTasks([...tasks, newTask]);
    setTask("");
  };

const editTask = (
  index: number,
  newText: string,
  newPriority: Priority
) => {
  setTasks((currentTasks) =>
    currentTasks.map((task, taskIndex) =>
      taskIndex === index
        ? {
            ...task,
            text: newText,
            priority: newPriority,
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