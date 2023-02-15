import { Schema, model, Types } from 'mongoose';

const draftSchema = new Schema({  
    owner: Types.ObjectId,
    expiresDate: {type:Date, default: Date.now(), expires: 3600*24*10},
    date: {type:Date, default: Date.now()},
    action: {type: String, default: 'flow'},
    target : {
        reagent: Types.ObjectId,
        name: String,
        itemId: String,
        units: String
    },
    quan: {type: Number, default: 0},
    destination: String,
    test: String,
});

const Draft = model('Draft', draftSchema);


export default Draft;
