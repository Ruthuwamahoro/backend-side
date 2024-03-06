import Joi from 'joi'
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(4).max(15).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required().messages({
        'string.pattern.base': 'Password must contain 8-30 characters'
    }),
    ConfirmPassword: Joi.string().valid(Joi.ref("password")).messages({
        'any.only': 'Confirm password must be same as password'
    })
})
const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
}

const contactMessageSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string().required()
})


export  {registerSchema, options, contactMessageSchema}

