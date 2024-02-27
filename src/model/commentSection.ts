import mongoose, {Schema, Document} from 'mongoose';
import postModel from './postModel';
export interface Icomment extends Document {
    commentMessage: string;
    postId: Schema.Types.ObjectId;
    likes?: Array<string>; 
    created_at?: Date;

}
const commentSchema= new mongoose.Schema<Icomment>({
    commentMessage: {
        type: String,
        required: true,
    },
    postId:{
        type: Schema.Types.ObjectId,
        ref: 'post',
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
});
const Comment = mongoose.model<Icomment>('comment', commentSchema);
export default Comment