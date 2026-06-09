import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
{
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User ID is required"]
    },

    problemId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Problem",
        required:[true,"Problem ID is required"]
    },

    language:{
        type:String,
        required:[true,"Programming language is required"],
        enum:{
            values:["cpp","python"],
            message:"Language must be cpp or python"
        }
    },

    code:{
        type:String,
        required:[true,"Code cannot be empty"]
    },

    verdict:{
        type:String,
        required:[true,"Verdict is required"],
        enum:{
            values:[
                "Accepted",
                "Wrong Answer",
                "Runtime Error",
                "Compilation Error",
                "Time Limit Exceeded"
            ],
            message:"Invalid verdict"
        }
    },

    executionTime:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
}
);

const Submission = mongoose.model(
    "Submission",
    SubmissionSchema
);

export default Submission;