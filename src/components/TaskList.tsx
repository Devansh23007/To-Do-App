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
    <>
      {tasks.length === 0 ? (
        <div className="empty-state">
          <h2>No tasks yet</h2>
          <p>Add something you need to get done.</p>
        </div>
      ) : (
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
      )}
    </>
  );
}

export default TaskList;