const express = require('express');
const router = express.Router();
const taskController = require('../Controller/TaskController');
const categoryController = require('../Controller/CategoryController')

router.get('/',taskController.getAllTasks);
router.post('/create',taskController.createTask)
router.get('/:id',taskController.getTaskById)
router.put('/:id',taskController.updateTask)
router.delete('/:id',taskController.deleteTask)
router.post('/create/category',categoryController.createCategory)
router.get('/get/category',categoryController.getCategories)

module.exports = router;