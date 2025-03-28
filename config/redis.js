const Redis = require("ioredis");

const REDIS_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REDIS_URL
    : "redis://127.0.0.1:6379";

const redisClient = new Redis(REDIS_URL);

redisClient.on("connect", () => console.log("Connected to Redis"));
redisClient.on("error", (err) => console.error("Redis error:", err));

module.exports = redisClient;
