import * as Joi from 'joi';

export const AuthLoginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  fcmToken: Joi.string().min(1).max(20).optional(),
}).required();

export const EmailValidation = Joi.object({
  email: Joi.string().email().required(),
}).required();

export const RegistrationValidation = Joi.object({
  username: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  code: Joi.number().integer().min(1).required(),
}).required();

export const FcmValidation = Joi.object({
  userId: Joi.number().integer().required(),
  fcmToken: Joi.string().min(1).max(255).required(),
}).required();
