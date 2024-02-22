"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_1 = __importDefault(require("../model/login"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_jwt_1 = require("passport-jwt");
const profile_1 = __importDefault(require("../model/profile"));
const passport_1 = __importDefault(require("passport"));
const userRouter = express_1.default.Router();
require('dotenv').config();
userRouter.use(passport_1.default.initialize());
userRouter.post('/profile', userInfoProfile);
const token = passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken();
const secKey = process.env.ACCESS_TOKEN_SECRET;
function userInfoProfile(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err) {
                    return next(err);
                }
                const decodingFromToken = jsonwebtoken_1.default.verify(token, secKey);
                const usernameIn = decodingFromToken.username;
                const userPro = new profile_1.default({
                    username: usernameIn,
                    status: "active"
                });
                yield userPro.save();
            }
            catch (err) {
                next(err);
            }
        }))(req, res, next);
    });
}
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET || 'heyyou'
};
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, (jwtPayloads, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield login_1.default.findOne({ username: jwtPayloads.username });
        console.log(user);
        if (user) {
            return done(null, user);
        }
        else
            return done(null, false);
    }
    catch (err) {
        done(err);
    }
})));
exports.default = userRouter;
