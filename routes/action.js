const express = require("express");
const router = express.Router();
const { Action } = require("../models/rule");

let done = function (err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
};

router.get("/actions", (req, res, next) => {
  //this will return all the data, exposing only the id and action field to the client
  Action.find({})
    .then((data) => res.json(data))
    .catch(next);
});

router.post("/actions", (req, res, next) => {
  if (req.body.event_type) {
    Action.create(req.body)
      .then((data) => res.json(data))
      .catch(next);
  } else {
    res.json({
      error: "The input field is empty",
    });
  }
});

router.post("/loopback", (req, res, next) => {
  console.log("testing = ", req.body);
  res.json(req.body);
});

module.exports = router;
