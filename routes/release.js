const express = require("express");
const router = express.Router();
const Release = require("../models/release");
const Application = require("../models/application");

let done = function (err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
}

router.get("/releases", (req, res, next) => {
  //this will return all the data, exposing only the id and action field to the client
  Release.find({}, ["version", "current", "application", "events"])
    .then((data) => res.json(data))
    .catch(next);
});

router.post("/releases", (req, res, next) => {
  if (req.body.version) {
    Release.create(req.body)
      .then(function (data) {
        Application.findOneAndUpdate({ "components._id": data.component }, { $push: { "components.$.releases": data._id } }, done)
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
