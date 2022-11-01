const verify = require("../verifyToken");
const router = require("express").Router();
const Media = require("../models/Media");
const User = require("../models/User");

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
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.post("/search", verify, async (req, res) => {
  const user_id = req.user.id;
  const { query, sort, filter } = req.body;
  if (query == "") {
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


const getMediaWithUserInfo = async (media) => {
  const user = await User.findById(media.user);
  return { ...media._doc, username: user.username };
};

module.exports = router;
