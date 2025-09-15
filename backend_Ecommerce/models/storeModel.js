import mongoose from "mongoose";

const storeSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: false
        },
        address:{
            type: String,
            required: true
        },
        taxCode:{
            type: String,
            required: true
        },
        logo:{
            type: String,
            required: false
        },
        follower:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        manager:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        rating:{
            type: Number,
            required: false,
            default: 0
        },
        publishDate:{
            type: Date,
            default: Date.now,
            required: true,
        },
        status: {
            type: String,
            enum: ["Active", "banned"], 
            default: "Active",
          },
        
    }
);
export const Store = mongoose.model('Store', storeSchema);