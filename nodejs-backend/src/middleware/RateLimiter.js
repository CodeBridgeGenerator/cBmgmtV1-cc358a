const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis");
const redisClient = new Redis();
const rateLimiter = new RateLimiterRedis({ storeClient: redisClient, points: 100, duration: 60 });

// const rateLimiter = new RateLimiterMemory({
//   points: 100,   // Number of allowed requests
//   duration: 60,  // Per 60 seconds
// });

module.exports = function rateLimit() {
  return async context => {
    // Identify the client
    const key =
      context.params?.headers?.["x-api-key"] ||
      (context.params?.headers?.authorization || "").replace(/^ApiKey\s+/i, "") ||
      context.params?.user?._id ||
      context.params?.ip ||
      "anonymous";

    try {
      await rateLimiter.consume(key); // subtract one point
      return context;
    } catch {
      // Throw a Feathers-compatible error
      const error = new Error("Too many requests. Please try again later.");
      error.code = 429;
      error.name = "TooManyRequests";
      error.className = "too-many-requests";
      throw error;
    }
  };
};
