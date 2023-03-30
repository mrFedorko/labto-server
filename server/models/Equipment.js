import { Schema, model } from 'mongoose';

const equipmentSchema = new Schema({  
    itemId: {type: String, require: true, unique: true},
    name: String,
    type: String,
    manufacturer: String,
    sn: String,
    status: String, // 'ready' | 'broken' | 'repair' | 'storage' | 'verification' | 'verificationExpired'
    lastVerification: Date,
    nextVeriffication : Date,
    verificationList: [
        {
            prevVerification: Date,
            date: Date,
            verificator: String,
            result: String,
        },
    ],
    passport: String,
    protocol: String,
    manual: String,
    troubleshooting: [{
        date: Date,
        description: String,
        action: String,
        result : String,
    }],
    location: String    
});

const Equipment = model('Equipment', equipmentSchema);

export default Equipment;

