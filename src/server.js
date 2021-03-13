import app from './config/express.js';
import {port,env} from './config/vars.js';
import logger from './config/logger.js';
import {connect} from './config/mongoose.js';

//open mogoose connection
connect();

//connection
app.listen(port, ()=> 
    logger.info(`Listening at ${port}  (${env})`));

/**
 * Exports express
 * @public
 */
export default app;