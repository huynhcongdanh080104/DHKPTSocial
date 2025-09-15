export const validateName = (nameProduct) => {
    if (!nameProduct.trim()) {
        return { valid: false, message: "Vui lòng nhập tên sản phẩm" };
    }
    return { valid: true };
};

export const validateDescription = (description) => {
    if (!description.trim()) {
        return { valid: false, message: "Vui lòng nhập mô tả sản phẩm" };
    }
    return { valid: true };
};

export const validateStockQuantity = (stockQuantity) => {
    if (stockQuantity <= 0) {
        return { valid: false, message: "Vui lòng chọn số lượng hàng tồn của sản phẩm" };
    }
    return { valid: true };
};

export const validatePrice = (price) => {
    if (price <= 0) {
        return { valid: false, message: "Vui lòng nhập giá sản phẩm" };
    }
    return { valid: true };
};

export const validateImages = (images) => {
    if (!images || images.length === 0) {
        return { valid: false, message: "Thêm hình ảnh sản phẩm" };
    }
    return { valid: true };
};

export const validateDuplicate = (products, nameProduct) => {
    const isDuplicated = products.some(item => item.name === nameProduct);
    if (isDuplicated) {
        return { valid: false, message: "Tên sản phẩm bị trùng" };
    }
    return { valid: true };
};

export const validateAttributes = (attributes, areAllAttributeTotalsEqual) => {
    if (attributes.length > 0 && !areAllAttributeTotalsEqual(attributes)) {
        return { valid: false, message: "Số lượng tồn của các biến thể không hợp lệ" };
    }
    return { valid: true };
};
