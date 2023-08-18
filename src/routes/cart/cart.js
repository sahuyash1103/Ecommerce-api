const authenticate = require('../../middlewares/authenticate-user');

const router = require('express').Router();

router.post("/get", authenticate, (req, res) => {

});

module.exports = router