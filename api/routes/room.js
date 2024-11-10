const router = require("express").Router();
const RoomList = require("../models/Room");
const verify = require("../verifyToken");

router.get('/:roomId', verify, (req, res) => {
    const roomId = req.params.roomId;
    RoomList.findById(roomId, (err, result) => {
        if (err) {
            return res.status(422).json({ error: err });
        } else {
            res.json(result);
        }
    });
})

module.exports = router;