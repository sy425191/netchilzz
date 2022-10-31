const verify = require("../verifyToken");
const router = require("express").Router();
const Media = require("../models/Media");

router.get("/userAll", verify, async (req, res) => {
    const user_id = req.user.id;
    const uploads = await Media.find({user: user_id});
    res.json(uploads);
});

module.exports = router;