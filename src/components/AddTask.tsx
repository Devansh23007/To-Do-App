type AddTaskProps = {
  task: string;
  setTask: (task: string) => void;
  addTask: () => void;
};

function AddTask({ task, setTask, addTask }: AddTaskProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addTask();
    }
  };

  return (
    <div className="add-task">
      <input
        type="text"
        placeholder="What needs to be done?"
        value={task}
        onChange={(event) => setTask(event.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button onClick={addTask}>Add</button>
    </div>
  );
}

export default AddTask;