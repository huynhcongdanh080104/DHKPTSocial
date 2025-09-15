import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }, 
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                name: String,
                unitPrice: Number,
                image: String,
                quantity: { type: Number, default: 1 },
                store:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Store",
                    required: true,
                },
                attributes:[
                    {
                        name: String, 
                        values: 
                        {
                            attributeName: String,
                            attributeImage: String,
                            priceAttribute: Number,
                        }, 
                    }
                ]
            },
        ],
    },
    { timestamps: true }
); 

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
