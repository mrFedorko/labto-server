import { Schema, model, Types} from 'mongoose';

const caseSchema = new Schema({
    type: String,
    name: String,
    descr: String,
    from: String,
    adress: String,
    term: String,
    img: {
        min: String,
        max: String,
    },
    price: Number,
    allowed: Boolean,
    tags: [String],
    

});

const Case = model('Case', caseSchema);



export default Case;
