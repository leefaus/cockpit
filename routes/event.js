const express = require("express");
const router = express.Router();
const Event = require("../models/event");

let done = function (err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
};

router.get("/events", (req, res, next) => {
  //this will return all the data, exposing only the id and action field to the client
  Event.find({}, ["type", "source", "release"])
    .then((data) => res.json(data))
    .catch(next);
});

router.post("/events", (req, res, next) => {
  if (req.body.version) {
    Event.create(req.body)
      .then(function (data) {
        Release.findOneAndUpdate(
          { _id: data.release },
          { $push: { events: data._id } },
          done
        );
        return data;
      })
      .then((data) => res.json(data))
      .catch(next);
  } else {
    res.json({
      error: "The input field is empty",
    });
  }
});

module.exports = router;
