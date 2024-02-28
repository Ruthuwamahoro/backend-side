import axios from 'axios';
const fetchProjectInfo = async() => {
    const userInfo = {
        "username": "testingR1",
        "password": "test1234",
    }
    const response = await axios.post('http://localhost:8080/logininfo/login', userInfo); 
    const token = response.data.token
    const data = await axios.get('http://localhost:8080/project/getallprojects', { headers: { Authorization: `Bearer ${token}` } });
    console.log(data)
    return data
}


test('get all project', async() => {
    const result = await fetchProjectInfo();
    expect(result).toEqual({ status: 'ok', projects: expect.any(Array) });
})


