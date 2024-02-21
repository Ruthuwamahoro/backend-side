"use strict";
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
//import necessary module
const express_1 = __importDefault(require("express"));
const postModel_1 = __importDefault(require("../model/postModel"));
const login_1 = __importDefault(require("../model/login"));
const multer_1 = __importDefault(require("multer"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
require('dotenv').config();
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const router = express_1.default.Router();
require('dotenv').config();
router.use((0, cookie_parser_1.default)());
router.use(passport_1.default.initialize());
router.use(express_1.default.json());
router.use('/uploads', express_1.default.static('/uploads'));
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//upload image to the blog by using multer
//filename must be unique to prevent overwriting of files
const storage = multer_1.default.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        return cb(null, `${file === null || file === void 0 ? void 0 : file.fieldname}_${Date.now()}${path_1.default.extname(file === null || file === void 0 ? void 0 : file.originalname)}`); //this takes two parameters error and return value.extname is extension name
    }
});
const upload = (0, multer_1.default)({
    storage: storage
});
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.get('/retrieveallpost', authenticateToSeeAllBlogIn);
router.post('/postblog', upload.single('image'), authenticateToPostBlog);
router.get('/getsinglepost/:id', accessSingleBlog);
router.delete('/deletepost/:id', deleteSingleBlog);
router.patch('/updatepost/:id', updateSingleBlog);
function authenticateToSeeAllBlogIn(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(400).json({ status: 400, error: "invalid token" });
                }
                const posts = yield postModel_1.default.find();
                res.json(posts);
            }
            catch (error) {
                next(error);
            }
        }))(req, res, next);
    });
}
function authenticateToPostBlog(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(400).json({ status: 400, error: "invalid token" });
                }
                const { title, content, description } = req.body;
                const imagePath = `http://localhost:8080/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}`;
                console.log(imagePath);
                const post = new postModel_1.default({
                    title,
                    content,
                    description,
                    image: imagePath || req.file || ''
                });
                yield post.save();
                res.json("Successful post blog");
            }
            catch (error) {
                next(error);
            }
        }))(req, res, next);
    });
}
function accessSingleBlog(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(400).json({ status: 400, error: "invalid token" });
                }
                const singlePost = yield postModel_1.default.findById(req.params.id);
                if (singlePost === null)
                    res.status(400).json({ status: 400, error: "id not found" });
                res.json(singlePost);
            }
            catch (error) {
                next(error);
            }
        }))(req, res, next);
    });
}
function deleteSingleBlog(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(400).json({ status: 400, error: "invalid token" });
                }
                const getId = req.params.id;
                // if(getId === undefined){
                //     return res.status(400).json({status: 400, error: "id not found"})
                // }
                const result = yield postModel_1.default.findByIdAndDelete(getId);
                if (result === null)
                    res.json({ message: "post already deleted" });
                res.json("successful deleted post");
            }
            catch (error) {
                next(error);
            }
        }))(req, res, next);
    });
}
function updateSingleBlog(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        passport_1.default.authenticate('jwt', { session: false }, (err, user, info) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    return res.status(400).json({ status: 400, error: "invalid token" });
                }
                const updatedPost = yield postModel_1.default.findByIdAndUpdate(req.params.id, {
                    $set: {
                        title: req.body.title,
                        content: req.body.content,
                        description: req.body.description
                    }
                }, { new: true });
                if (updatedPost === null)
                    res.status(400).json({ status: 400, error: "id not found" });
                console.log(updatedPost);
                res.json({ copyAndUpdate: updatedPost });
            }
            catch (error) {
                next(error);
            }
        }))(req, res, next);
    });
}
/////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////
exports.default = router;
