import { Schema, model, Types } from 'mongoose';

const userSchema = new Schema({  
    email:{type: String, required: true, unique: true},
    verified:{type:Boolean, default: false },
    password:{type: String, required: true},
    refreshToken: {type: String, default: ''},
    name: String,
    direction: String,
    department: String,
    position: String,
    role: String, // 'user', 'prep', 'head', 'admin', 'developer'
    favorite: [Types.ObjectId],
    draft: [{
        target: String,
        quan: Number
    }]
});

const User = model('User', userSchema);



export default User;
