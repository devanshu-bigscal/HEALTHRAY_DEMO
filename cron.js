const nodeCron = require("node-cron")



exports.greeting = (payload) => {

    const morning = nodeCron.schedule("0 8 * * * ", () => {
        console.log(`Good morning ${payload.first_name}`)
    })


    const afterNoon = nodeCron.schedule("0 12 * * * ", () => {
        console.log(`Good Afternoon ${payload.first_name}`)
    })

    const evening = nodeCron.schedule("5 18 * * *", () => {
        console.log(`Good Evening ${payload.first_name}`)

    })


    morning.start()
    afterNoon.start()
    evening.start()
}