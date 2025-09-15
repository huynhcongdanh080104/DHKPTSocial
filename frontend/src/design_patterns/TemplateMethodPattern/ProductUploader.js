import ProductTemplate from "./ProductTemplate.js";
import { validateImages, validateDuplicate } from "../StrategyPattern/ValidationStrategies.js";

class ProductUploader extends ProductTemplate {
    constructor(enqueueSnackbar, products, images, handleUpload) {
        super(enqueueSnackbar);
        this.products = products;
        this.images = images;
        this.handleUpload = handleUpload;
    }

    async uploadProduct(nameProduct, description, stockQuantity, price) {
        this.addCommonValidations({ nameProduct, description, stockQuantity, price });

        this.validator.addStrategy(() => validateImages(this.images));
        this.validator.addStrategy(() => validateDuplicate(this.products, nameProduct));

        if (this.validateData()) {
            this.handleUpload();
        }
    }
}

export default ProductUploader;
