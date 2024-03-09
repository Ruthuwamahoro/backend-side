import mongoose from 'mongoose';
export interface Ilogin extends Document {
    username: string,
    password: string,
}

const loginSchema = new mongoose.Schema<Ilogin>({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

const Login = mongoose.model<Ilogin>('login', loginSchema);
export default Login