"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const profileInfo = new mongoose_1.default.Schema({
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
const Profile = mongoose_1.default.model('profile', profileInfo);
exports.default = Profile;
