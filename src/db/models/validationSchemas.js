import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Поле phoneNumber повинно містити 10 цифр',
  }),
  isFavourite: Joi.boolean(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).messages({
    'string.pattern.base': 'Поле phoneNumber повинно містити 10 цифр',
  }),
  isFavourite: Joi.boolean(),
}).or('name', 'email', 'phoneNumber', 'isFavourite');