import { Schema, model, Types } from 'mongoose';

const historySchema = new Schema({
    history: {type: [{
        userId: Types.ObjectId,
        historyTarget: {
            name: String, 
            itemId: {type: String, default: ''},
            target: {type: String, default: ''}
        },
        action: String,
        date: {type: Date, default: Date.now()},
    }], default: []},
    owner: {type: Types.ObjectId, ref: 'User'},
});

const History = model('History', historySchema);



export default History;
