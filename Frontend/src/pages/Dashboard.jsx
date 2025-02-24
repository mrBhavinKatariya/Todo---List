
import { useEffect, useState, useContext } from "react";
import { getTasks, createTask, deleteTask, updateTask, getCurrentUser } from "../services/api";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaCheckCircle, FaEdit, FaSignOutAlt, FaEye, FaTimes } from "react-icons/fa";

function Dashboard() {
  const { token, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [newTaskStatus, setNewTaskStatus] = useState("To Do");
  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchCurrentUserAndTasks();
    }
  }, [token]);

  const fetchCurrentUserAndTasks = async () => {
    try {
      const userResponse = await getCurrentUser();
      setCurrentUser(userResponse);

      const tasksResponse = await getTasks();
      console.log("Tasks response:", tasksResponse);
      setTasks(Array.isArray(tasksResponse) ? tasksResponse : []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    }
  };

  const handleAddTask = async () => {
    if (!task.trim()) {
      alert("Task title cannot be empty!");
      return;
    }
    try {
      await createTask({ title: task, description: "New Task", status: newTaskStatus });
      setTask("");
      setNewTaskStatus("To Do");
      await fetchCurrentUserAndTasks();
    } catch (error) {
      console.error("Error adding task:", error);
      alert(error.response?.data?.message || "Failed to add task.");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      await fetchCurrentUserAndTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      await fetchCurrentUserAndTasks();
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update task status. Please try again.");
    }
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditedTitle(task.title);
  };

  const handleTitleUpdate = async (taskId) => {
    try {
      await updateTask(taskId, { title: editedTitle });
      setEditingTask(null);
      await fetchCurrentUserAndTasks();
    } catch (error) {
      console.error("Error updating title:", error);
      alert("Failed to update task title. Please try again.");
    }
  };

  const viewTaskDetails = (task) => {
    setViewingTask(task);
  };

  const closeTaskDetails = () => {
    setViewingTask(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getTaskBackgroundColor = (status) => {
    switch (status) {
      case "To Do":
        return "bg-gray-700";
      case "In Progress":
        return "bg-blue-700";
      case "Completed":
        return "bg-green-700";
      default:
        return "bg-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Task Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Manage your tasks efficiently</p>
            {currentUser && (
              <p className="text-gray-400 mt-2">Logged in as: {currentUser.username}</p>
            )}
          </div>
          <button
            className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg flex items-center gap-2"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-xl" />
            Logout
          </button>
        </div>

        {/* Add Task Section */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-lg p-1 flex gap-2">
            <input
              type="text"
              value={task}
              placeholder="Enter new task..."
              className="w-full bg-transparent p-4 text-white placeholder-gray-400 focus:outline-none"
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
            <select
              value={newTaskStatus}
              onChange={(e) => setNewTaskStatus(e.target.value)}
              className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 text-gray-100 rounded-lg px-4 mr-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all flex items-center gap-2"
            onClick={handleAddTask}
          >
            <FaPlus className="text-xl" />
            Add Task
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No tasks found. Start by adding a new task!
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`group ${getTaskBackgroundColor(task.status)} backdrop-blur-sm hover:bg-opacity-75 rounded-lg p-4 border border-white/10 transition-all`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <FaCheckCircle
                      className={`text-xl ${
                        task.status === "Completed" ? "text-green-400" : "text-purple-400"
                      }`}
                    />
                    {editingTask === task.id ? (
                      <div className="flex gap-2 flex-1">
                        <input
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          className="bg-white/10 text-white p-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onKeyDown={(e) => e.key === "Enter" && handleTitleUpdate(task.id)}
                        />
                        <button
                          onClick={() => handleTitleUpdate(task.id)}
                          className="bg-blue-500 text-black px-3 rounded-lg mr-[5px] hover:bg-blue-600 transition-all"
                        >
                          Update
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-100 text-lg flex-1">{task.title}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      className="text-blue-400 hover:text-blue-300 p-2 rounded-full hover:bg-white/10 transition-all"
                      onClick={() => viewTaskDetails(task)}
                    >
                      <FaEye className="text-lg" />
                    </button>

                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 text-gray-100 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:bg-gray-700/50"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      className="text-blue-400 hover:text-blue-300 p-2 rounded-full hover:bg-white/10 transition-all"
                      onClick={() => startEditing(task)}
                    >
                      <FaEdit className="text-lg" />
                    </button>

                    <button
                      className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-white/10 transition-all"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <FaTrash className="text-lg" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Task Details Modal */}
        {viewingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{viewingTask.title}</h2>
                <button
                  onClick={closeTaskDetails}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>
              <p className="text-gray-300 mb-4">{viewingTask.description}</p>
              <p className="text-gray-400">
                Status: <span className="text-purple-400">{viewingTask.status}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;