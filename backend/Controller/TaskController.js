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

exports.getTaskById = async(req,res) => {
    const Id = req.params.id;
    const task = await Task.findById(Id);
    res.json(task);
}

exports.updateTask =  async(req,res) => {
    const Id = req.params.id;
    const update = await req.findByIdAndUpdate(Id,req.body);
    res.json(update);
}

exports.deleteTask = async(req,res) => {
    try{
    const Id = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(Id);
    res.send("Task deleted successfully")
    }catch(error){
        res.status(401).json({message : error})
    }
}