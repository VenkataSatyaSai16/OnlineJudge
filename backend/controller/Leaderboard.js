const Status = require("../model/StatusDB");


const leaderboard = async (req, res) => {
    try {
        const leaderboardData = await Status.aggregate([
            {
                $addFields: {
                    userObjectId: { $toObjectId: "$id" }
                }
            },
            {
                $lookup: {
                    from: "authusers",
                    localField: "userObjectId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    userId: "$id",
                    username: {
                        $trim: {
                            input: {
                                $concat: [
                                    { $ifNull: ["$user.firstName", ""] },
                                    " ",
                                    { $ifNull: ["$user.lastName", ""] }
                                ]
                            }
                        }
                    },
                    score: "$problemsSolved"
                }
            },
            { $sort: { score: -1, userId: 1 } },
            { $limit: 100 }
        ]);

        res.json(leaderboardData);
    } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch leaderboard data"
        });
    }
};

module.exports = {
    leaderboard
};
