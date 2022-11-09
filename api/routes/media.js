const verify = require("../verifyToken");
const router = require("express").Router();
const Media = require("../models/Media");
const User = require("../models/User");
const Room = require("../models/Room");
var httpProxy = require("http-proxy");
const { default: mongoose } = require("mongoose");

router.get("/userAll", verify, async (req, res) => {
  const user_id = req.user.id;
  const uploads = await Media.find({ user: user_id });
  res.json(uploads);
});

router.get("/recommended", verify, async (req, res) => {
  const user_id = req.user.id;
  // all media that the user has not uploaded
  const uploads = await Media.find({ user: { $ne: user_id } });
  // add user info to each media
  const uploadsWithUserInfo = await Promise.all(
    uploads.map(async (upload) => {
      const user = await User.findById(upload.user);
      return { ...upload._doc, username: user.username };
    })
  );
  res.json(uploadsWithUserInfo);
});

router.post("/get", verify, async (req, res) => {
  const media_id = req.body.mediaId;

  try {
    const media = await Media.findById(media_id);
    if (!media.isPrivate) {
      const mediaWithUserInfo = await getMediaWithUserInfo(media);
      res.json(mediaWithUserInfo);
    } else {
      const user_id = req.user.id;
      if (media.user == user_id) {
        res.json(mediaWithUserInfo);
      } else {
        res.status(403).json("This media is private");
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/search", verify, async (req, res) => {
  const user_id = req.user.id;
  const { query, sort, filter } = req.body;
  if (query === "") {
    res.json([]);
    return;
  }
  // title, description, tags match query, public, not user's media
  // sort "NEWEST", "OLDEST", "MOST_STRAMED", "MOST_UPVOTE"
  // filter "ALL", "VIDEO", "AUDIO"
  const filterQuery = filter === "all" ? {} : { type: filter };

  const uploads = await Media.find({
    $and: [
      { user: { $ne: user_id } },
      { public: true },
      {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { tags: { $regex: query, $options: "i" } },
        ],
      },
      {
        ...filterQuery,
      },
    ],
  });

  // sort
  if (sort === "NEWEST") {
    uploads.sort((a, b) => b.createdAt - a.createdAt);
  } else if (sort === "OLDEST") {
    uploads.sort((a, b) => a.createdAt - b.createdAt);
  } else if (sort === "MOST_STRAMED") {
    uploads.sort((a, b) => b.streams - a.streams);
  } else if (sort === "MOST_UPVOTE") {
    uploads.sort((a, b) => b.upvotes - a.upvotes);
  }
  const maxResult = 30;
  uploads.splice(maxResult);

  const uploadsWithUserInfo = await Promise.all(
    uploads.map(async (upload) => {
      const user = await User.findById(upload.user);
      return { ...upload._doc, username: user.username };
    })
  );
  res.json(uploadsWithUserInfo);
});

// if put request on /api/media/<media_id>/like
router.put("/:id/like", verify, async (req, res) => {
  const media_id = req.params.id;
  const user_id = req.user.id;
  try {
    const media = await Media.findById(media_id);
    if (!media) {
      res.status(404).json("Media not found");
    } else {
      if (media.upvotes.includes(user_id)) {
        res.status(400).json("Already Liked");
      } else {
        await Media.findByIdAndUpdate(media_id, {
          $push: { upvotes: user_id },
        });
        await Media.findByIdAndUpdate(media_id, {
          $pull: { downvotes: user_id },
        });
        res.status(200).json("Liked");
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// if put request on /api/media/<media_id>/dislike
router.put("/:id/dislike", verify, async (req, res) => {
  const media_id = req.params.id;
  const user_id = req.user.id;
  try {
    const media = await Media.findById(media_id);
    if (!media) {
      res.status(404).json("Media not found");
    } else {
      if (media.downvotes.includes(user_id)) {
        res.status(400).json("Already Disliked");
      } else {
        await Media.findByIdAndUpdate(media_id, {
          $push: { downvotes: user_id },
        });
        await Media.findByIdAndUpdate(media_id, {
          $pull: { upvotes: user_id },
        });
        res.status(200).json("Disliked");
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// if put request on /api/media/<media_id>/view
router.put("/:id/view", verify, async (req, res) => {
  const media_id = req.params.id;
  const user_id = req.user.id;
  try {
    const media = await Media.findById(media_id);
    if (!media) {
      res.status(404).json("Media not found");
    } else {
      await Media.findByIdAndUpdate(media_id, {
        $inc: { streams: 1 },
      });
      res.status(200).json("Viewed");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/roomplaying/:id", async (req, res) => {
  const room_id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(room_id)) {
    res.status(400).json("Invalid room id");
    return;
  }
  const room = await Room.findById(room_id);
  if (!room) {
    res.status(404).json("Room not found");
    return;
  }
  const media = room.media;
  if(!media){
    res.json();
    return;
  }
  const proxy = httpProxy.createProxyServer({
    target: media,
    changeOrigin: true,
    ws: true,
  });

  proxy.on("error", (err, req, res) => {
    console.log(err);
    res.status(500).send("Something went wrong.");
  });

  proxy.web(req, res);
});

const getMediaWithUserInfo = async (media) => {
  const user = await User.findById(media.user);
  return { ...media._doc, username: user.username };
};

module.exports = router;
