const Status = require("../model/StatusDB");

const addUserToLeaderboard = async (user) => {
    return Status.findOneAndUpdate(
        { id: user._id.toString() },
        {
            $setOnInsert: {
                id: user._id.toString(),
                problemsSolved: 0
            }
        },
        {
            upsert: true,
            new: true
        }
    );
};

const updateLeaderboardScore = async (userId, scoreToAdd = 0) => {
    return Status.findOneAndUpdate(
        { id: userId.toString() },
        { $inc: { problemsSolved: scoreToAdd } },
        { new: true }
    );
};

module.exports = {
    addUserToLeaderboard,
    updateLeaderboardScore
};
