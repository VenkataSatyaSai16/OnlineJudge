import Submission from "../models/Submission.js";

export const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 })
      .populate("problemId", "title difficulty");

    if (submissions.length === 0) {
      return res.status(200).json({
        message: "No submissions found",
        submissions:[]
      });
    }
    return res.status(200).json({
      message: "Submissions",
      submissions,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      message: "Submission Fetch failed",
    });
  }
};
