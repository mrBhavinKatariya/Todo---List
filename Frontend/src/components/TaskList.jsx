import PropTypes from "prop-types";

function TaskList({ tasks, onDelete }) {
    return (
        <ul className="mt-5">
            {tasks.map((task) => (
                <li key={task.id} className="border p-2 flex justify-between">
                    {task.title}
                    <button className="bg-red-500 text-white p-1" onClick={() => onDelete(task.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}

TaskList.propTypes = {
    tasks: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default TaskList;