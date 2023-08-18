const router = require("express").Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");

const { validateLoginData } = require("../../services/user/user-data-validators");
const { getUserData } = require("../../services/user/user-services");

// -----------------------------------LOGIN ROUTE
router.post("/", async (req, res) => {
  const error = await validateLoginData(req.body);
  if (error) return res.status(401).send(error.details[0].message);

  let result = await getUserData(req.body.email);

  if (result.error) return res.status(500).send(result.error);

  user = result.data;
  if (!user) return res.status(401).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(401).send("Invalid email or password.");

  const jwtToken = `Bearer ${user.genrateAuthToken()}`;
  res
    .json({
      jwtToken: jwtToken,
      user: _.pick(user, ["name", "email", "phone"])
    })
    .status(200);
});

module.exports = router;
