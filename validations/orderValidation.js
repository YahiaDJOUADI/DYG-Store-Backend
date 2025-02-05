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
      price: Joi.number().min(0).required().messages({
        'number.base': 'Price must be a number.',
        'number.min': 'Price must be at least 0.',
        'any.required': 'Price is required.',
      }),
    })
  ).required().messages({
    'array.base': 'Products must be an array.',
    'array.includesRequiredUnknowns': 'Each product must have a productId, quantity, and price.',
    'any.required': 'Products are required.',
  }),
  totalPrice: Joi.number().min(0).required().messages({
    'number.base': 'Total price must be a number.',
    'number.min': 'Total price must be at least 0.',
    'any.required': 'Total price is required.',
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
});

module.exports = {
  createOrderSchema,
};