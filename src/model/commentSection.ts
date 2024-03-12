import mongoose, {Schema, Document} from 'mongoose';
export interface Icomment extends Document {
    postId: Schema.Types.ObjectId;
    username: string;
    commentMessage: string;
    created_at?: Date;

}
const commentSchema= new mongoose.Schema<Icomment>({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    username: {
        type: String,
        required: true
    },
    commentMessage: {
        type: String,
        required: true,
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
});
const Comment = mongoose.model<Icomment>('comments', commentSchema)
export default Comment