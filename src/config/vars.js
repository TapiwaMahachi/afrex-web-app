import dotenv from 'dotenv';
import url from 'url';



/**
 * configuring the environment viraibles 
 * pointing to the file were they are stored
 */
dotenv.config({
    path: new URL('../../.env', import.meta.url),
});

export const env = process.env.NODE_ENV;
export const port = process.env.PORT;
export const mongo ={ uri: process.env.MONGO_URI,}
export const secretKey = process.env.SECRET_KEY;
export const jwtSecret= process.env.JWT_SECRET;
export const jwtExpirationInterval= process.env.JWT_EXPIRATION_MINUTES;