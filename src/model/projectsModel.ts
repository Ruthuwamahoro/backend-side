import mongoose, {Document} from 'mongoose';
export interface Iproject extends Document {
    title: string
    description: string
    demo: string
}
const projectModel = new mongoose.Schema<Iproject>({
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
    },
    demo: {
        type: String,
        required: true
    }
})


const Project = mongoose.model<Iproject>('project', projectModel);
export default Project