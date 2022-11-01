const mongoose = require("mongoose");

const PlayListSchema = new mongoose.Schema(
    {
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        name: {type: String, required: true},
        media: {type: Array, default: []},
        isPrivate: {type: Boolean, default: false},
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("PlayList", PlayListSchema);