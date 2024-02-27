import axios from 'axios';
test('get all blogs', async() => {

    try {
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        }
        const response = await axios.post('http://localhost:8080/logininfo/login', userInfo); 
        const token = response.data.token
        const blo = await axios.get('http://localhost:8080/post/retrieveallpost', { headers: { Authorization: `Bearer ${token}` } });
        expect(blo.status).toBe(200);
        expect(Array.isArray(blo.data)).toBe(true);
        console.log(blo.data)
    } catch (err) {
        console.log(err)
    }
})


test('unathorized get of  all blogs ', async() => {

    try {
        const blo = await axios.get('http://localhost:8080/post/retrieveallpost')
        expect(blo.status).toBe(400);
        expect(blo.data).toEqual({ status: 400, error: 'invalid token' });
    } catch (err) {
        console.log(err)
    }
})


test('post blogs', async() => {

    try {
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        }


        const newBlogs = {
            "title": "testing",
            "content": "testing",
            "description": "testing",
            "image": "testing",
        } 
        const response = await axios.post('http://localhost:8080/logininfo/login', userInfo); 
        const token = response.data.token
        const blo = await axios.post('http://localhost:8080/post/postblog', newBlogs, { headers: { Authorization: `Bearer ${token}` } });
        expect(blo.status).toBe(200);
        expect(blo.data).toEqual({ status: 'ok', data:"Successfully posted blog" });
    } catch (err) {
        console.log(err)
    }
})



test('unauthorized access of post blogs', async() => {

    try {


        const newBlogs = {
            "title": "testing",
            "content": "testing",
            "description": "testing",
            "image": "testing",
        } 
        const blo = await axios.post('http://localhost:8080/post/postblog', newBlogs);
        expect(blo.status).toBe(400);
        expect(blo.data).toEqual({ status: 400, error: 'invalid token' });
    } catch (err) {
        console.log(err)
    }
})








test('get single blogs', async() => {

    try {
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        }


        const id = "63d6e0e0b4b5b5b5b5b5b5b5"
        const response = await axios.post('http://localhost:8080/logininfo/login', userInfo); 
        const token = response.data.token
        const blo = await axios.post(`http://localhost:8080/post/getsinglepost/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        expect(blo.status).toBe(200);
        expect(Array.isArray(response.data.data)).toBe(true);
    } catch (err) {
        console.log(err)
    }
})


test("unauthorized access of get single blog", async() => {
    try {
        const id = "63d6e0e0b4b5b5b5b5b5b5b5"
        const blo = await axios.post(`http://localhost:8080/post/getsinglepost/${id}`);
        expect(blo.status).toBe(400);
        expect(blo.data).toEqual({ status: 400, error: 'invalid token' });
    } catch (err) {
        console.log(err)
    }
})


test('update single blogs', async() => {
    try {
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        }
        const id = "63d6e0e0b4b5b5b5b5b5b5b5"
        const response = await axios.post('http://localhost:8080/logininfo/login', userInfo);
        const token = response.data.token 
        const blo= await axios.post(`http://localhost:8080/post/updatepost/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        expect(blo.status).toBe(200);
        expect(Array.isArray(blo.data.data)).toBe(true);
        console.log(blo.data)
    } catch (err) {
        console.log(err)
    }
})


test('unauthorized access of update single blog', async() => {
    try {
        const id = "63d6e0e0b4b5b5b5b5b5b5b5"
        const res = await axios.post(`http://localhost:8080/post/updatepost/${id}`);
        expect(res.status).toBe(400);
        expect(res.data).toEqual({ status: 400, error: 'invalid token' });
    } catch (error) {
        console.log(error);
    }
})



test('delete single blog', async() => {
    try {
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        }
        const id = "63d6e0e0b4b5b5b5b5b5b5b5"
        const response = await axios.post('http://localhost:8080/logininfo/login', userInfo);
        const token = response.data.token 
        const blo = await axios.post(`http://localhost:8080/project/deleteproject/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        expect(blo.status).toBe(200);
        expect(blo.data).toBe("blog Deleted Successfully");
        console.log(blo.data)
    } catch (err) {
        console.log(err)
    }
})


test('unauthorized access of delete single blog', async() => {
    try {
        const id = "63d6e0e0b4b5b5b5b5b5b5b5"

        const response = await axios.post(`http://localhost:8080/project/deleteproject/${id}`);
        expect(response.status).toBe(400);
        expect(response.data).toEqual({ status: 400, error: 'invalid token' });
        console.log(response.data)
    } catch (err) {
        console.log(err)
    }
})


//test for projects

test('get all projects', async() => {

    try {
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        }
        const response = await axios.post('http://localhost:8080/logininfo/login', userInfo); 
        const token = response.data.token
        const blo = await axios.get('http://localhost:8080/project/getallprojects', { headers: { Authorization: `Bearer ${token}` } });
        expect(blo.status).toBe(200);
        expect(Array.isArray(blo.data.data)).toBe(true);
        console.log(blo.data)
    } catch (err) {
        console.log(err)
    }
})


test('unAuthorized access to all projects', async() => {

    try {
        const blo = await axios.get('http://localhost:8080/project/getallprojects');
        expect(blo.status).toBe(400);
        expect(blo.data).toEqual({ status: 400, error: 'invalid token' });
    } catch (err) {
        console.log(err)
    }
})







//test if the user does not logged in 



test('post project', async() => {

    try {
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        }


        const newProjects = {
            "title": "testing",
            "description": "testing",
            "demo": "testing",
        } 
        const response = await axios.post('http://localhost:8080/logininfo/login', userInfo); 
        const token = response.data.token
        const blo = await axios.post('http://localhost:8080/project/postproject', newProjects, { headers: { Authorization: `Bearer ${token}` } });
        expect(blo.status).toBe(200);
        expect(blo.data).toEqual({ status: 'ok', data:"project posted" });
    } catch (err) {
        console.log(err)
    }
})




test('unauthorized access of post projects', async() => {

    try {


        const newBlogs = {
            "title": "testing",
            "description": "testing",
            "demo": "testing",
            
        } 
        const blo = await axios.post('http://localhost:8080/project/postproject', newBlogs);
        expect(blo.status).toBe(400);
        expect(blo.data).toEqual({ status: 400, error: 'invalid token' });
    } catch (err) {
        console.log(err)
    }
})


test('update single projects', async() => {
    try {
        const id = "63d6e0e0b4b5b5b5b5b5b5b5"
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        }
        const response = await axios.post('http://localhost:8080/logininfo/login', userInfo); 
        const token = response.data.token
        const blog = await axios.post(`http://localhost:8080/project/updateproject/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        expect(blog.status).toBe(200);
        expect(blog.data).toBe("Project Updated Successfully");
        console.log(blog.data)
    } catch (err) {
        console.log(err)
    }
})


test("unauthorized access of update single project", async() => {
    try {
        const id = "63d6e0e0b4b5b5b5b5b5b5b5"
        const blo = await axios.post(`http://localhost:8080/project/updateproject/${id}`);
        expect(blo.status).toBe(400);
        expect(blo.data).toEqual({ status: 400, error: 'invalid token' });
    } catch (err) {
        console.log(err)
    }
})



test('unauthorized access of delete single project', async() => {
    try {
        const id = "63d6e0e0b4b5b5b5b5b5b5b5"
        const blo = await axios.post(`http://localhost:8080/project/deleteproject/${id}`);
        expect(blo.status).toBe(400);
        expect(blo.data).toEqual({ status: 400, error: 'invalid token' });
    } catch (err) {
        console.log(err)
    }
})




test('delete single projects', async() => {
    try {
        const id = "63d6e0e0b4b5b5b5b5b5b5b5"
        const userInfo = {
            "username": "testingR1",
            "password": "test1234",
        }
        const response = await axios.post('http://localhost:8080/logininfo/login', userInfo); 
        const token = response.data.token
        const blog = await axios.post(`http://localhost:8080/project/deleteproject/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        expect(blog.status).toBe(200);
        expect(blog.data).toBe("Project Deleted Successfully");
        console.log(blog.data)
    } catch (err) {
        console.log(err)
    }
})


//contact message


// test('get all contact messages', async() => {

//     try {
//         const userInfo = {
//             "username": "testingR1",
//             "password": "test1234",
//         }
//         const response = await axios.post('http://localhost:8080/logininfo/login', userInfo); 
//         const token = response.data.token
//         const blo = await axios.get('http://localhost:8080/contact/contactmessage', { headers: { Authorization: `Bearer ${token}` } });
//         expect(blo.status).toBe(200);
//         expect(Array.isArray(blo.data.data)).toBe(true);
//         console.log(blo.data)
//     } catch (err) {
//         console.log(err)
//     }
// })

















 





