require('dotenv').config();

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
const REDIS_EXP_TIME = process.env.REDIS_EXP_TIME || 60 * 5; // in sec
const REDIS_CLOUD_PASSWORD = process.env.REDIS_CLOUD_PASSWORD;

module.exports = { PORT, MONGO_URI, JWT_PRIVATE_KEY, REDIS_EXP_TIME, REDIS_CLOUD_PASSWORD }
