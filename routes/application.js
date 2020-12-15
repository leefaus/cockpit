const express = require("express");
const router = express.Router();
const Application = require("../models/application");
const Release = require("../models/release");
const Event = require("../models/event");
const { populate } = require("../models/event");

router.get("/applications", (req, res, next) => {
  //this will return all the data, exposing only the id and action field to the client
  Application.find({}, ["name", "owner", "releases"])
    .then((data) => res.json(data))
    .catch(next);
});

router.get("/applications/:id", (req, res, next) => {
  //this will return all the data, exposing only the id and action field to the client
  Application.findOne({ _id: req.params.id }, ["name", "owner"])
    .populate(
      {
        path: "releases",
        model: Release,
        populate: { path: "events", model: Event }
      }
    )
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
