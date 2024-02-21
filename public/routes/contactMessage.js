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
const router = express_1.default.Router();
const contactInq_1 = __importDefault(require("../model/contactInq"));
const login_1 = __importDefault(require("../model/login"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
dotenv_1.default.config();
/////////////////////////////////////////////////////////////////////////////////////////////////
//define middleware
router.use(express_1.default.json());
router.use(passport_1.default.initialize());
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/contactmessage', allowUserToSubmitMessage);
router.get('/contactmessage', retrieveAllMessage);
function allowUserToSubmitMessage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(400).json({ status: 400, error: "please login is required" });
                }
                const contact1 = new contactInq_1.default({
                    fullName: req.body.fullName,
                    email: req.body.email,
                    message: req.body.message
                });
                const postMessage = yield contact1.save();
                res.json("send successfully");
            }
            catch (err) {
                next(err);
            }
        }))(req, res, next);
    });
}
function retrieveAllMessage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err) {
                    return next(err);
                }
                if (!user)
                    return res.status(400).json({ status: 400, error: "please login is required" });
                const contacts = yield contactInq_1.default.find();
                res.json({ messages: contacts });
            }
            catch (err) {
                next(err);
            }
        }))(req, res, next);
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////
//defining startegy
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET || 'heyyou'
};
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield login_1.default.findOne({ username: jwtPayload.username });
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    }
    catch (err) {
        return done(err);
    }
})));
exports.default = router;
