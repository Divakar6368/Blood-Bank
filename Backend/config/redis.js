const { createClient } = require('redis');
const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
     socket: {
        host: 'wren-rub-marvellous-76973.db.redis.io',
        port: 13795
    }
});
module.exports=redisClient;