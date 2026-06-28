import mongoose from "mongoose";

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    hoursPerDay: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    weeks: [
      {
        week: Number,
        days: [
          {
            day: Number,
            focus: String,
            problems: [{
              title: String,
              difficulty: String,
              tags: [String]
            }],
            completed: {
              type: Boolean,
              default: false,
            }
          }
        ]
      }
    ]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("StudyPlan", studyPlanSchema);
