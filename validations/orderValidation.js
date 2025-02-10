const Joi = require('joi');

const createOrderSchema = Joi.object({
  wilaya: Joi.string().required().messages({
    'string.empty': 'Wilaya is required.',
    'any.required': 'Wilaya is required.',
  }),
  products: Joi.array().items(
    Joi.object({
      productId: Joi.string().required().messages({
        'string.empty': 'Product ID is required.',
        'any.required': 'Product ID is required.',
      }),
      quantity: Joi.number().integer().min(1).required().messages({
        'number.base': 'Quantity must be a number.',
        'number.integer': 'Quantity must be an integer.',
        'number.min': 'Quantity must be at least 1.',
        'any.required': 'Quantity is required.',
      }),
      platform: Joi.string().valid('PS5', 'PS4', 'Xbox Series X/S', 'PC').optional().messages({
        'any.only': 'Platform must be one of PS5, PS4, Xbox Series X/S, or PC.',
      }),
    })
  ).required().messages({
    'array.base': 'Products must be an array.',
    'array.includesRequiredUnknowns': 'Each product must have a productId and quantity.',
    'any.required': 'Products are required.',
  }),
  name: Joi.string().required().trim().messages({
    'string.empty': 'Name is required.',
    'any.required': 'Name is required.',
  }),
  phone: Joi.string().required().trim().messages({
    'string.empty': 'Phone is required.',
    'any.required': 'Phone is required.',
  }),
  address: Joi.string().required().trim().messages({
    'string.empty': 'Address is required.',
    'any.required': 'Address is required.',
  }),
  userId: Joi.string().optional().allow(null).messages({
    'string.empty': 'User ID is not allowed to be empty.',
  }),
});

module.exports = {
  createOrderSchema,
};