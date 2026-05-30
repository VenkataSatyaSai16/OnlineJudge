const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    problemsSolved: { type: Number, required: true, default: 0 },
});

statusSchema.index({ problemsSolved: -1 });

const Status = mongoose.model("Status", statusSchema);

module.exports = Status;

