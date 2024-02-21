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
const projectsModel_1 = __importDefault(require("../model/projectsModel"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_jwt_1 = require("passport-jwt");
const passport_1 = __importDefault(require("passport"));
require('dotenv').config();
const login_1 = __importDefault(require("../model/login"));
//////////////////////////////////////////////////////////////////////////////////
//define middleware
router.use((0, cookie_parser_1.default)());
router.use(express_1.default.json());
router.use(passport_1.default.initialize());
/////////////////////////////////////////////////////////////////////////////////////
//define routes
router.get('/getallprojects', allowUserToSeePostedProject);
router.post('/postproject', allowPostProject);
router.patch('/updateproject/:id', allowUpdateProject);
router.delete('/deleteproject/:id', allowDeleteProject);
////////////////////////////////////////////////////////////////////////////////////////////////////
//jwt strategy
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET || 'heyyou'
};
function allowUserToSeePostedProject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err) {
                    return next();
                }
                if (!user) {
                    return res.status(400).json({ status: 400, error: "please login is required" });
                }
                const projects = yield projectsModel_1.default.find();
                res.json({ projects: projects });
            }
            catch (err) {
                return next(err);
            }
        }))(req, res, next);
    });
}
function allowPostProject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(400).json({ status: 400, error: "please login is required" });
                }
                const { title, description, demo } = req.body;
                const project = new projectsModel_1.default({
                    title,
                    description,
                    demo
                });
                yield project.save();
                res.json("project posted");
            }
            catch (err) {
                return next(err);
            }
        }))(req, res, next);
    });
}
function allowUpdateProject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(400).json({ status: 400, error: "please login is required" });
                }
                const updatePro = yield projectsModel_1.default.findByIdAndUpdate(req.params.id, {
                    $set: {
                        title: req.body.title,
                        content: req.body.content,
                        description: req.body.description
                    }
                }, { new: true });
                if (updatePro === null)
                    return res.json({ error: "id not found" });
                res.json("Project Updated Successfully");
            }
            catch (err) {
                return next(err);
            }
        }))(req, res, next);
    });
}
function allowDeleteProject(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(400).json({ status: 400, error: "please login is required" });
                }
                const deletePro = yield projectsModel_1.default.findByIdAndDelete(req.params.id);
                if (!deletePro)
                    return res.status(400).send({ msg: "id not found" });
                res.json("Project Deleted Successfully");
            }
            catch (err) {
                return next(err);
            }
        }))(req, res, next);
    });
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//define strategy
passport_1.default.use(new passport_jwt_1.Strategy(jwtOptions, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield login_1.default.findOne({ username: jwtPayload.username });
        if (!user) {
            done(null, false);
        }
        else {
            done(null, user);
        }
    }
    catch (err) {
        done(err);
    }
})));
//////////////////////////////////////////////////////////////////////////////////////////////////
exports.default = router;
