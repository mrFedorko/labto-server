import { Schema, model, Types } from 'mongoose';

const userSchema = new Schema({  
    email:{type: String, required: true, unique: true},
    active:{type:Boolean, default: true },
    password:{type: String, required: true},
    refreshToken: {type: String, default: ''},
    name: String,
    direction: String,
    department: String,
    position: String,
    role: String, // 'user', 'prep', 'head', 'admin', 'developer'
    favorite: [Types.ObjectId],
    phone:{type: String, default: ''}
});

const User = model('User', userSchema);



export default User;
