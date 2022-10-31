const verify = require("../verifyToken");
const router = require("express").Router();
const Media = require("../models/Media");
const User = require("../models/User");

router.get("/userAll", verify, async (req, res) => {
    const user_id = req.user.id;
    const uploads = await Media.find({user: user_id});
    res.json(uploads);
});

router.get("/recommended", verify, async (req, res) => {
    const user_id = req.user.id;
    // all media that the user has not uploaded
    const uploads = await Media.find({user: {$ne: user_id}});
    // add user info to each media
    const uploadsWithUserInfo = await Promise.all(uploads.map(async (upload) => {
        const user = await User.findById(upload.user);
        return {...upload._doc, username: user.username};
    }
    ));
    res.json(uploadsWithUserInfo);
});

module.exports = router;