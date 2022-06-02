const router = require("express").Router();
const User = require("../models/User.model");
const Job = require("../models/Job.model");

/*  */
/* router.post("/user", (req, res, next) => {
  const { email, password } = req.body;
  User.create({ email, password, address: "", jobList: [] })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
}); */

// this is the user "landing page" with the information he/she can modify and the list of Jobs he/she already created on the website:
router.get("/user-profile/:id", (req, res, next) => {
  User.find()
    .populate("jobList")
    .then((User) => res.json(User))
    .catch((err) => res.json(err));
});

// the below route is on the user profile when he/she edits it to then create the cover letter (in the CL flow)
router.put("/user-profile/:id", (req, res, next) => {
  const { userId } = req.params;

  User.findByIdAndUpdate(userId, req.body, { new: true })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

module.exports = router;