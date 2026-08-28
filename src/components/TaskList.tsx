import TaskItem from "./TaskItem";

type Task = {
  text: string;
  completed: boolean;
};

type TaskListProps = {
  tasks: Task[];
  toggleTask: (index: number) => void;
  deleteTask: (index: number) => void;
};

function TaskList({
  tasks,
  toggleTask,
  deleteTask,
}: TaskListProps) {
  return (
    <ul className="task-list">
      {tasks.map((task, index) => (
        <TaskItem
          key={index}
          task={task}
          index={index}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />
      ))}
    </ul>
  );
}

export default TaskList;