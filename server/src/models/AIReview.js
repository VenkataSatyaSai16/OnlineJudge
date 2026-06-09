import mongoose from "mongoose";

const AIReviewSchema = new mongoose.Schema(
{
    submissionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Submission",
        required:[true,"Submission ID is required"]
    },

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User ID is required"]
    },

    complexity:{
        type:String,
        default:""
    },

    score:{
        type:Number,
        min:[0,"Score cannot be less than 0"],
        max:[10,"Score cannot exceed 10"]
    },

    suggestions:[
        {
            type:String
        }
    ],

    improvedCode:{
        type:String,
        default:""
    }
},
{
    timestamps:true
}
);

const AIReview = mongoose.model(
    "AIReview",
    AIReviewSchema
);

export default AIReview;