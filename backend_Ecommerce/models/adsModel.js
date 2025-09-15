import mongoose from "mongoose";

const adsSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    link:{
        type: String,
        required: false
    },
    adsType:{
        type: String,
        enum: ["standard", "vertical", "horizontal"],
        required: true
    },
    publishDate:{
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        default: "Active"
    }
});
export const Ads = mongoose.model('Ads', adsSchema);