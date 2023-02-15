import { Schema, model, Types } from 'mongoose';

const columnSchema = new Schema({  
    name: String,
    itemId: String,
    manufacturer: String,
    cat: String,
    lot: String,
    sn: String,
    totalInj: {type: Number, default: 0},
    restSolvent: String,
    descr: {type: String, default: ''},
    status: {type: Boolean, default: false},
    mainSubstance: {type: String, default: ''},
    mainProject: {
        code: String,
        name: String,
    },
    current: {
        userId: { type: String, default: ''},
        userName: {type: String, default: ''},
        destination: {type: String, default: ''},
        test: {type: String, default: ''},
        fromdDate: {type: Date},
    },
    inUse: [
        {
            userId: String,
            userName: String,
            fromDate: Date,
            toDate: Date,
            destination: String,
            countInj: Number,
            test: String,
            mobilePhase: String,
            restSolvent: String,
            comment: {type: String, default: ''},
        }
    ],
    passport: {type: String, default: ''},
    pressureLimit: {type: stringify, default: ''},
    isolate: {type: Boolean, default: false},
    isolateDate: Date,
    initialDestination: {
        code: String,
        name: String,
    },
});

const Column = model('Column', columnSchema);


export default Column;
