import axios from 'axios';
const fetchContactInfo = async() => {
    const userInfo = {
        "username": "testingR1",
        "password": "test1234",
    }
    const response = await axios.post('http://localhost:8080/logininfo/login', userInfo); 
    const token = response.data.token
    const result = await axios.get('http://localhost:8080/contact/contactmessage', { headers: { Authorization: `Bearer ${token}` } });
    console.log(result)
    return result.data
}

test('get all contact messages', async() => {
    const result = await fetchContactInfo();
    expect(result).toEqual({ status: 'ok', messages: expect.any(Array) });
})