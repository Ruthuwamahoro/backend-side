import request from 'supertest';
import passport from 'passport';
import app from '../app';
import postModel from '../model/postModel'
//import { Response as SuperTest} from 'supertest';
import { describe, jest, expect } from '@jest/globals';
import axios from 'axios'
import Login from '../model/login';
import dotenv from 'dotenv'
import multer from 'multer';

dotenv.config()

let token: string | undefined = undefined;
const api = process.env.API_URL
beforeAll(async() => {
    const userInfo = { "username": "uwamahoro9", "password": "12345678" }
    const response = await axios.post('http://localhost:8080/logininfo/login', userInfo);
    token = response.data.token
})







// describe("testing addition of blogs", () => {
//     test("test get all blogs", async() => {
//         const userInfo = { "username": "uwamahoro9", "password": "12345678" }
        
//         const response = await axios.post('http://localhost:8080/logininfo/login', userInfo);
//         const token = response.data.token
//         //get all blogs

//         const resultBlogs =  await axios.get('http://localhost:8080/post/retrieveallpost', {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         })
//         console.log("----------------------------------------------", resultBlogs.data)
//         expect(resultBlogs.status).toBe(200);
//     })
// })

describe("testing addition of blogs", () => {

    test("test get all blogs", async() => {
        const accessWithInvalidToken = await request(app).get('/post/retrieveallpost').set({ Authorization: `Bearer yetfsgsfgsfstgsvxfsfsafgfxvdgvhjgb` })

        const resultBlogs =  await request(app).get('/post/retrieveallpost').set({ "Authorization": `Bearer ${token}` })
        expect(resultBlogs.status).toBe(200);
        expect(accessWithInvalidToken.status).toBe(500);
    })
    test("get one blog", async() => {
        const id = "65de3bffb596266937d5177f";
        const getSingleBlog = await request(app).get(`/post/getsinglepost/${id}`).set({ Authorization: `Bearer ${token}` } )
        const accessWithInvalidToken = await request(app).get(`/post/getsinglepost/${id}`).set({ Authorization: `Bearer yetfsgsfgsfstgsvxfsfsafgfxvdgvhjgb` })
        expect(getSingleBlog.status).toBe(200);
        expect(accessWithInvalidToken.status).toBe(400)
    })
    
    test("delete a blog", async() => {
        const id="65df2100b92ea63e9b3fcb78";
        const accessWithInvalidToken = await request(app).delete(`/post/deletepost/${id}`).set({ Authorization: `Bearer yetfsgsfgsfstgsvxfsfsafgfxvdgvhjgb` })
        jest.spyOn(postModel, 'findByIdAndDelete').mockResolvedValueOnce({data: " successfully deleted"});
        const deleteBlog = await request(app).delete(`/post/deletepost/${id}`).set({ Authorization: `Bearer ${token}` })
        expect(deleteBlog.status).toBe(200);
        expect(accessWithInvalidToken.status).toBe(400);
    })
    test("delete empty a blog", async() => {
        const id="65df2100b92ea63e9b3fcb78";
        const accessWithInvalidToken = await request(app).delete(`/post/deletepost/${id}`).set({ Authorization: `Bearer yetfsgsfgsfstgsvxfsfsafgfxvdgvhjgb` })
        jest.spyOn(postModel, 'findByIdAndDelete').mockResolvedValueOnce(null);
        const deleteBlog = await request(app).delete(`/post/deletepost/${id}`).set({ Authorization: `Bearer ${token}` })
        expect(deleteBlog.status).toBe(410);
        expect(accessWithInvalidToken.status).toBe(400);
    })
    test(" add blog", async() => {
        const accessWithInvalidToken = await request(app).post('/post/postblog').set({ Authorization: `Bearer yetfsgsfgsfstgsvxfsfsafgfxvdgvhjgb` })

        jest.spyOn(multer, 'diskStorage').mockResolvedValueOnce("filename" as never )
        jest.spyOn(postModel.prototype, 'save').mockResolvedValueOnce("filename")
        const addBlogPost = await request(app).post('/post/postblog').send({
            title: "Ruth",
            description: "This is my first post.",
            content: "This is my first post.",
        }).set({ Authorization: `Bearer ${token}` })
        expect(addBlogPost.status).toBe(200);
        expect(accessWithInvalidToken.status).toBe(400);

    })


    test(" update blog", async() => {
        const accessWithInvalidToken = await request(app).patch('/post/updatepost/65df2100b92ea63e9b3fcb78').set({ Authorization: `Bearer yetfsgsfgsfstgsvxfsfsafgfxvdgvhjgb` })

        jest.spyOn(multer, 'diskStorage').mockResolvedValueOnce("filename" as never )
        jest.spyOn(postModel, 'findByIdAndUpdate').mockResolvedValueOnce("filename")
        const addBlogPost = await request(app).patch('/post/updatepost/65df2100b92ea63e9b3fcb78').send({
            title: "Ruth",
            description: "This is my first poste.",
            content: "This is my first post.",
        }).set({ Authorization: `Bearer ${token}` })
        expect(addBlogPost.status).toBe(200);
        expect(accessWithInvalidToken.status).toBe(400);

    })
    
})























 





