import { Schema, model, Types} from 'mongoose';

const reagentSchema = new Schema({
    type: String, // 'rs', 'subst', 'reag'
    standartType: String,
    itemId: String,
    name: String,
    cat: String,
    lot: String,
    manuacturer: String,
    fromDate: Date,
    toDate: Date,
    units: String,
    restUnits: Number,
    container: Number,
    passport: [String],
    SDS: String,
    TDS: String,
    inUse: [{
        userId: String,
        date: Date,
        destination: {type: Types.ObjectId},
        quan: Number,
        test: String,
        comment: String,
    }],
    warn: [String],
    price: Number,
    carantin: Boolean,
    creator: Types.ObjectId,
    carantinDate: Date,


    customField1: {type: String, default: ''},
    customField2: {type: String, default: ''},
    customField3: {type: String, default: ''},
    customField4: {type: String, default: ''},
    customField5: {type: String, default: ''},
});

const Reagent = model('Reagent', reagentSchema);



export default Reagent;
