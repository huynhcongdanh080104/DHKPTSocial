import express from 'express';
import { Category } from '../models/categoryModel.js';

const router = express.Router();

// Route để lấy tất cả các category
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route để lấy một category cụ thể bằng ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route để tạo một category mới
router.post('/', async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        productQuantity: req.body.productQuantity,
        status: req.body.status
    });

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route để cập nhật một category bằng ID
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        category.name = req.body.name || category.name;
        category.description = req.body.description || category.description;
        category.image = req.body.image || category.image;
        category.productQuantity = req.body.productQuantity || category.productQuantity;
        category.status = req.body.status || category.status;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route để xóa một category bằng ID
router.delete('/:id', async (req, res) => {
    try {
      const categoryId = req.params.id;
  
      // Sử dụng deleteOne hoặc findByIdAndDelete
      const deletedCategory = await Category.deleteOne({ _id: categoryId });
      // Hoặc:
      // const deletedCategory = await Category.findByIdAndDelete(categoryId);
  
      if (!deletedCategory) {
        return res.status(404).json({ message: 'Danh mục không tồn tại' });
      }
  
      res.status(200).json({ message: 'Xóa danh mục thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  });

export default router;