'use strict'

const mongoose = require('mongoose');

exports.init=()=>{
    const uriMongo = 'mongodb+srv://admin:123@cluster0.foatmfg.mongodb.net/?retryWrites=true&w=majority'
    mongoose.Promise = global.Promise;

    mongoose.connection.on('error', ()=>{
        console.log('MongoDB| Could not connect to mongodb');
        mongoose.disconnect;
    });
    mongoose.connection.on('connecting', ()=>{
        console.log('MongoDB| Try connecting');
    });
    mongoose.connection.on('connected', ()=>{
        console.log('MongoDB| Connected to mongodb');
    });
    mongoose.connection.once('open', ()=>{
        console.log('MongoDB| Connected to database');
    });
   mongoose.connection.on('reconnected', ()=>{
       console.log('MongoDB| Reconnected to mongodb');
   });
   mongoose.connection.on('disconnected', ()=>{
       console.log('MongoDB| Disconnected');
   });

   mongoose.connect(uriMongo, {
       connectTimeoutMS: 2500,
       maxPoolSize: 50,
       useNewUrlParser: true
   }).catch(err=>console.log(err));
}