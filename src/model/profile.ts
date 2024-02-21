import mongoose, {Document} from 'mongoose';
export interface contact extends Document {
    name: string,
    profileImage:string,
    status: boolean
}
const contactMes = new mongoose.Schema<contact>({
    name: {
        type:String,
        required: true
    },
    profileImage: {
        type:String,
        required: true
    },
    status: {
        type:Boolean,
        required:true 
    }
})

const Contact = mongoose.model<contact>('contact', contactMes);
export default Contact