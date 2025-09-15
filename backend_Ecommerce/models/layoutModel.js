import mongoose from "mongoose";

const layoutSchema = mongoose.Schema({
    store:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Store"
    },
    name:{
        type: String,
        required: true,
    },
    index: {
        type: Number,
        required: true
    },
    layoutType:{
        type: String,
        required: true,
        enum: ["list", "ads"],
        default: "list",
    },
    publishDate:{
        type: Date,
        required: true,
        default: Date.now
    },
    adsLayout:{
        type: mongoose.Schema.ObjectId,
        required: false,
        ref: "Ads"
    },
    status: {
        type: String,
        required: true,
        default: "Active"
    }
});
export const Layout = mongoose.model('Layout', layoutSchema);