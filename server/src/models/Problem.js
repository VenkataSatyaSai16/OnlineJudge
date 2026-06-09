import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:[true,"Problem title is required"],
        trim:true
    },

    description:{
        type:String,
        required:[true,"Problem description is required"]
    },

    difficulty:{
        type:String,
        required:[true,"Difficulty is required"],
        enum:{
            values:["Easy","Medium","Hard"],
            message:"Difficulty must be Easy, Medium or Hard"
        }
    },

    inputFormat:{
        type:String,
        required:[true,"Input format is required"]
    },

    outputFormat:{
        type:String,
        required:[true,"Output format is required"]
    },

    constraints:{
        type:String,
        required:[true,"Constraints are required"]
    },

    tags:[
        {
            type:String,
            trim:true
        }
    ],

    examples:[
        {
            input:{
                type:String,
                required:true
            },

            output:{
                type:String,
                required:true
            },

            explanation:{
                type:String,
                default:""
            }
        }
    ],

    testCases:[
        {
            input:{
                type:String,
                required:true
            },

            output:{
                type:String,
                required:true
            }
        }
    ],

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Creator is required"]
    }
},
{
    timestamps:true
}
);

const Problem = mongoose.model("Problem", ProblemSchema);

export default Problem;