type Task = {
  text: string;
  completed: boolean;
};

type TaskItemProps = {
  task: Task;
  index: number;
  toggleTask: (index: number) => void;
  deleteTask: (index: number) => void;
};

function TaskItem({
  task,
  index,
  toggleTask,
  deleteTask,
}: TaskItemProps) {
  return (
    <li className="task-item">
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
  );
}

export default TaskItem;