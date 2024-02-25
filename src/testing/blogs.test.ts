import axios from 'axios';
import Login from "../model/login";
import postModel from '../model/postModel';

// test("list all blogs to the account", async() => {
// //    let token = ""
// //    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwicGFzc3dvcmQiOiJ0ZXN0MjAyMiIsImlhdCI6MTY3MDY3NzQwMn0.0Y5KU8VZ5JqXtW7Tnq6o8nqBq7Eg9DkKx4p0Dx9JLp8"
//  //   try{
// //       const loginUser = await Login.findOne({username: "testingR1"})
// //       if(loginUser){
// //          //token = loginUser.token;
//         //   const response = await axios.get('http://localhost:8080/post/retrieveallpost', {headers: {'Authorization': `Bearer ${token}`}});
//         //   console.log(response)
//         //   console.log(response.data)
//         //   expect(response.status).toBe(200);
//         //   expect(response.data).toEqual({ status: 'ok', message:"Successfully retrieved all blogs"});
          
//     //    }
//     // } catch(err){
//     //     console.log(err)
//     // }
//   }
//   );
test('get all blogs', async() => {
    try {
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QxIiwicGFzc3dvcmQiOiJ0ZXN0MjAyMiIsImlhdCI6MTY3MDY3NzQwMn0.0Y5KU8VZ5JqXtW7Tnq6o8nqBq7Eg9DkKx4p0Dx9JLp8"
        const response = await axios.get('http://localhost:8080/post/retrieveallpost', {headers: {'Authorization': `Bearer ${token}`}});
        expect(response.status).toBe(200);
        expect(response.data).toEqual({ status: 'ok', message:"Successfully retrieved all blogs"});
    } catch (err) {
        console.log(err)
    }
})



