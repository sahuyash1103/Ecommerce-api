
// ---------------------------/API/AUTH/LOGIN ROUTE
/**
 * @swagger:
 * /api/auth/login:
 *  post:
 *      summery: for authentication using email and password
 *      tags: [AUTH]
 *      requestBody:
 *          discription: for authentication
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
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
