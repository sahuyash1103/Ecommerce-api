// ---------------------------------IMPORTS
const router = require("express").Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");

const User = require("../../mongo/models/user-model");
const { validateSignupData } = require("../../services/user/user-data-validators");
const { setExKey } = require("../../redis/redis-services");
const { getUserData } = require('../../services/user/user-services')

// ------------------------------------------SINGUP ROUTE
router.post("/", async (req, res) => {
  const error = await validateSignupData(req.body);
  if (error) return res.status(401).send(error.details[0].message);

  let result = await getUserData(req.body.email);

  if (result.error) return res.status(500).send(result.error);

  let user = result.data;
  if (user) return res.status(200).send("User already registered.");

  user = new User({
    userName: req.body.userName,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);

  user.password = await bcrypt.hash(req.body.password, salt);

  await user.save();
  await setExKey(user.email, user);

  const jwtToken = `Bearer ${user.genrateAuthToken()}`;
  res
    .json({
      jwtToken: jwtToken,
      user: _.pick(user, ["userName", "email", "phone"])
    })
    .status(200);
});

module.exports = router;
