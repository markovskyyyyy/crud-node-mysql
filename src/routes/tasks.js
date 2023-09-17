const express = require("express");

const taskController = require("../controllers/taskController");

const router = express.Router();

router.get("/tasks", taskController.index);
router.get("/create", taskController.create);
router.post("/create", taskController.store);
router.post("/tasks/delete", taskController.destroy);
router.get("/tasks/edit/:id", taskController.edit);
router.post("/tasks/edit/:id", taskController.update);

module.exports = router;
