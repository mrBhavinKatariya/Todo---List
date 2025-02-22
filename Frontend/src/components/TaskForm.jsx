import { useState } from "react";
import PropTypes from "prop-types";

function TaskForm({ onAdd }) {
    const [task, setTask] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!task.trim()) return;
        onAdd(task);
        setTask("");
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <input 
                type="text" 
                className="border p-2 w-full" 
                placeholder="New Task" 
                value={task} 
                onChange={(e) => setTask(e.target.value)}
            />
            <button type="submit" className="bg-blue-500 text-white p-2 mt-2 w-full">Add Task</button>
        </form>
    );
}

TaskForm.propTypes = {
    onAdd: PropTypes.func.isRequired,
};

export default TaskForm;