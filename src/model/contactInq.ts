import mongoose, {Document} from 'mongoose';
export interface contact extends Document {
    fullName: string,
    email:string,
    message: string
}
const contactMes = new mongoose.Schema<contact>({
    fullName: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    message: {
        type:String,
        required:true 
    }
})

const Contact = mongoose.model<contact>('contact', contactMes);
export default Contact