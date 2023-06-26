import { Schema, model, Types } from 'mongoose';

const equipmentSchema = new Schema({  
    itemId: {type: String, require: true, unique: true},
    type: {type: String, default: 'other'},
    eqName: String,
    model: String,
    manufacturer: String,
    sn: String,
    invn: String,
    respUser: {
        userId: String,
        userName: String,
    },
    deputyRespUser: {
        userId: String,
        userName: String,
    },
    status: String, // 'ready' | 'broken' | 'repair' | 'storage' | 'verification' | 'verificationExpired' | 'isolate'
    lastVerification: Date,
    nextVerification : Date,
    verificationList: [
        {
            fromDate: Date,
            toDate: Date,
            verificator: String,
            result: String,
            comment: String,
        },
    ],
    passport: {type: String, default : ''},
    cert: {type: String, default : ''},
    manual: {type: String, default  : ''},
    
    troubleshooting: [{
        userId: String,
        userName: String,
        date: Date,
        description: String,
        action: String,
        result : String,
    }],
    currentSop: {
        sopName: {type: String, default : ''},
        version: {type: String, default : ''},    
    },
    sopVersions: [String],
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
    location: {type: String, default    : ''},
});

const Equipment = model('Equipment', equipmentSchema);

export default Equipment;

