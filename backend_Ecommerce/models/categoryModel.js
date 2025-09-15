import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    productQuantity: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "Active"
    }
});
export const Category = mongoose.model('Category', categorySchema);