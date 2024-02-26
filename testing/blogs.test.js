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
const axios_1 = __importDefault(require("axios"));
test('get all blogs', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        };
        const response = yield axios_1.default.post('http://localhost:8080/logininfo/login', userInfo);
        const token = response.data.token;
        const blo = yield axios_1.default.get('http://localhost:8080/post/retrieveallpost', { headers: { Authorization: `Bearer ${token}` } });
        expect(blo.status).toBe(200);
        expect(Array.isArray(blo.data)).toBe(true);
        console.log(blo.data);
    }
    catch (err) {
        console.log(err);
    }
}));
test('get all blogs with invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blo = yield axios_1.default.get('http://localhost:8080/post/retrieveallpost');
        expect(blo.status).toBe(400);
        expect(blo.data).toEqual({ status: 400, error: 'invalid token' });
    }
    catch (err) {
        console.log(err);
    }
}));
test('post blogs', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        };
        const newBlogs = {
            "title": "testing",
            "content": "testing",
            "description": "testing",
            "image": "testing",
        };
        const response = yield axios_1.default.post('http://localhost:8080/logininfo/login', userInfo);
        const token = response.data.token;
        const blo = yield axios_1.default.post('http://localhost:8080/post/postblog', newBlogs, { headers: { Authorization: `Bearer ${token}` } });
        expect(blo.status).toBe(200);
        expect(blo.data).toEqual({ status: 'ok', data: "Successfully posted blog" });
    }
    catch (err) {
        console.log(err);
    }
}));
test('unauthorized access of post blogs', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBlogs = {
            "title": "testing",
            "content": "testing",
            "description": "testing",
            "image": "testing",
        };
        const blo = yield axios_1.default.post('http://localhost:8080/post/postblog', newBlogs);
        expect(blo.status).toBe(400);
        expect(blo.data).toEqual({ status: 400, error: 'invalid token' });
    }
    catch (err) {
        console.log(err);
    }
}));
test('get single blogs', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        };
        const id = "63d6e0e0b4b5b5b5b5b5b5b5";
        const response = yield axios_1.default.post('http://localhost:8080/logininfo/login', userInfo);
        const token = response.data.token;
        const blo = yield axios_1.default.post(`http://localhost:8080/post/getsinglepost/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        expect(blo.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
    }
    catch (err) {
        console.log(err);
    }
}));
test("unauthorized access of get single blog", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = "63d6e0e0b4b5b5b5b5b5b5b5";
        const blo = yield axios_1.default.post(`http://localhost:8080/post/getsinglepost/${id}`);
        expect(blo.status).toBe(400);
        expect(blo.data).toEqual({ status: 400, error: 'invalid token' });
    }
    catch (err) {
        console.log(err);
    }
}));
test('update single blogs', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        };
        const id = "63d6e0e0b4b5b5b5b5b5b5b5";
        const response = yield axios_1.default.post('http://localhost:8080/logininfo/login', userInfo);
        const token = response.data.token;
        const blo = yield axios_1.default.post(`http://localhost:8080/post/updatepost/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        expect(blo.status).toBe(200);
        expect(Array.isArray(blo.data.data)).toBe(true);
        console.log(blo.data);
    }
    catch (err) {
        console.log(err);
    }
}));
test('unauthorized access of update single blog', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = "63d6e0e0b4b5b5b5b5b5b5b5";
        const res = yield axios_1.default.post(`http://localhost:8080/post/updatepost/${id}`);
        expect(res.status).toBe(400);
        expect(res.data).toEqual({ status: 400, error: 'invalid token' });
    }
    catch (error) {
        console.log(error);
    }
}));
test('delete single blog', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        };
        const id = "63d6e0e0b4b5b5b5b5b5b5b5";
        const response = yield axios_1.default.post('http://localhost:8080/logininfo/login', userInfo);
        const token = response.data.token;
        const blo = yield axios_1.default.post(`http://localhost:8080/project/deleteproject/${id}`);
        expect(blo.status).toBe(200);
        expect(blo.data).toBe("blog Deleted Successfully");
        console.log(blo.data);
    }
    catch (err) {
        console.log(err);
    }
}));
test('unauthorized access of delete single blog', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = "63d6e0e0b4b5b5b5b5b5b5b5";
        const response = yield axios_1.default.post(`http://localhost:8080/project/deleteproject/${id}`);
        expect(response.status).toBe(400);
        expect(response.data).toEqual({ status: 400, error: 'invalid token' });
        console.log(response.data);
    }
    catch (err) {
        console.log(err);
    }
}));
//test for projects
test('get all projects', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        };
        const response = yield axios_1.default.post('http://localhost:8080/logininfo/login', userInfo);
        const token = response.data.token;
        const blo = yield axios_1.default.get('http://localhost:8080/project/getallprojects', { headers: { Authorization: `Bearer ${token}` } });
        expect(blo.status).toBe(200);
        expect(Array.isArray(blo.data.data)).toBe(true);
        console.log(blo.data);
    }
    catch (err) {
        console.log(err);
    }
}));
test('unAuthorized access to all projects', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blo = yield axios_1.default.get('http://localhost:8080/project/getallprojects');
        expect(blo.status).toBe(400);
        expect(blo.data).toEqual({ status: 400, error: 'invalid token' });
    }
    catch (err) {
        console.log(err);
    }
}));
//test if the user does not logged in 
test('post project', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        };
        const newProjects = {
            "title": "testing",
            "description": "testing",
            "demo": "testing",
        };
        const response = yield axios_1.default.post('http://localhost:8080/logininfo/login', userInfo);
        const token = response.data.token;
        const blo = yield axios_1.default.post('http://localhost:8080/project/postproject', newProjects, { headers: { Authorization: `Bearer ${token}` } });
        expect(blo.status).toBe(200);
        expect(blo.data).toEqual({ status: 'ok', data: "project posted" });
    }
    catch (err) {
        console.log(err);
    }
}));
test('unauthorized access of post projects', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newBlogs = {
            "title": "testing",
            "description": "testing",
            "demo": "testing",
        };
        const blo = yield axios_1.default.post('http://localhost:8080/project/postproject', newBlogs);
        expect(blo.status).toBe(400);
        expect(blo.data).toEqual({ status: 400, error: 'invalid token' });
    }
    catch (err) {
        console.log(err);
    }
}));
test('update single projects', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = "63d6e0e0b4b5b5b5b5b5b5b5";
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        };
        const response = yield axios_1.default.post('http://localhost:8080/logininfo/login', userInfo);
        const token = response.data.token;
        const blog = yield axios_1.default.post(`http://localhost:8080/project/updateproject/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        expect(blog.status).toBe(200);
        expect(blog.data).toBe("Project Updated Successfully");
        console.log(blog.data);
    }
    catch (err) {
        console.log(err);
    }
}));
test("unauthorized access of update single project", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = "63d6e0e0b4b5b5b5b5b5b5b5";
        const blo = yield axios_1.default.post(`http://localhost:8080/project/updateproject/${id}`);
        expect(blo.status).toBe(400);
        expect(blo.data).toEqual({ status: 400, error: 'invalid token' });
    }
    catch (err) {
        console.log(err);
    }
}));
test('unauthorized access of delete single project', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = "63d6e0e0b4b5b5b5b5b5b5b5";
        const blo = yield axios_1.default.post(`http://localhost:8080/project/deleteproject/${id}`);
        expect(blo.status).toBe(400);
        expect(blo.data).toEqual({ status: 400, error: 'invalid token' });
    }
    catch (err) {
        console.log(err);
    }
}));
test('delete single projects', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = "63d6e0e0b4b5b5b5b5b5b5b5";
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        };
        const response = yield axios_1.default.post('http://localhost:8080/logininfo/login', userInfo);
        const token = response.data.token;
        const blog = yield axios_1.default.post(`http://localhost:8080/project/deleteproject/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        expect(blog.status).toBe(200);
        expect(blog.data).toBe("Project Deleted Successfully");
        console.log(blog.data);
    }
    catch (err) {
        console.log(err);
    }
}));
