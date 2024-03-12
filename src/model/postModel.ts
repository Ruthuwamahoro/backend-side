import mongoose, {Schema, Document} from 'mongoose';
export interface Ipost extends Document {
    title: string;
    content: string;
    description: string;
    welcomeIntro: string;
    introduction: string;
    image: string;
    comments: Array<string>;
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
    welcomeIntro: {
        type: String,
        required: true
    },

    introduction:{
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'comments' }],
    created_at: { 
        type: Date, 
        default: Date.now 
    },
});
const postModel = mongoose.model<Ipost>('post', postSchema)
export default postModel