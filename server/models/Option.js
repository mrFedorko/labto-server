import { Schema, model } from 'mongoose';

const optionSchema = new Schema({  
    name: String,
    options: [
        {
            value: String,
            label: String,
        }
    ]
});

const Option = model('Option', optionSchema);



export default Option;
