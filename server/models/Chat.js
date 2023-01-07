import { Schema, model, Types} from 'mongoose';

const chatSchema = new Schema({
    owner: {type: Types.ObjectId, ref: "User"},
    messages: [
        {
            from: {type: String},
            date: {type: Number},
            text: {type: String},
            like: {type: Boolean}
        }
    ]
});

const Chat = model('Chat', chatSchema);



export default Chat;
