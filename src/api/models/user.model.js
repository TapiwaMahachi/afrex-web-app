import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import pkg from 'lodash';
import jwt from 'jsonwebtoken';
import {secretKey} from '../../config/vars.js';
import moment from 'moment';


const {omitBy, isNil} = pkg;

/**
 * User Roles
 */
const roles = ['user', 'admin'];

/**
 * User Schema
 * @private
 */
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 128,
  },
  name: {
    type: String,
    maxlength: 128,
    trim: true,
  },
  services: {
    facebook: String,
    google: String,
  },
  role: {
    type: String,
    enum: roles,
    default: 'user',
  },
  picture: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

/**
 * Remove the password when serializing data as json
 */
userSchema.set('toJSON', {
  transform: (doc, ret)=>{
    delete ret.password;
    return ret;
  }
});
/**
 * pre save hook
 * validation and hashing password
 * 
 */
userSchema.pre('save', function(next){

    
        if(!this.isModified('password')) return next();

        const rounds = 10;
        bcrypt.hash(this.password, rounds,(err, hash)=>{
          if(err) return next(err);

          this.password = hash;
          next();
        });      
});
/**
 * Methods
 */
userSchema.method({

  transform(){

    const transformed = {};
    const fields = ['id','name', 'email', 'picture', 'role', 'createdAt'];

     fields.forEach(field =>{
       transformed[field] = this[field];
     })

     return transformed;
  },
  token(){

    return jwt.sign(
      this.transform(), 
      secretKey,
      {expiresIn: '15m',}
    ); 
  },
  async passwordMatches(password){
    return bcrypt.compare(password, this.password)
  }
});

/**
 * Statics
 */
userSchema.statics ={

    roles,
   
    /**
     *  Get User
     * @param {ObjectId} id - the objectId of user
     * @returns {Promise<User, Error>}
     */
   async get(id){
      try{
        let user;
        
        if(mongoose.Types.ObjectId.isValid(id)){
          user = await this.findById(id).exec();
        }
        if(user) return user;
        throw new Error( 'User does not exists')
      } catch(error) {
        throw error;
      }
    },

    /**
     * Find user by email and try to generate JWT
     * @param {User} options user in the db
     * @returns {Promise<User, Error>}
     */
    async findAndGenerateToken(options) {
      const {email, password, refreshObject} = options;

      if(!email) throw new Error('Email is required to genrate token');
       
      const user = await this.findOne({email}).exec();
      let error;
      if(password){
        if(user && await user.passwordMatches(password)){
          return {user, accessToken: user.token()};
        }
      }else if(refreshObject && refreshObject.userEmail === email){
        if(moment(refreshObject.expires).isBefore()){
          error = 'Invalid refresh token.';
        }else{
          return {user, accesstoken: user.token()};
        }
      }else{
        error = 'Incorrect email and refresh token'
      }
      throw new Error(error)
    },

    /**
     * List users in descending order of createdAt timestamp
     * @param {number} skip - Number of users to be skipped.
     * @param {number} limit - limit number of user to be returned 
     * @returns {Promise<User[]>}
     */
    list({
      page = 1, perPage = 30, name, email, role,
    }) {
      const options = omitBy({name, email, role}, isNil);

      return this.find(options)
          .sort({createdAt: -1})
          .skip(perPage * (page -1))
          .limit(perPage)
          .exec();
    },

    /**
     *  return new validation error
     * if error is a mongoose dublicate keyerror
     * @param {Error} error 
     * @returns {Error}
     */
    checkDuplicateEmail(error) {
        if(error.name === 'MongoError' && error.code === 11000){
            return new Error('Email already exists');
            }
        },
}

/**
 * @typedef User
 */
export default mongoose.model('User', userSchema);