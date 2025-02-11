const Joi = require("joi");

// Validation schema for adding a new user
const addUserSchema = Joi.object({
  userName: Joi.string().required().min(3).max(30).messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot exceed 30 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number is required",
    
  }),
  password: Joi.string().required().min(6).messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters long",
  }),
  type: Joi.string().valid("user", "admin").default("user").messages({
    "any.only": "User type must be either 'user' or 'admin'",
  }),
});

// Validation schema for updating a user
const updateUserSchema = Joi.object({
  userName: Joi.string().min(3).max(30).messages({
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot exceed 30 characters",
  }),
  email: Joi.string().email().messages({
    "string.email": "Email must be a valid email address",
  }),
  phone: Joi.string().pattern(/^\d{10}$/).messages({
    
  }),
  password: Joi.string().min(6).messages({
    "string.min": "Password must be at least 6 characters long",
  }),
  type: Joi.string().valid("user", "admin").messages({
    "any.only": "User type must be either 'user' or 'admin'",
  }),
});

// Validation schema for login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

module.exports = {
  addUserSchema,
  updateUserSchema,
  loginSchema,
};