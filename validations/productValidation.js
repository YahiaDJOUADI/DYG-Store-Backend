const Joi = require('joi');

exports.createProductSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Product name is required.',
    'any.required': 'Product name is required.',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'Description is required.',
    'any.required': 'Description is required.',
  }),
  price: Joi.number().positive().required().messages({
    'number.base': 'Price must be a valid number.',
    'number.positive': 'Price must be greater than zero.',
    'any.required': 'Price is required.',
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'Stock must be a number.',
    'number.min': 'Stock cannot be negative.',
    'any.required': 'Stock is required.',
  }),
  category: Joi.string().required().messages({
    'string.empty': 'Category is required.',
    'any.required': 'Category is required.',
  }),
  brand: Joi.string().required().messages({
    'string.empty': 'Brand is required.',
    'any.required': 'Brand is required.',
  }),
  platforms: Joi.array().items(
    Joi.string().valid('PC', 'PS5', 'PS4', 'Xbox Series X/S')
  ).optional().messages({
    'any.only': 'Platform must be one of PC, PlayStation, Xbox, PS5, PS4, or Xbox Series X/S.',
  }),
});

exports.updateProductSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.empty': 'Product name cannot be empty.',
  }),
  description: Joi.string().optional().messages({
    'string.empty': 'Description cannot be empty.',
  }),
  price: Joi.number().positive().optional().messages({
    'number.base': 'Price must be a valid number.',
    'number.positive': 'Price must be greater than zero.',
  }),
  stock: Joi.number().integer().min(0).optional().messages({
    'number.base': 'Stock must be a number.',
    'number.min': 'Stock cannot be negative.',
  }),
  category: Joi.string().optional().messages({
    'string.empty': 'Category cannot be empty.',
  }),
  brand: Joi.string().optional().messages({
    'string.empty': 'Brand cannot be empty.',
  }),
  platforms: Joi.array().items(
    Joi.string().valid('PC', 'PS5', 'PS4', 'Xbox Series X/S')
  ).optional().messages({
    'any.only': 'Platform must be one of PC, PlayStation, Xbox, PS5, PS4, or Xbox Series X/S.',
  }),
});