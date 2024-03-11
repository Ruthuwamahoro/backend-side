import mongoose, {Schema, Document} from 'mongoose';
export interface Icomment extends Document {
    commentMessage: string;
    likes?: Array<string>; 
    created_at?: Date;

}
const commentSchema= new mongoose.Schema<Icomment>({
    commentMessage: {
        type: String,
        required: true,
    },
    likes: {
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
});
const Comment = mongoose.model<Icomment>('comment', commentSchema)
export default Comment