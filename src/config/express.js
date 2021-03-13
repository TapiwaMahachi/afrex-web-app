import express from 'express';
import {userRouter} from '../api/routes/user.routes.js';

/**
 *  Express interface
 * @public
 */
const app = express();

/**
 * body parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({extended:true}))

/**
 *  Mount API routes
 */
app.use('/users', userRouter);

/**
 * Error handler Function
 */
app.use((err, req, res, next)=>{
    res.send(`error: ${err.message}`)
});

export default app;