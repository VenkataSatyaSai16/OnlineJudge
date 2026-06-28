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
            values:["cpp","python","c","java","javascript"],
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
                "Rejected",
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
    },

    memory:{
        type:Number,
        default:0
    },

    passedTestCases:{
        type:Number,
        default:0
    },

    totalTestCases:{
        type:Number,
        default:0
    },

    oaId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"MockOA",
        default:null
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
