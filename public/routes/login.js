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
//login routes
const express_1 = __importDefault(require("express"));
const validateuser_1 = require("../validator/validateuser");
const router = express_1.default.Router();
const login_1 = __importDefault(require("../model/login"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
require("cookie-parser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require('dotenv').config();
//after dealing with function,next is to configure passport by calling initialize and session from express-session()
router.use((0, cookie_parser_1.default)());
router.use(express_1.default.json());
router.use(passport_1.default.initialize());
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = validateuser_1.registerSchema.validate(req.body, validateuser_1.options);
    if (result.error) {
        const messageError = result.error.details.map((error) => error.message).join(', ');
        res.status(400).json({ status: 400, error: messageError });
    }
    else {
        const { email, username, password } = result.value;
        const checkexistingUser = yield login_1.default.findOne({ email });
        if (checkexistingUser) {
            return res.status(400).json({ status: 400, error: "USER WITH THIS EMAIL ALREADY EXISTS" });
        }
        else {
            bcrypt_1.default.hash(password, 10)
                .then((hash) => __awaiter(void 0, void 0, void 0, function* () {
                const store = new login_1.default({
                    email: email,
                    username: username,
                    password: hash,
                    //confirm password is not stored in database because it is unneccessary data it is only used to verify whether user entered correct data
                });
                yield store.save();
                res.json({ message: "USER REGISTERED" });
            }))
                .catch(() => {
                res.status(401).json({ error: "SOMETHING WENT WRONG" });
            });
        }
    }
}));
function validateUser(username, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield login_1.default.findOne({ username });
            if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
                return done(null, false, { message: "User not found" });
            }
            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
    });
}
//define strategy
passport_1.default.use(new passport_local_1.Strategy(validateUser));
router.post('/login', (req, res, next) => {
    passport_1.default.authenticate('local', { session: false }, (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json({ status: 400, error: "invalid username or password" });
        }
        const accessUser = { username: req.body.username, password: req.body.password };
        const token = jsonwebtoken_1.default.sign(accessUser, process.env.ACCESS_TOKEN_SECRET);
        res.json({ message: "User logged in! Congrats", token: token });
    })(req, res, next);
});
// router.post('/login', async(req:customD,res:Response) => {
//     const username = req.body.username;
//     const password = req.body.password
//     if(!username){
//         return res.status(400).json({error: "No provided Username"})
//     } else if(!password){
//         return res.status(400).json({error: "No provided Password"})
//     }
//     const usernameVerify = await Login.findOne({username})
//     const passwordVerify = await Login.findOne({password})
//     if(!usernameVerify && !passwordVerify){
//         return res.status(400).json({status: 400,error: "Username and/ or password does not match"})
//     }else {
//         if(usernameVerify !== null){
//             const verification = usernameVerify.password;
//             bcrypt.compare(password, verification)
//                 .then((match) => {
//                 if (!match) {
//                     return res.status(400).json({status: 400, error: "Password is incorrect" });
//                 }
//                 // Password matches, user is authenticated
//                 //accessing username
//                 const accessUser = {name: username, password: password}
//                 //create jwt by using secret key and sign method
//                 //whenever user pass username ,it is going to create token for that contains relevant information to the user
//                 const token = jwt.sign(accessUser, process.env.ACCESS_TOKEN_SECRET!)
//                 res.cookie("token", token);
//                 res.json({ message: "User logged in! Congrats"});
//             })
//         }
//     } 
// })
//create middleware for authentication
// function authentication (req:customD,res:Response,next:NextFunction){
//     const getAuthorizationHeader = req.headers['authorization'];
//     const token = getAuthorizationHeader && getAuthorizationHeader.split(' ')[1]
//     if(!token){
//         return res.sendStatus(403)
//     }
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err: Error | null, accessUser) => {
//         if(err){
//             console.error('JWT verification error:', err);
//             return res.sendStatus(403)
//         }else{
//             req.accessUser = accessUser
//             next()
//         }
//     })
// }
exports.default = router;
