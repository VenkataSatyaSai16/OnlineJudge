import Submission from "../models/Submission.js";
import { getCache, setCache } from "../services/cacheService.js";

export const getLeaderboard = async (req, res) => {
  try {
    const cached = await getCache("leaderboard:global");
    if (cached) return res.status(200).json(cached);

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

    await setCache("leaderboard:global", leaderboard, 120);
    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Leaderboard Fetch Error",
    });
  }
};
