import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    shipper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    description:{
        type: String,
        required: true
    },
    note:{
        type: String,
        required: false
    },
    address:{
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "shipping", "shipped", "cancelled"],
        default: "pending",
    },
    paymentMethod:{
        type: String,
        enum: ["COD", "VNPay"],
        default: "COD"
    },
    paymentStatus:{
        type: String,
        enum: ["pending", "paid"],
        default: "pending",
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            name: String,
            image: String,
            quantity: { type: Number, require: true },
            unitPrice:{
                type: Number,
                required: true,
            },
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
    createAt:{
        type: Date,
        default: Date.now
    }
    
});

export const Order = mongoose.model("Order", OrderSchema);
