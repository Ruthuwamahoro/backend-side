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
Object.defineProperty(exports, "__esModule", { value: true });
const request = require('supertest');
const app = require('../app.ts');
const Login = require('../model/login.ts');
const axios = require('axios');
test("test if the user register to an account", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userN = {
            "email": "testing92@gmail.com",
            "username": "testingR1",
            "password": "test1234",
            "ConfirmPassword": "test1234"
        };
        const response = yield axios.post('http://localhost:8080/logininfo/register', userN);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok', message: 'USER REGISTERED' });
    }
    catch (err) {
        console.log(err);
    }
}));
test("test if the email exists in our database", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userN = {
            "email": "testing1R0@gmail.com",
            "username": "testingR1",
            "password": "test1234",
            "ConfirmPassword": "test1234"
        };
        const userEx = "testingR0@gmail.com";
        const user = yield Login.findOne({ email: userEx });
        if (user) {
            const response = yield axios.post('http://localhost:8080/logininfo/register', userN);
            console.log(response);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ status: 400, error: 'USER WITH THIS EMAIL ALREADY EXISTS' });
        }
    }
    catch (err) {
        console.log(err);
    }
}));
test("login to the account", () => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = {
        "username": "testingR1",
        "password": "test1234",
    };
    const response = yield axios.post('http://localhost:8080/logininfo/login', userInfo);
    console.log(response);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ status: 'ok', message: "User logged in! Congrats", token: expect.any(String) });
    if (!response) {
        expect(response).toEqual({ status: 400, error: 'invalid username or password' });
    }
}));
test("login with wrong account", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = {
            "username": "testingR123",
            "password": "test1234",
        };
        const response = yield axios.post('http://localhost:8080/logininfo/login', userInfo);
        console.log(response);
        //expect(response).toBeFalsy()
        expect(response.status).toBe(400);
        expect(response.data).toEqual({ status: 400, error: 'invalid username or password' });
    }
    catch (err) {
        console.error(err);
    }
}));
// describe('Login Routes', () => {
//   // Test for successful user registration
//   test('POST /register - Successful user registration', async () => {
//     const newUser = {
//       email: 'test@example.com',
//       username: 'testuser',
//       password: 'password123'
//     };
//     const response = await request(app)
//       .post('/logininfo/register')
//       .send(newUser);
//     expect(response.status).toBe(200);
//     expect(response.body).toEqual({ status: 'ok', message: 'USER REGISTERED' });
//     // Clean up: Delete the newly registered user from the database
//     await Login.deleteOne({ email: newUser.email });
//   });
//   // Test for registration with existing email
//   test('POST /register - Registration with existing email', async () => {
//     // Assuming there is already a user with this email in the database
//     const existingUser = await Login.findOne();
//     const newUser = {
//       email: existingUser.email,
//       username: 'testuser',
//       password: 'password123'
//     };
//     const response = await request(app)
//       .post('/logininfo/register')
//       .send(newUser);
//     expect(response.status).toBe(400);
//     expect(response.body).toEqual({ status: 400, error: 'USER WITH THIS EMAIL ALREADY EXISTS' });
//   });
//   // Test for successful user login
//   test('POST /login - Successful user login', async () => {
//     const userCredentials = {
//       username: 'testuser',
//       password: 'password123'
//     };
//     const response = await request(app)
//       .post('/logininfo/login')
//       .send(userCredentials);
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('status', 'ok');
//     expect(response.body).toHaveProperty('message', 'User logged in! Congrats');
//     expect(response.body).toHaveProperty('token');
//     // Clean up: Delete the token from the response or handle token expiration in the application
//     // If you're not storing tokens in the database, no cleanup may be needed
//   });
//   // Test for unsuccessful user login
//   test('POST /login - Unsuccessful user login', async () => {
//     const invalidCredentials = {
//       username: 'invaliduser',
//       password: 'invalidpassword'
//     };
//     const response = await request(app)
//       .post('/logininfo/login')
//       .send(invalidCredentials);
//     expect(response.status).toBe(400);
//     expect(response.body).toEqual({ status: 400, error: 'invalid username or password' });
//   });
// });
//testing for the existing email
// test("test if the email exists in our database", async() => {
//     try{
//         const userN = {
//             "email": "testingR0@gmail.com",
//             "username": "testingR1",
//             "password": "test1234",
//             "ConfirmPassword": "test1234"
//         }
//         const response = await axios.post('http://localhost:8080/logininfo/register', userN); 
//         console.log(response)
//         // console.log(response);
//         expect(response.status).toBe(400);
//         expect(response.data).toHaveProperty("message", "USER WITH THIS EMAIL ALREADY EXISTS");
//     } catch (err) {
//         throw err
//     }
// });
// afterAll(() => {
//     app.close()
// })
