const fs = require("fs");

class Controller {
  static async fetchTasks(req, res, next) {
    try {
      let tasks = require("../data/tasks.json");
      const page = req.query.page || 1;
      const limit = 5;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const results = tasks.slice(startIndex, endIndex);
      console.log(results);
      res.json({
        page,
        tasks: results,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
      console.log(error);
    }
  }

  static async fetchTasksId(req, res, next) {
    try {
      let { tasks } = require("../data/tasks.json");
      const { id } = req.params;
      const task = tasks.find((task) => task.id === parseInt(id));

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async addTasks(req, res, next) {
    try {
      let { tasks } = require("../data/tasks.json");
      const { title, description } = req.body;
      const input = {
        id: tasks.length + 1,
        title,
        description,
      };

      tasks.push(input);
      fs.writeFileSync("./data/tasks.json", tasks);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async removeTasks(req, res, next) {
    try {
      let { tasks } = require("../data/tasks.json");
      const { id } = req.params;
      const target = tasks.findIndex((task) => task.id === parseInt(id));

      if (target === -1) {
        return res.status(404).json({ error: "Task not found" });
      }

      tasks.splice(target, 1);
      fs.writeFile(
        "./data/tasks.json",
        JSON.stringify(tasks, null, 2),
        (err) => {
          if (err) {
            return res.status(500).json({ error: "Failed to delete task" });
          }
          res.json({ message: "Task deleted successfully" });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateTasks(req, res, next) {
    try {
      let { tasks } = require("../data/tasks.json");
      const { id } = req.params;
      const { updatedTask } = req.body;

      const target = tasks.findIndex((task) => task.id === parseInt(id));

      if (target === -1) {
        return res.status(404).json({ error: "Task not found" });
      }

      Object.assign(tasks[target], updatedTask);
      fs.writeFile(
        "./data/tasks.json",
        JSON.stringify({ tasks }, null, 2),
        (err) => {
          if (err) {
            return res.status(500).json({ error: "Failed to update task" });
          }
          res.json({ message: "Task updated successfully" });
        }
      );
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = Controller;
