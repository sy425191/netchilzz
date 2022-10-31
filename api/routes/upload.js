const router = require("express").Router();
const Multer = require("multer");
const Media = require("../models/Media");
const User = require("../models/User");
const verify = require("../verifyToken");
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5000 * 1024 * 1024, // no larger than 5000mb, you can change as needed.
  },
});

router.post("/add_content", verify, async (req, res) => {
    const tags = req.body.tags.split(",");
    const filteredTags = tags.filter((tag) => tag !== "").map((tag) => tag.trim())
    const newMedia = new Media({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
      imgUrl: req.body.imgUrl,
      mediaUrl: req.body.mediaUrl,
      type: req.body.type,
      private: req.body.isPrivate,
      tags: filteredTags,
    })

    try{
      const media = await newMedia.save();
      res.json({success: true});
    }
    catch (err){
      console.log(err);
    }
});

module.exports = router;
