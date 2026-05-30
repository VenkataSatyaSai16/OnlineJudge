const express = require("express");
const { leaderboard } = require("../controller/Leaderboard");

const router = express.Router();

router.get('/', leaderboard);

module.exports = router;