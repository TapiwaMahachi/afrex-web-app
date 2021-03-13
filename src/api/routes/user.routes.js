import express from 'express';
import pkg from 'express-validation';
import {
    create,
    load,
    list,
    get,
    remove,
    update,
} from '../controllers/user.controller.js';
import { createUser, listUsers, updateUser } from '../validations/user.validation.js';

const {validate} = pkg; //express-validation
/**
 *  Router app
 */
const router = express.Router();

/**
 * load user when API with userId route parameter is hit
 */
router.param('userId', load)

router
    .route('/')
    /**
     * @api {get} api/users list Users
     * @apiDescription Get a list of users
     */
    .get(validate(listUsers), list)
    /**
     * @api {post} api/users Create user
     * @apiDescription Create a user
     */
    .post(validate(createUser), create);


router
    .route('/:userId')
    /**
     * @api {get} api/users/:id Get User
     * @description Get user information
     */
    .get(get)
    /**
     * @api {patch} api/users/:id Update user
     * @description Update some fields of a document
     */
    .patch(validate(updateUser), update)
    /**
     * @api {delete} api/users/:id Delete user
     * @description delete a User
     */
    .delete(remove);

export  { router as userRoutes};