import mongoose, {Document} from 'mongoose';
export interface profile extends Document {
    name: string,
    profileImage:string,
    status: string
}
const profileInfo = new mongoose.Schema<profile>({
    name: {
        type:String,
        required: true
    },
    profileImage: {
        type:String,
        required: true
    },
    status: {
        type:String,
        required:true 
    }
})

const Profile = mongoose.model<profile>('profile', profileInfo);
export default Profile