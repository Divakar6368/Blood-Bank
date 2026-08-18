const { createClient } = require('redis');
const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
     socket: {
        host: 'cobweb-wash-treatment-81978.db.redis.io',
        port: 10703
    }
});
module.exports=redisClient;