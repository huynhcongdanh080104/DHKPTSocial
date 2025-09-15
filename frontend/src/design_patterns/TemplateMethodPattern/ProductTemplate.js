import ValidatorContext from "../StrategyPattern/ValidatorContext.js";
import {
    validateName,
    validateDescription,
    validateStockQuantity,
    validatePrice,
    validateImages,
    validateDuplicate,
    validateAttributes
} from "../StrategyPattern/ValidationStrategies.js";

class ProductTemplate {
    constructor(enqueueSnackbar) {
        this.enqueueSnackbar = enqueueSnackbar;
        this.validator = new ValidatorContext();
    }

    addCommonValidations({ nameProduct, description, stockQuantity, price }) {
        this.validator.addStrategy(() => validateName(nameProduct));
        this.validator.addStrategy(() => validateDescription(description));
        this.validator.addStrategy(() => validateStockQuantity(stockQuantity));
        this.validator.addStrategy(() => validatePrice(price));
    }

    validateData() {
        const result = this.validator.validate();
        if (!result.valid) {
            this.enqueueSnackbar(result.message, { variant: "warning" });
            return false;
        }
        return true;
    }

    async processProduct(data, apiUrl, successMessage) {
        if (!this.validateData()) return;

        try {
            const response = await apiUrl(data);
            console.log(response.data);
            this.enqueueSnackbar(successMessage, { variant: "success" });
        } catch (error) {
            console.error("Error processing product:", error);
            this.enqueueSnackbar("Lỗi xử lý sản phẩm", { variant: "error" });
        }
    }
}

export default ProductTemplate;