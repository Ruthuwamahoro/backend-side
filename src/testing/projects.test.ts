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
import Project from '../model/projectsModel';

dotenv.config()

let token: string | undefined = undefined;
const api = process.env.API_URL
beforeAll(async() => {
    const userInfo = { "username": "uwamahoro9", "password": "12345678" }
    const response = await axios.post('http://localhost:8080/logininfo/login', userInfo);
    token = response.data.token
})


describe("testing addition of projects", () => {

    test("test get all projects", async() => {
        const accessWithInvalidToken = await request(app).get('/project/getallprojects').set({ Authorization: `Bearer yetfsgsfgsfstgsvxfsfsafgfxvdgvhjgb` })

        const resultproject =  await request(app).get('/project/getallprojects').set({ "Authorization": `Bearer ${token}` })
        expect(resultproject.status).toBe(200);
        expect(accessWithInvalidToken.status).toBe(401);
    })
    
    test("delete a project", async() => {
        const id="65df583c2c77f002df84912e";
        const accessWithInvalidToken = await request(app).delete(`/project/deleteproject/${id}`).set({ Authorization: `Bearer yetfsgsfgsfstgsvxfsfsafgfxvdgvhjgb` })
        jest.spyOn(Project, 'findByIdAndDelete').mockResolvedValueOnce({data: " successfully deleted"});
        const deleteProject = await request(app).delete(`/project/deleteproject/${id}`).set({ Authorization: `Bearer ${token}` })
        expect(deleteProject.status).toBe(200);
        expect(accessWithInvalidToken.status).toBe(401);
    })

    test(" add project", async() => {
        const accessWithInvalidToken = await request(app).post('/project/postproject').set({ Authorization: `Bearer yetfsgsfgsfstgsvxfsfsafgfxvdgvhjgb` })
        jest.spyOn(Project.prototype, 'save').mockResolvedValueOnce("projectmen")
        const addProject = await request(app).post('/project/postproject').send({
            title: "Ruth",
            description: "This is my first post.",
            demo: "This is my first post.",
        }).set({ Authorization: `Bearer ${token}` })
        expect(addProject.status).toBe(200);
        expect(accessWithInvalidToken.status).toBe(401);

    })


    test(" update project", async() => {
        const accessWithInvalidToken = await request(app).patch('/project/updateproject/65df2102b92ea63e9b3fcb82').set({ Authorization: `Bearer yetfsgsfgsfstgsvxfsfsafgfxvdgvhjgb` })
        jest.spyOn(Project, 'findByIdAndUpdate').mockResolvedValueOnce("projectmen")
        const addProject = await request(app).patch('/project/updateproject/65df2102b92ea63e9b3fcb82').send({
            title: "Ruth",
            description: "This is my first poste.",
            content: "This is my first post.",
        }).set({ Authorization: `Bearer ${token}` })
        expect(addProject.status).toBe(200);
        expect(accessWithInvalidToken.status).toBe(401);

    })
    
})























 





