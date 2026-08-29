import TaskItem from "./TaskItem";
import type { Category, Priority, Task } from "../types";


type TaskListProps = {
  tasks: Task[];
  toggleTask: (index: number) => void;
  deleteTask: (index: number) => void;
  editTask: (
  index: number,
  newText: string,
  newPriority: Priority,
  newCategory: Category
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
          {tasks.map((task, index) => (
            <TaskItem
              key={index}
              task={task}
              index={index}
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