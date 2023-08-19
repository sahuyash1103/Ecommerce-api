
// ---------------------------/API/AUTH/SIGNUP ROUTE
/**
 * @swagger:
 * /api/auth/signup:
 *  get:
 *      summery: for registring new user
 *      tags: [AUTH]
 *      requestBody:
 *          discription: for authentication
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          userName:
 *                              type: string
 *                              required: true
 *                          phone:
 *                              type: string
 *                              required: true
 *                          email:
 *                              type: string
 *                              required: true
 *                          password:
 *                              type: string
 *                              required: true    
 *      responses:
 *          500:
 *              description: server serror
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *          401:
 *              description: Invalid email or password
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string || object
 *          
 *          200:
 *              discription: successfuly loged in
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              jwtToken:
 *                                  type: string
 *                              user:
 *                                  type: object
 *                                  $ref: '#/components/schemas/User'
 * 
 */


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
