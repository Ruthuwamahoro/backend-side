import request from 'supertest';
import app from '../app';
import Contact from '../model/contactInq'
import { describe, jest, expect } from '@jest/globals';
import axios from 'axios'
import dotenv from 'dotenv'


dotenv.config()

let token: string | undefined = undefined;
const api = process.env.API_URL
beforeAll(async() => {
    const userInfo = { "username": "uwamahoro9", "password": "12345678" }
    const response = await axios.post('http://localhost:8080/logininfo/login', userInfo);
    token = response.data.token
})

describe("testing addition of blogs", () => {

  test("test contact messages", async() => {
      const resultContact =  await request(app).get('/contact/contactmessage').set({ "Authorization": `Bearer ${token}` })
      expect(resultContact.status).toBe(200);
  })
  
  test(" post contact Message", async() => {
      jest.spyOn(Contact.prototype, 'save').mockResolvedValueOnce("filename")
      const TestAddMessage = await request(app).post('/contact/contactmessage').send({
          fullName: "Ruth",
          email: "This is my first post.",
          message: "This is my first post.",
      }).set({ Authorization: `Bearer ${token}` })
      expect(TestAddMessage.status).toBe(200)

  })
  
})
