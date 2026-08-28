import { useState } from "react";

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
      <h1>My To-Do App</h1>

      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(event) => setTask(event.target.value)}
      />

      <button onClick={addTask}>Add</button>

      <ul>
        {tasks.map((task, index) => (
          <li key={index}>
  <input
    type="checkbox"
    checked={task.completed}
    onChange={() => toggleTask(index)}
  />

  <span
    style={{
      textDecoration: task.completed ? "line-through" : "none",
    }}
  >
    {task.text}
  </span>

  <button onClick={() => deleteTask(index)}>
    Delete
  </button>
</li>
        ))}
      </ul>
    </div>
  );
}

export default App;