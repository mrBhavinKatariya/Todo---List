const Task = require("../models/TaskModel.js");

exports.getTasks = async (req, res) => {
    try {
        console.log("Fetching tasks for user:", req.user.id); // Add logging
        const tasks = await Task.findAll({
            where: { userId: req.user.id },
            attributes: { exclude: ["userId"] }
        });
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error); // Add detailed logging
        res.status(500).json({ message: "Failed to fetch tasks" });
    }
};

exports.createTask = async (req, res) => {
    const { title, description, status } = req.body;
    try {
        console.log("Creating task for user:", req.user.id); // Add logging
        const task = await Task.create({
            userId: req.user.id,
            title,
            description,
            status
        });
        res.status(201).json({ message: "Task created", task });
    } catch (error) {
        console.error("Error creating task:", error); // Add detailed logging
        res.status(500).json({ message: "Error creating task" });
    }
};

exports.updateTask = async (req, res) => {
    const { title, description, status } = req.body;
    try {
        console.log("Updating task:", req.params.id, "for user:", req.user.id); // Add logging
        const task = await Task.update(
            { title, description, status },
            { where: { id: req.params.id, userId: req.user.id } }
        );
        if (task[0] === 0) {
            return res.status(404).json({ message: "Task not found or not authorized" });
        }
        res.json({ message: "Task updated" });
    } catch (error) {
        console.error("Error updating task:", error); // Add detailed logging
        res.status(500).json({ message: "Error updating task" });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        console.log("Deleting task:", req.params.id, "for user:", req.user.id); // Add logging
        const result = await Task.destroy({
            where: { id: req.params.id, userId: req.user.id }
        });
        if (result === 0) {
            return res.status(404).json({ message: "Task not found or not authorized" });
        }
        res.json({ message: "Task deleted" });
    } catch (error) {
        console.error("Error deleting task:", error); // Add detailed logging
        res.status(500).json({ message: "Error deleting task" });
    }
};