import Login from "../model/login";
import app from "../app";
import supertest from "supertest";
const axios = require('axios');


test("test if the user register to an account", async() => {
    try{
        const userN = {
            "email": "testing75u4@gmail.com",
            "username": "testingR1",
            "password": "test1234",
            "ConfirmPassword": "test1234"
        }
        
        const response = await axios.post('http://localhost:8080/logininfo/register', userN); 
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok', message: 'USER REGISTERED' });
    } catch(err){
        return err
    }
});


test("test if the email exists in our database", async() => {
  try{
      const userN = {
          "email": "testeng15680@gmail.com",
          "username": "testingR1",
          "password": "test1234",
          "ConfirmPassword": "test1234"
      }
      const userEx = "testingR0@gmail.com"
      const user = await Login.findOne({email: userEx})
      if(user){
        const response = await axios.post('http://localhost:8080/logininfo/register', userN); 

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ status: 400, error: 'USER WITH THIS EMAIL ALREADY EXISTS' });
      }
  } catch(err){
      return err
  }
});


test("login to the account", async() => {

      const userInfo = {
          "username": "testingR1",
          "password": "test1234",
      }
        const response = await axios.post('http://localhost:8080/logininfo/login', userInfo); 
        expect(response.status).toBe(200);
        expect(response.data).toEqual({ status: 'ok', message:"User logged in! Congrats", token: expect.any(String)});
        if(!response){
            expect(response).toEqual({ status: 400, error: 'invalid username or password' });

        } 
});


test("login with wrong account", async() => {
  try{
    const userInfo = {
      "username": "testingR123",
      "password": "test1234",
  }
    const response = await axios.post('http://localhost:8080/logininfo/login', userInfo); 
    console.log(response)
    expect(response.status).not.toBe(200);
    expect(response.data).toEqual({ status: 400, error: 'invalid username or password' });
  } catch(err){
    return err
  }
});






