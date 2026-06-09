import Submission from "../models/Submission.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Submission.aggregate([
      {
        $match: {
          verdict: "Accepted",
        },
      },

      {
        $group: {
          _id: "$userId",

          solvedProblems: {
            $addToSet: "$problemId",
          },
        },
      },

      {
        $project: {
          solvedCount: {
            $size: "$solvedProblems",
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },

      {
        $project: {
          _id: 1,
          solvedCount: 1,
          username: "$user.username",
          email: "$user.email",
        },
      },

      {
        $sort: {
          solvedCount: -1,
        },
      },
    ]);

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Leaderboard Fetch Error",
    });
  }
};
