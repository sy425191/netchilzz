const { verify } = require("jsonwebtoken");
const Playlist = require("../models/Playlist");

const router = require("express").Router();

router.post("/all", verify, async (req, res) => {
  const { userId } = req.user;
    try{
        const playlists = await Playlist.find({user: userId});
        res.status(200).json(playlists);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post("/add", verify, async (req, res) => {
    const { userId } = req.user;
    const newPlaylist = new Playlist({
        user: userId,
        name: req.body.name,
    });
    try{
        const playlist = await newPlaylist.save();
        res.status(201).json(playlist);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
