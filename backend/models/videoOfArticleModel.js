import mongoose from "mongoose";

const videoOfArticleSchema = mongoose.Schema(
    {
        videoLink:{
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
export const VideoOfArticle = mongoose.model('VideoOfArticle', videoOfArticleSchema);