const express = require("express");
const router = express.Router();
const Release = require("../models/release");
const Event = require("../models/event");

let done = function (err, result) {
  if (err) {
    console.log(err);
  } else {
    console.log(result);
  }
};

router.post("/webhooks/:id/:type", (req, res, next) => {
  console.log(req.headers)
  const release = Release.findOne({ application: req.params.id, current: true }, done)
    .then((data) => console.log(data))
    .catch(next);
  const event = Event.create({
    type: req.params.type,
    source: req.headers,
    release: release._id,
    nested: { raw: req.body },
  })
    .then((data) => console.log(data))
    .catch(next);
  Release.findOneAndUpdate({_id: release._id},
    { $push: { events: event._id } },
    done
  ).then(res.json(event));
});

module.exports = router;