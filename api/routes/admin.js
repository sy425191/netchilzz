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

// ban user (if user is banned, then unban user)
router.post("/banuser", verify, (req, res) => {
    User.findByIdAndUpdate(
        req.body.id,
        { $set: { status: req.body.status } },
        (err, user) => {
            if (err) return res.status(500).json(err);
            res.status(200).json("Ok..");
        }
    );
});

// get al media 
router.post("/getmedia", verify, (req, res) => {
    Media.find({}, (err, media) => {
        if (err) return res.status(500).json(err);
        // populate user
        User.populate(media, { path: "user" }, (err, media) => {
            if (err) return res.status(500).json(err);
            res.status(200).json(media);
        });
    });
});


// delete media
router.post("/deletemedia", verify, (req, res) => {
    Media.findByIdAndDelete(req.body.id, (err, media) => {
        if (err) return res.status(500).json(err);
        res.status(200).json("Media has been deleted...");
    });
});




module.exports = router;
