import { Schema, model, Types } from 'mongoose';

const sopSchema = new Schema({  
    code: String,
    name: String,
    allVersions: [String],
    currentVersion: String,
    creator: {
        userName: String,
        userId: String,
    },
    lastReview: Date,
    trainigList:[
        {
            userName: String,
            userId: String,
            date: Date,
            sopVersion: String,
            trainer: {
                userName: String,
                userId: String,
            }, 
        }
    ],
    
    
});

const Sop = model('Sop', sopSchema);


export default Sop;
