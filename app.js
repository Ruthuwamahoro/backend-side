"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const blogs_1 = __importDefault(require("./routes/blogs"));
const contactMessage_1 = __importDefault(require("./routes/contactMessage"));
const login_1 = __importDefault(require("./routes/login"));
const projects_1 = __importDefault(require("./routes/projects"));
const userprofile_1 = __importDefault(require("./routes/userprofile"));
const dotenv = __importStar(require("dotenv"));
//import swaggerDocs from './validator/swagger';
dotenv.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/post', blogs_1.default);
app.use('/contact', contactMessage_1.default);
app.use('/logininfo', login_1.default);
app.use('/project', projects_1.default);
app.use('/adminprofile', userprofile_1.default);
app.use(express_1.default.json());
const port = 8080;
mongoose_1.default.connect(process.env.DATABASE_URL)
    .then(() => {
    console.log("connected to database");
}).catch((error) => {
    console.log(error);
});
app.listen((port), () => {
    console.log(`Server is running on port ${port}`);
    //swaggerDocs(app, port);
});
exports.default = app;
