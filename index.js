'use strict'

const UserController = require('./src/controllers/user.controller');
const mongoConfig = require('./configs/mongoConfig');
const app = require('./configs/app');
const port = process.env.PORT || 3200 ;

mongoConfig.init();
UserController.createAdmin();

app.listen(port,()=>{
    console.log(`Server start in port ${port}`);
});