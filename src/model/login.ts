import mongoose from 'mongoose';
export interface Ilogin extends Document {
    username: string,
    password: string,
    role: string
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
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

const Login = mongoose.model<Ilogin>('login', loginSchema);
export default Login