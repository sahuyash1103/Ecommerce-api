// -----------------------------IMPORTS AND VARIABLES
const express = require('express');
const morgan = require('morgan');
const cors = require("cors");

const { PORT } = require('./src/utils/get-env');
const { initMongo } = require('./src/mongo/mongo-services');
const { initRedis } = require('./src/redis/redis-services');
const { checkEnvironmentVariable } = require('./src/utils/check-env-var');

let error;
const app = express();

// ----------------------------------CHECK ENV VARIABLES
error = checkEnvironmentVariable();

// ----------------------------------INIT MONGO AND REDIS
initRedis();
initMongo();

// -------------------------CORS
app.use(
    cors({
        origin: "*",
        methods: "*",
        allowedHeaders: "*",
        exposedHeaders: "*",
    })
);


// ----------------------------------MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));


// -----------------------------------SERVER STATUS ROUTES
app.get('/', (req, res) => {
    res.json({ message: 'server is runnin...', error: error }).status(200);
});

app.get('/api/', (req, res) => {
    res.json({ message: 'server is runnin...', error: error }).status(200);
});

// ---------------------------------SERVER LISTENING
app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}...`);
})