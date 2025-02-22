
const express = require("express");
const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController.js");
const  verifyJWT  = require("../middleware/authMiddleware.js"); 

const router = express.Router();

router.get("/tasks", verifyJWT, getTasks); 
router.post("/create-tasks", verifyJWT, createTask);
router.put("/update-tasks/:id", verifyJWT, updateTask);
router.delete("/delete-tasks/:id", verifyJWT, deleteTask);

module.exports = router;