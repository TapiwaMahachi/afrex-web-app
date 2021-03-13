import mongoose from 'mongoose';
import logger from './logger.js';
import {mongo , env} from './vars.js';

//exit application on error
mongoose.connection.on('error', (err)=>{
    logger.error(`MongoDb connection error: ${err}`);
    process.exit(-1);
})

//print mongoose logs in dev env
if(env === 'development') {
    mongoose.set('debug', true);
}


/**
 * connect to mongoDb
 * 
 * @returns {object} Mongoose connection
 * @public
 */
export const connect = ()=>{
    mongoose
        .connect(mongo.uri, {
            useNewUrlParser: true,
            useCreateIndex:true,
            useUnifiedTopology: true,
            useFindAndModify:false,
        })
        .then(()=>console.log('mongoDB connected ...'));

    return mongoose.connection;
}