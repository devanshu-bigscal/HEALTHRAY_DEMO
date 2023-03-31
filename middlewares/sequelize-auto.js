const { SequelizeAuto } = require("sequelize-auto")


const auto = new SequelizeAuto('HEALTHRAY_DEMO', 'root', 'root@1234', {
    host: 'localhost',
    dialect: 'mysql',
    directory: './models', // where to write files
    port: '3306',
    caseModel: 'c', // convert snake_case column names to camelCase field names: user_id -> userId
    caseFile: 'c', // file names created for each model use camelCase.js not snake_case.js
    singularize: true, // convert plural table names to singular model names
    additional: {
        timestamps: true
        // ...options added to each model
    },
    //...
})

auto.run()