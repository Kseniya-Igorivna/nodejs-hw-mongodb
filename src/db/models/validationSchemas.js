import Joi from 'joi';

export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.pattern.base': 'Поле phoneNumber повинно містити 10 цифр',
  }),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .default('personal'),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  email: Joi.string().email(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).messages({
    'string.pattern.base': 'Поле phoneNumber повинно містити 10 цифр',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
}).or('name', 'email', 'phoneNumber', 'isFavourite', 'contactType');