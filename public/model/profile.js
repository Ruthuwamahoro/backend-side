"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contactMes = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
});
const Contact = mongoose_1.default.model('contact', contactMes);
exports.default = Contact;
