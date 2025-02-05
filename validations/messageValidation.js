const Joi = require('joi');

const createMessageSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    'string.empty': 'Name is required.',
    'any.required': 'Name is required.',
  }),
  email: Joi.string().email().required().trim().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),
  message: Joi.string().required().trim().messages({
    'string.empty': 'Message is required.',
    'any.required': 'Message is required.',
  })
});

module.exports = {
  createMessageSchema,
};