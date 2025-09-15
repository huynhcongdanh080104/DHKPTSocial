import ProductTemplate from "./ProductTemplate.js";
import { validateAttributes } from "../StrategyPattern/ValidationStrategies.js";

class ProductUpdater extends ProductTemplate {
    constructor(enqueueSnackbar, areAllAttributeTotalsEqual, handleUpdate) {
        super(enqueueSnackbar);
        this.areAllAttributeTotalsEqual = areAllAttributeTotalsEqual;
        this.handleUpdate = handleUpdate;
    }

    async updateProduct(selectedProduct, nameProduct, description, stockQuantity, price, attributes, salePrice, isSale) {
        this.addCommonValidations({ nameProduct, description, stockQuantity, price });

        this.validator.addStrategy(() => validateAttributes(attributes, this.areAllAttributeTotalsEqual));

        if (this.validateData()) {
            this.handleUpdate();
        }

    }
}

export default ProductUpdater;
