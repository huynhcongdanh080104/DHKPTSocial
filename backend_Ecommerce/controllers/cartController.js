import Cart from "../models/cartModel.js";

const getUserCart = async (req, res) => {
    try{
        const { userId } = req.params;
        const cart = await Cart.findOne({userId: userId}).populate({
            path: "items.productId", // 🔹 Lấy thông tin sản phẩm
            select: "name unitPrice image rating attributes", // ✅ Chọn trường cần thiết
        });
        if (!cart)
            return res.status(404).json({ error: "Không tìm thấy giỏ hàng" });

        res.json(cart);
    }
    catch(error){
        console.error("⛔ Lỗi lấy giỏ hàng:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
}
// Lấy giỏ hàng (Tìm theo `cartId`)
const getCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        if (!cartId) return res.status(400).json({ error: "Thiếu cartId" });

        const cart = await Cart.findById(cartId).populate({
            path: "items.productId", // 🔹 Lấy thông tin sản phẩm
            select: "name unitPrice image rating attributes", // ✅ Chọn trường cần thiết
        });

        if (!cart)
            return res.status(404).json({ error: "Không tìm thấy giỏ hàng" });

        res.json(cart);
    } catch (error) {
        console.error("⛔ Lỗi lấy giỏ hàng:", error);
        res.status(500).json({ error: "Lỗi server" });
    }
};

const createCart = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "Thiếu userId" });
        }

        let existingCart = await Cart.findOne({ userId });
        if (existingCart) {
            return res.json({
                message: "Giỏ hàng đã tồn tại",
                cartId: existingCart._id,
            });
        }

        // Nếu chưa có giỏ hàng, tạo mới
        const newCart = new Cart({ userId, items: [] });
        await newCart.save();

        res.json({ message: "Giỏ hàng mới đã được tạo", cartId: newCart._id });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi tạo giỏ hàng" });
    }
};

const addToCart = async (req, res) => {
    try {
        let {
            cartId,
            userId,
            productId,
            name,
            unitPrice,
            quantity,
            attributes,
            image,
            store
        } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "Thiếu userId" });
        }

        let cart = cartId
            ? await Cart.findById(cartId)
            : await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
            await cart.save();
        }

        const existingItem = cart.items.find((item) => {
            // So sánh productId
            if (item.productId.toString() !== productId) {
                return false;
            }
            
            // So sánh các attributes
            // Kiểm tra số lượng attributes
            if (!item.attributes || !attributes || item.attributes.length !== attributes.length) {
                return false;
            }
            
            // Kiểm tra từng attribute
            return attributes.every(newAttr => {
                // Tìm attribute tương ứng trong item hiện tại
                const itemAttr = item.attributes.find(attr => attr.name === newAttr.name);
                
                // Nếu không tìm thấy attribute tương ứng
                if (!itemAttr) {
                    return false;
                }
                
                // So sánh values
                return itemAttr.values.attributeName === newAttr.values.attributeName;
            });
        });

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                productId,
                name,
                unitPrice,
                quantity,
                attributes,
                image,
                store
            });
        }

        await cart.save();
        res.json({
            message: "Sản phẩm đã thêm vào giỏ hàng",
            cartId: cart._id,
            cart,
        });
    } catch (error) {
        console.error("⛔ Lỗi khi thêm vào giỏ hàng:", error);
        res.status(500).json({ error: "Lỗi khi thêm sản phẩm vào giỏ hàng" });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { cartId, itemId, quantity } = req.body;
        if (!cartId) return res.status(400).json({ error: "Thiếu cartId" });

        let cart = await Cart.findById(cartId);
        if (!cart)
            return res.status(404).json({ error: "Không tìm thấy giỏ hàng" });

        const item = cart.items.id(itemId);
        if (!item)
            return res
                .status(404)
                .json({ error: "Sản phẩm không tồn tại trong giỏ hàng" });

        item.quantity = quantity;
        await cart.save();

        res.json({ message: "Cập nhật số lượng thành công", cart });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi cập nhật giỏ hàng" });
    }
};

const removeCartItem = async (req, res) => {
    try {
        const { cartId, itemId } = req.body;
        if (!cartId) return res.status(400).json({ error: "Thiếu cartId" });

        let cart = await Cart.findById(cartId);
        if (!cart)
            return res.status(404).json({ error: "Không tìm thấy giỏ hàng" });

        cart.items = cart.items.filter(
            (item) => item._id.toString() !== itemId
        );
        await cart.save();

        res.json({ message: "Đã xóa sản phẩm khỏi giỏ hàng", cart });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi xoá sản phẩm" });
    }
};


export {
    getCart,
    createCart, 
    addToCart,
    updateCartItem,
    removeCartItem,
    getUserCart
};
