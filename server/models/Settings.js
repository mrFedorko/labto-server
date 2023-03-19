import { Schema, model, Types } from 'mongoose';

const settingsSchema = new Schema({  
    name: {type: String, default: 'services', unique: true, require: true},       
    status: {type: Boolean, default: false, require: true,}
});

const Settings = model('Settings', settingsSchema);


export default Settings;