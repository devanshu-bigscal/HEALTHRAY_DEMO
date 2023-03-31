const bull = require("bull")
const moment = require('moment')
const cron = require("node-cron")
// // sec min hour day month week
// const cron = nodeCron.schedule("23-25 11 * * 5", () => {
//     console.log('hello world')
// })



// cron.start()
// // cron.stop()



const firstQueue = new bull("firstQueue")


exports.addEmailToQueue = async (payload) => {

    const createdAt = moment(payload.createdAt).valueOf()

    const afterduration = moment(createdAt).add(1, "m").valueOf()
    const delayTime = moment(afterduration).subtract(createdAt).valueOf()


    const options = {
        delay: delayTime,
        attempts: 2,

    }
    firstQueue.add(payload, options)

    firstQueue.process(job => {
        const { data } = job
        console.log(`Verification mail sent to ${data.email} !!`)
    })
}




