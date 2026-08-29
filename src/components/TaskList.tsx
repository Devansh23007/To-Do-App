import TaskItem from "./TaskItem";
import type { Category, Priority, Task } from "../types";


type TaskListProps = {
  tasks: Task[];
  toggleTask: (createdAt: number) => void;
  deleteTask: (createdAt: number) => void;
  editTask: (
  createdAt: number,
  newText: string,
  newPriority: Priority,
  newCategory: Category,
  newDueDate: string | null
) => void;
};

function TaskList({
  tasks,
  toggleTask,
  deleteTask,
  editTask,
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
          {tasks.map((task) => (
  <TaskItem
    key={task.createdAt}
    task={task}
    toggleTask={toggleTask}
    deleteTask={deleteTask}
    editTask={editTask}
  />
))}
        </ul>
      )}
    </>
  );
}

export default TaskList;