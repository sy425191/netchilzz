const Playlist = require("../models/Playlist");
const verify = require("../verifyToken");
const router = require("express").Router();

router.get("/all", verify, async (req, res) => {
  const userId = req.user.id;
  try {
    const playlists = await Playlist.find({ user: userId });
    res.status(200).json(playlists);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new playlist
router.post("/add", verify, async (req, res) => {
  const userId = req.user.id;
  const newPlaylist = new Playlist({
    user: userId,
    name: req.body.playlistName,
  });
  try {
    const playlist = await newPlaylist.save();
    res.status(201).json(playlist);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get all playlist of a user
router.post("/list", verify, (req, res) => {
  const userId = req.user.id;
  //   all user playlists
  Playlist.find({ user: userId }, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.post("/addto", verify, (req, res) => {
  const { playlistId, mediaId } = req.body;
  const userId = req.user.id;
  // if already in playlist
  Playlist.findById(playlistId, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      if (result.media.includes(mediaId)) {
        return res.status(422).json({ error: "Already in playlist" });
      } else {
        Playlist.findByIdAndUpdate(
          playlistId,
          {
            $addToSet: {
              media: mediaId,
            },
          },
          { new: true },
          (err, result) => {
            if (err) {
              return res.status(422).json({ error: err });
            } else {
              res.json("Successfully added to playlist");
            }
          }
        );
      }
    }
  });
});

router.post("/get", verify, (req, res) => {
  const { playlistId } = req.body;
  const userId = req.user.id;
  Playlist.findById(playlistId, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      if (result.isPrivate && result.user != userId) {
        return res.status(422).json({ error: "Not authorized" });
      } else {
        res.json(result);
      }
    }
  });
});

router.post("/delete", verify, (req, res) => {
  const { playlistId } = req.body;
  const userId = req.user.id;
  Playlist.findById(playlistId, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      if (result.user != userId) {
        return res.status(422).json({ error: "Not authorized" });
      } else {
        Playlist.findByIdAndDelete(playlistId, (err, result) => {
          if (err) {
            return res.status(422).json({ error: err });
          } else {
            res.json("Successfully deleted");
          }
        });
      }
    }
  });
});

router.post("/removefrom", verify, (req, res) => {
    const { playlistId, mediaId } = req.body;
    const userId = req.user.id;
    Playlist.findById(playlistId, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        } else {
            if (result.user != userId) {
                return res.status(422).json({ error: "Not authorized" });
            } else {
                Playlist.findByIdAndUpdate(
                    playlistId,
                    {
                        $pull: {
                            media: mediaId,
                        },
                    },
                    { new: true },
                    (err, result) => {
                        if (err) {
                            return res.status(422).json({ error: err });
                        } else {
                            res.json("Successfully removed from playlist");
                        }
                    }
                );
            }
        }
    });
});


module.exports = router;
