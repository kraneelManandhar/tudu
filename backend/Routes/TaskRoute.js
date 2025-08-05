const express = require('express');
const router = express.Router();
const taskController = require('../Controller/TaskController');

router.get('/',taskController.getAllTasks);
router.post('/create',taskController.createTask)

module.exports = router