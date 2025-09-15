import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: false
        },
        category:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        }],
        soldQuantity:{
            type: Number,
            required: true,
            default: 0,
        },
        totalStockQuantity:{
            type: Number,
            required: true,
            default: 20,
        },
        price: {
            type: Number,
            required: true
        },
        salePrice: {
            type: Number,
            required: false
        },
        isSale:{
            type:Boolean,
            required: true
        },
        publishDate:{
            type: Date,
            default: Date.now,
            required: true,
        },
        store: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Store"
        },
        status: {
            type: String,
            default: "Active",
        },
        rating:{
            type: Number,
            required: false,
            default: 0
        },
        images:{
            type: [String],
            required: false
        },
        comments:[
            {
                userID: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                },
                rating: {
                    type: Number,
                    min: 1,
                    max: 5,
                    default: 0,
                    required: true
                },
                descriptionImages:{
                    type: [String]
                },
                description:{
                    type: String,
                },
                commmentDate:{
                    type: Date,
                    default: Date.now,
                    required: true
                }
            }
        ],
        attributes: [
            {
              name: String, 
              values: [
                {
                    attributeName: String,
                    stockQuantity: Number,
                    attributeImage: String,
                    priceAttribute: Number
                }
              ], 
            },
        ],
    }
);
export const Product = mongoose.model('Product', productSchema);