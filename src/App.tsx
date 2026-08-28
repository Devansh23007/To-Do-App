import { useState } from "react";
import Header from "./components/Header";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";

type Task = {
  text: string;
  completed: boolean;
};

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = () => {
    if (task.trim() === "") {
      return;
    }

    const newTask: Task = {
      text: task,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTask("");
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
    <div>
      <Header />

      <AddTask
  task={task}
  setTask={setTask}
  addTask={addTask}
/>

      <TaskList
  tasks={tasks}
  toggleTask={toggleTask}
  deleteTask={deleteTask}
/>
    </div>
  );
}

export default App;