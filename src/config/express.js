import express from 'express';
import router from '../api/routes/index.js';

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
app.use('/api', router);

/**
 * Error handler Function
 */
app.use((err, req, res, next)=>{
    res.send(`error: ${err.message}`)
});

export default app;