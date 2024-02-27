import mongoose, {Schema, Document} from 'mongoose';
import Comment from './commentSection'
export interface Ipost extends Document {
    title: string;
    content: string;
    description: string;
    image: string;
    Comment?: [{
        type: Schema.Types.ObjectId,
    }];
    created_at?: Date;

}
const postSchema= new Schema<Ipost>({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    //Comment: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'comment',
    //     required: false
    // }],
    created_at: { 
        type: Date, 
        default: Date.now 
    },
});
const postModel = mongoose.model<Ipost>('post', postSchema);
export default postModel