import mongoose from "mongoose";

const searchSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        searchHistory: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Search", searchSchema);
