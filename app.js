const express = require("express")
const app = express()
require("dotenv").config()
const { sequelize } = require("./models/index")
const familyMemberRoutes = require("./routes/familyMember")
const organizationRoutes = require("./routes/organization")
const redis = require("./config/redis")

app.use(express.json())
app.use("/", familyMemberRoutes)
app.use("/", organizationRoutes)

const port = process.env.PORT ?? 8000

sequelize.authenticate().then(() => {
    console.log(`DB CONNECTED SUCESSFULLY`)
    app.listen(port, () => {
        console.log(`SERVER RUNNING AT PORT : ${port}`)
    })
})



