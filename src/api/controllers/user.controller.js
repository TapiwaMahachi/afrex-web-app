import httpStatus from 'http-status';
import pkg from 'lodash';
import User from '../models/user.model.js';

/**
 * load user and append to req
 * @public
 */
export const load = async(req, res, next ,id)=>{
    try{
        const user = await User.get(id);
        req.locals = {user};
        return next();
    } catch(error) {
        return next(error)
    }
};
/**
 * 
 * Get user
 * @public 
 */

export const get = (req, res) => res.json(req.locals.user.transform());


/**
 * @public Create User
 */
export const  create = async (req, res, next)=>{

    const user = new User(req.body);
    user.save()
        .then(user =>  res.status(httpStatus.CREATED).json(user.transform()))
        .catch(error => next(User.checkDuplicateEmail(error)))
};

/**
 *  Update user
 * @public 
 */
export const update =(req, res, next)=>{

    const {omit} = pkg; //lodash
    const ommitRole = req.locals.user.role !== 'admin' ? 'role' : '';
    const updatedUser = omit(req.body, ommitRole);
    const user = Object.assign(req.locals.user, updatedUser);

    user.save()
        .then(savedUser => res.json(savedUser.transform()))
        .catch(e => next(User.checkDuplicateEmail(e)));
}
/**
 * Get user list
 * @public
 */
export const list = async (req, res, next) =>{
    try{
        const users = await User.list(req.query);
        const transformedUsers = users.map(user=> user.transform());
        res.json(transformedUsers);

    } catch(error) {
        next(error);
    };
};
/**
 *  Delete User
 * @public
 */
export const remove = (req, res, next)=>{
    const {user} = req.locals;

    user.remove()
        .then(()=> res.status(httpStatus.NO_CONTENT).end())
        .catch(e=>next(e));
}