import httpStatus from 'http-status';
import pkg from 'lodash';
import moment from 'moment';
import User from '../models/user.model.js';
import {jwtExpirationInterval} from '../../config/vars.js';
import RefreshToken from '../models/refreshToken.model.js';

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const refreshToken = RefreshToken.generate(user).token;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType,
    accessToken,
    refreshToken,
    expiresIn,
  };
}

/**
 * Returns a  JWt token if registration is successfull
 * @public
 */

export const register = async (req, res, next) =>{
    try{
        const {omit} = pkg;
        const userData = omit(req.body, 'role');
        const user = await new User(userData).save();
        const token = generateTokenResponse(user, user.token());
        res.status(httpStatus.CREATED);
        return res.json({token, user: user.transformed()})
    }
    catch(error) {
       return  next(User.checkDuplicateEmail(error));
    }
};

/**
 * login with an existing user or creates a new one if valid accesstoken token
 * Returns a jwt
 * @public 
 */
export const login = async(req, res, next)=>{
    try{
        const {user, accessToken} = await User.findAndGenerateToken(req.body);
        const token = generateTokenResponse(user, accessToken);
        return res.json({token, user: user.transform()});
    } catch(error) {
        return next(error);
    }
};