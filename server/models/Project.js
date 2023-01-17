import { Schema, model, Types } from 'mongoose';

const projectSchema = new Schema({  
    code: String,
    name: String,
    type: {type: String, default: ''},
    closed: Boolean,
});

const Project = model('Project', projectSchema);



export default Project;
