const joi = require('joi')

exports.createProductSchema = joi.object({
    name: joi.string().required(),
    description: joi.string(),
    price: joi.number().required().positive(),
    stock: joi.number().positive().required(),
    category: joi.string().required(),
    
    
})


exports.updateProductSchema = joi.object({
    name: joi.string().required(),
    description: joi.string(),
    price: joi.number().required().positive(),
    stock: joi.number().positive().required(),
    category: joi.string().required(),
    
    
})