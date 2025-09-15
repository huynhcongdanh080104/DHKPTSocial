class ValidatorContext {
    constructor() {
        this.strategies = [];
    }

    addStrategy(strategy) {
        this.strategies.push(strategy);
    }

    validate() {
        for (let strategy of this.strategies) {
            const result = strategy();
            if (!result.valid) {
                return result;
            }
        }
        return { valid: true };
    }
}

export default ValidatorContext;