class ProductObserver {
    constructor() {
        this.observers = [];
    }

    subscribe(observer) {
        this.observers.push(observer);
    }

    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(products) {
        this.observers.forEach(observer => observer(products));
    }
}

const productObserver = new ProductObserver();
export default productObserver;
