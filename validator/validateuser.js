"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const registerSchema = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    username: joi_1.default.string().min(5).max(15).required(),
    password: joi_1.default.string().pattern(new RegExp('^[a-zA-Z0-9]{8,30}$')).required().messages({
        'string.pattern.base': 'Password must contain 8-30 characters'
    }),
    ConfirmPassword: joi_1.default.string().valid(joi_1.default.ref("password")).required().messages({
        'any.only': 'Confirm password must be same as password'
    })
});
exports.registerSchema = registerSchema;
const options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
};
exports.options = options;
