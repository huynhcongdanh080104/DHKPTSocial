import express from 'express';
import { Product } from '../models/productModel.js';
import mongoose from 'mongoose';
import { Category } from '../models/categoryModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, description, category, totalStockQuantity, price, store, attributes, images, salePrice, isSale } = req.body;
        
        if (!name || !category || category.length === 0 || !price || !store) {
            return res.status(400).json({
                message: 'Required fields cannot be empty and must have at least one category and attribute.'
            });
        }
        
        const newProductData = {
            name,
            description,
            category,
            soldQuantity: 0,
            totalStockQuantity,
            price,
            store,
            images,
            status: "Active",
            rating: 0,
            isSale
        };
        
        // Nếu có `attributes`, thêm vào `newProductData`
        if (attributes) {
            newProductData.attributes = attributes;
        }
        
        // Nếu có `salePrice`, thêm vào `newProductData`
        if (salePrice) {
            newProductData.salePrice = salePrice;
        }
        
        // Tạo và lưu sản phẩm
        const newProduct = new Product(newProductData);
        await newProduct.save();
        
        const populatedProduct = await newProduct.populate('category');
        
        // Phát sự kiện real-time đến client
        req.io.emit("productAdded", populatedProduct);
        
        res.status(201).json(newProduct);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const populatedProduct = await updatedProduct.populate('category');
        req.io.emit("productUpdated", populatedProduct);
        res.json(populatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a product by ID (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        req.io.emit("productDeleted", { productId: req.params.id });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        if (!products) {
            return res.status(404).json({ message: "Không có sản phẩm nào cả" });
        }
  
        res.json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})
router.get('/store/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const products = await Product.find({ store: id })
            .populate('store')
            .populate({
                path: 'category', // Chắc chắn rằng category được populate
                select: 'name description image', // Chỉ lấy các trường cần thiết
            })

        if (!products.length) {
            return res.status(404).json({ message: "Không có sản phẩm nào cả" });
        }

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @route GET /products/popular
 * @desc Lấy danh sách sản phẩm phổ biến theo số lượng đã bán, có thể lọc theo danh mục
 */
router.get("/popular", async (req, res) => {
    try {
        const { category } = req.query;

        let filter = { status: "Active" };

        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res
                    .status(400)
                    .json({ message: "categoryId không hợp lệ" });
            }
            filter.category = mongoose.Types.ObjectId(category); // Chuyển thành ObjectId
        }

        const popularProducts = await Product.find(filter)
            .sort({ soldQuantity: -1 }) // Sắp xếp theo số lượng bán giảm dần
            .limit(10);

        res.status(200).json(popularProducts);
    } catch (error) {
        console.error("Lỗi lấy danh sách sản phẩm phổ biến:", error);
        res.status(500).json({
            message: "Lỗi server khi lấy sản phẩm phổ biến",
            error: error.message,
        });
    }
});

/**
 * @route GET /products/category/:categoryId
 * @desc Lấy danh sách sản phẩm theo danh mục
 */
router.get("/category/:categoryId", async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Kiểm tra nếu categoryId có dạng ObjectId hợp lệ
        if (mongoose.Types.ObjectId.isValid(categoryId)) {
            const products = await Product.find({
                category: mongoose.Types.ObjectId(categoryId),
                status: "Active",
            });

            return res.status(200).json(products);
        }

        // Nếu không phải ObjectId, tìm danh mục theo tên
        const category = await Category.findOne({
            name: decodeURIComponent(categoryId),
        });

        if (!category) {
            return res.status(404).json({ message: "Danh mục không tồn tại" });
        }

        // Tìm sản phẩm theo _id của danh mục tìm được
        const products = await Product.find({
            category: category._id,
            status: "Active",
        });

        res.status(200).json(products);
    } catch (error) {
        console.error("Lỗi lấy danh sách sản phẩm theo danh mục:", error);
        res.status(500).json({
            message: "Lỗi server khi lấy sản phẩm theo danh mục",
            error: error.message,
        });
    }
});

/**
 * @route GET /products/new
 * @desc Lấy danh sách sản phẩm mới nhất
 */
router.get("/new", async (req, res) => {
    try {
        const newProducts = await Product.find({ status: "Active" })
            .sort({ publishDate: -1 }) // Sắp xếp theo ngày tạo giảm dần
            .limit(12);

        res.status(200).json(newProducts);
    } catch (error) {
        console.error("Lỗi lấy danh sách sản phẩm mới nhất:", error);
        res.status(500).json({
            message: "Lỗi server khi lấy sản phẩm mới nhất",
            error: error.message,
        });
    }
});

/**
 * @route GET /products/:productId
 * @desc Lấy thông tin chi tiết sản phẩm
 */
router.get("/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "productId không hợp lệ" });
        }

        const product = await Product.findById(productId)
            .populate("category")
            .populate("store");

        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
        res.status(500).json({
            message: "Lỗi server khi lấy chi tiết sản phẩm",
            error: error.message,
        });
    }
});
router.get("/store/:storeId/rating", async (req, res) => {
    try {
        const storeId = req.params.storeId;

        // Lấy tất cả sản phẩm thuộc cửa hàng
        const products = await Product.find({ store: storeId });

        // Đếm tổng số sản phẩm trong cửa hàng
        const totalProductCount = products.length;

        // Lọc ra những sản phẩm có rating > 0
        const ratedProducts = products.filter((p) => p.rating > 0);
        const totalRating = ratedProducts.reduce((sum, p) => sum + p.rating, 0);
        const ratedProductCount = ratedProducts.length;

        // Tính rating trung bình (chỉ chia cho số sản phẩm có rating)
        const storeRating =
            ratedProductCount > 0
                ? (totalRating / ratedProductCount).toFixed(1)
                : 0;

        res.json({ storeRating, ratedProductCount, totalProductCount });
    } catch (error) {
        console.error("Lỗi khi tính rating:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
});

router.post('/:id/comments', async (req, res) => {
    try {
        const { userID, rating, descriptionImages, description } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ message: 'Không tìm thấy sản phẩm' });
        }

        const newComment = {
            userID,
            rating,
            descriptionImages,
            description
        };

        product.comments.push(newComment);
        await product.save();

        res.status(201).send(product);
    } catch (error) {
        res.status(500).send({ message: 'Lỗi khi thêm bình luận', error: error.message });
    }
});
export default router;

