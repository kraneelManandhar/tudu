const Category = require('../Model/categorySchema');

exports.createCategory = async(req,res)=>{
    try {
        const { category, tasks } = req.body;
        const newCategory = new Category({ category, tasks });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('tasks', 'title description');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
