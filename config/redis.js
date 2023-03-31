const redis = require("redis")

const client = redis.createClient({
    host: "localhost",
    port: "6379"
})


client.connect().then(() => console.log('REDIS CONNECTED SUCCESSFULLY')).catch(err => console.log(err))


module.exports = client