"use strict";
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
require('dotenv/config');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/post', blogs_1.default);
app.use('/contact', contactMessage_1.default);
app.use('/logininfo', login_1.default);
app.use('/project', projects_1.default);
app.use('/adminprofile', userprofile_1.default);
app.use(express_1.default.json());
mongoose_1.default.connect(process.env.DATABASE_URL)
    .then(() => {
    console.log("connected to database");
}).catch((error) => {
    console.log(error);
});
mongoose_1.default.connect(process.env.CONTACTDB_URL)
    .then(() => {
    console.log("connected to contact message database");
})
    .catch((error) => {
    console.log(error);
});
mongoose_1.default.connect(process.env.LOGINDB_URL)
    .then(() => {
    console.log("connected to login Database");
})
    .catch((error) => {
    console.log(error);
});
mongoose_1.default.connect(process.env.USERPROFILE_URL)
    .then(() => {
    console.log("connected to project Database");
})
    .catch((error) => {
    console.log(error);
});
app.listen((8080), () => {
    console.log("Server is running on port 8080");
});
