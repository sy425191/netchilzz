const router = require("express").Router();
const User = require("../models/User");
const Media = require("../models/Media");
const verify = require("../verifyToken");

router.post("/addtoFavorites", verify, (req, res) => {
  const { mediaId } = req.body;
  const userId = req.user.id;
  User.findByIdAndUpdate(
    userId,
    {
      $addToSet: {
        favorites: mediaId,
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json("Successfully added to favorites");
      }
    }
  );
});

router.post("/removefromFavorites", verify, (req, res) => {
  const { mediaId } = req.body;
  const userId = req.user.id;
  User.findByIdAndUpdate(
    userId,
    {
      $pull: {
        favorites: mediaId,
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json("Successfully Removed from to favorites");
      }
    }
  );
});

router.post("/isFavorite", verify, (req, res) => {
  const { mediaId } = req.body;
  const userId = req.user.id;
  User.findById(userId, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      if (result.favorites.includes(mediaId)) {
        res.json(true);
      } else {
        res.json(false);
      }
    }
  });
});

router.post("/favorites", verify, async (req, res) => {
  const userId = req.user.id;
  User.findById(userId, (err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      const favorites = result.favorites;
      const media = [];
      favorites.forEach(async (favorite) => {
        Media.findById(favorite, (err, result) => {
          if (err) {
          } else {
            media.push(result);
            console.log("added");
          }
        });
      });
      const interval = setInterval(() => {
        if (media.length === favorites.length) {
          res.json(media);
          clearInterval(interval);
          return;
        }
      }, 100);
    }
  });
});

module.exports = router;
