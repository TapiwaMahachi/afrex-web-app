import pkg from 'express-validation';
import User from '../models/user.model.js';

const {Joi} = pkg;


  // GET /users
export const  listUsers = {
    query: Joi.object({
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      name: Joi.string(),
      email: Joi.string(),
      role: Joi.string().valid(...User.roles),
    })
  };

  // POST /users
export const createUser = {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(128).required(),
      name: Joi.string().max(128),
      role: Joi.string().valid(...User.roles),
    })
  };

  // PATCH /users/:userId
export const updateUser = {
    body: Joi.object({
      email: Joi.string().email(),
      password: Joi.string().min(6).max(128),
      name: Joi.string().max(128),
      role: Joi.string().valid(...User.roles),
    }),
    params: Joi.object({
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    })
  };

