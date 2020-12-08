const express = require("express");
const router = express.Router();
const Application = require("../models/application");

router.get("/applications", (req, res, next) => {
  //this will return all the data, exposing only the id and action field to the client
  Application.find({}, ["name", "owner", "releases"])
    .then((data) => res.json(data))
    .catch(next);
});

router.post("/applications", (req, res, next) => {
  if (req.body.name) {
    Application.create(req.body)
      .then((data) => res.json(data))
      .catch(next);
  } else {
    res.json({
      error: "The input field is empty",
    });
  }
});

module.exports = router;
