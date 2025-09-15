import mongoose from "mongoose";

const paymentSchema = mongoose.Schema(
    {
        orderId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Order", 
            required: true 
        },
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        amount: { 
            type: Number, 
            required: true 
        },
        paymentMethod: { 
            type: String, 
            enum: ["VNPay"], 
            default: "VNPay",
            required: true 
        },
        status: { 
            type: String, 
            enum: ["pending", "success", "failed"], 
            default: "pending" 
        },
        transactionId: { 
            type: String, 
            unique: true 
        },
    }
);
export const Payment = mongoose.model('Payment', paymentSchema);