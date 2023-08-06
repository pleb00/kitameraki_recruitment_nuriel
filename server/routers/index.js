const express = require("express");
const router = express.Router();
const Controller = require("../controllers/controller");

router.get("/tasks", Controller.fetchTasks);
router.post("/tasks", Controller.addTasks);
router.get("/tasks/:id", Controller.fetchTasksId);
router.delete("/tasks/:id", Controller.removeTasks);
router.put("/tasks/:id", Controller.updateTasks);

module.exports = router;
