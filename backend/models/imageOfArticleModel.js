import mongoose from "mongoose";

const imageOfArticleSchema = mongoose.Schema(
    {
        imageLink:{
            type: String,
            required: true
        },
        publishDate:{
            type: Date,
            required: true
        },
        articleID:{
            type: String,
            required: true
        }
    }
);
export const ImageOfArticle = mongoose.model('ImageOfArticle', imageOfArticleSchema);