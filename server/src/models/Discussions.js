import mongoose from "mongoose";

const DiscussionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    discussion: {
        type : String,
        required : [true,"Discussion or comment is required"],
    },

    commentsCount:{
      type:Number,
      default:0,
    },

    editedAt:{
      type:Date,
      default:null,
    },
  },
  {
    timestamps: true,
  },
);

DiscussionSchema.index({ createdAt:-1 });
DiscussionSchema.index({ userId:1, createdAt:-1 });

const Discussion = mongoose.model("Discussion" ,DiscussionSchema);

export default Discussion;
