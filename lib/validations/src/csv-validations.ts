import * as Joi from 'joi';

export const CreateStatisticValidation = Joi.object({
  tableName: Joi.string().min(5).max(250).required(),
}).required();
