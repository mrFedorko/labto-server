import { Schema, model, Types } from 'mongoose';

const projectSchema = new Schema({  
    code: String,
    name: String,
    descr: String,
    type: {type: String, default: ''},
    closed: Boolean,
    creator: String,
});

const Project = model('Project', projectSchema);



export default Project;
