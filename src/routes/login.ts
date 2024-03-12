import express, { Request, Response, NextFunction, Router } from 'express';
import { registerSchema, options } from '../validator/validateuser';
import Login from '../model/login';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import cookieParser from 'cookie-parser';

interface customD extends Request {
    accessUser?: any;
}

require('dotenv').config();

const router: Router = express.Router();

router.use(cookieParser());
router.use(express.json());
router.use(passport.initialize());

router.post('/register', async (req: customD, res: Response) => {
    const result = registerSchema.validate(req.body, options);
    if (result.error) {
        const messageError = result.error.details.map((error: any) => error.message).join(', ');
        return res.status(400).json({ status: 400, error: messageError });
    }

    const { email, username, password } = result.value;
    try {
        const checkExistingUser = await Login.findOne({ email });
        if (checkExistingUser) {
            return res.status(400).json({ status: 400, error: "User with this email already exists" });
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);
        const newUser = new Login({ email, username, password: hash });
        await newUser.save();
        
        res.json({ status: "ok", message: "User registered", redirectTo: "../login-page/login.html" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: "Something went wrong" });
    }
});

async function validateUser(username: string, password: string, done: Function) {
    try {
        const user = await Login.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}

passport.use(new LocalStrategy(validateUser));

router.post('/login', async (req: customD, res: Response, next: Function) => {
    passport.authenticate('local', { session: false }, async (err: Error, user: any) => {
        try {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(400).json({ status: 400, error: "Invalid username or password" });
            }
            const adminUsername = process.env.ADMIN_USERNAME || "Admin";
            const adminPassword = process.env.ADMIN_PASSWORD || "12345678";

            if (user.username === adminUsername && req.body.password === adminPassword) {
                user.role = 'admin';
            } else {
                user.role = 'user';
            }

            const tokenPayload = { username: user.username, role: user.role };
            const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET!);

            res.cookie("token", token);
            res.header('Authorization', `Bearer ${token}`);
            res.json({ status: "ok", message: user.role === 'admin' ? "Admin" : "User", token });
        } catch (err) {
            next(err);
        }
    })(req, res, next);
});

export default router;
