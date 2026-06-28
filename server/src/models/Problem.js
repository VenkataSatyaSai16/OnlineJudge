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

    sampleTestCases:[
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

    hiddenTestCases:[
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

    timeLimit:{
        type:Number,
        default:2
    },

    memoryLimit:{
        type:Number,
        default:256
    },

    functionSignature:{
        type:String,
        default:""
    },

    source:{
        type:String,
        enum:{
            values:["manual","mockoa"],
            message:"Source must be manual or mockoa"
        },
        default:"manual"
    },

    visibility:{
        type:String,
        enum:{
            values:["public","private"],
            message:"Visibility must be public or private"
        },
        default:"public"
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },

    oaId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"MockOA",
        default:null
    },

    expectedFunctionSignature:{
        type:String,
        default:""
    },

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

ProblemSchema.index({ visibility:1, createdAt:-1 });
ProblemSchema.index({ owner:1, oaId:1, source:1 });
ProblemSchema.index({ difficulty:1, tags:1 });

const Problem = mongoose.model("Problem", ProblemSchema);

export default Problem;
