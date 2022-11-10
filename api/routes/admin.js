const router = require("express").Router();
const Media = require("../models/Media");
const User = require("../models/User");
const verify = require("../verifyTokenAdmin");

router.post("/getusers", verify, (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(users);
  });
});

router.post("/deleteuser", verify, (req, res) => {
    User.findByIdAndDelete(req.body.id, (err, user) => {
        if (err) return res.status(500).json(err);
        res.status(200).json("User has been deleted...");
    });
});

// ban user
router.post("/banuser", verify, (req, res) => {
    User.findByIdAndUpdate(
        req.body.id,
        { status: false },
        (err, user) => {
            if (err) return res.status(500).json(err);
            res.status(200).json("User has been banned...");
        }
    );
});

// unban user
router.post("/unbanuser", verify, (req, res) => {
    User.findByIdAndUpdate(
        req.body.id,
        { status: true },
        (err, user) => {
            if (err) return res.status(500).json(err);
            res.status(200).json("User has been unbanned...");
        }
    );
});

// get al media 
router.post("/getmedia", verify, (req, res) => {
    Media.find({}, (err, media) => {
        if (err) return res.status(500).json(err);
        res.status(200).json(media);
    });
});




module.exports = router;
