import { Schema, model, Types} from 'mongoose';

const reagentSchema = new Schema({
    type: String, // 'rs', 'subst', 'reag'
    standartType: String,
    itemId: {type: String, require: true, unique: true} ,
    name: String,
    CAS: {type: String, default: ''},
    cat: String,
    lot: String,
    manufacturer: String,
    fromDate: Date,
    toDate: Date,
    units: String,
    restUnits: Number,
    container: Number,
    location: {type: String, default: ''},
    passport: {type: String, default: ''},
    SDS: String,
    TDS: String,
    inUse: [{
        userId: String,
        date: Date,
        destination: {type: String},
        quan: Number,
        test: String,
        comment: {type: String, default: ''},
        name: String,
    }],
    warn: [String],
    price: Number,
    isolate: {type: Boolean, default: false},
    creator: Types.ObjectId,
    isolateDate: Date,
    changed: {type: Boolean, default: false},
    initialDestination: {type: String,  default: ''}
});

const Reagent = model('Reagent', reagentSchema);



export default Reagent;
