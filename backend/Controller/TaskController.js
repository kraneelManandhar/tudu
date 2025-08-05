const Task = require('../Model/TaskSchema');

exports.createTask = async(req,res) =>{
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
};

exports.getAllTasks = async(req,res) => {
    const tasks = await Task.find();
    res.json(tasks)
}
