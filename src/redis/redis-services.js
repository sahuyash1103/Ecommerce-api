const { createClient } = require("redis");
const { REDIS_EXP_TIME, REDIS_CLOUD_PASSWORD } = require("../utils/get-env");

const redisClient = createClient(REDIS_CLOUD_PASSWORD && {
    password: REDIS_CLOUD_PASSWORD,
    socket: {
        host: 'redis-10596.c264.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 10596
    }
});

async function initRedis() {
    redisClient.on('error', err => console.log('Redis Client Error: ', err));
    redisClient.on('connect', () => {
        if (REDIS_CLOUD_PASSWORD)
            console.log('connected to Redis Server...[CLOUD]');
        else
            console.log('connected to Redis Server... [LOCAL]');
    })
    redisClient.on('disconnect', () => console.log('disconnected to Redis Server...'))

    await redisClient.connect();
}


const getKey = async (key) => {
    const value = await redisClient.get(key);
    return JSON.parse(value);
}

const setExKey = async (key, value) => {
    await deleteKey(key);
    const res = await redisClient.setEx(key, REDIS_EXP_TIME, JSON.stringify(value));
    return res;
}

const deleteKey = async (key) => {
    const res = await redisClient.del(key);
    return res;
}


module.exports = { initRedis, setExKey }