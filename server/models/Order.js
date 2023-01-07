import { Schema, model, Types } from 'mongoose';

const orderSchema = new Schema({
    name: {type: String, require: true},
    type: {type: String, default: ''},
    details:{},
    quan: {type: String, default: ''},
    comment: {type: String, default: ''},
    status: {type: String, default: ''},
    date: {type: String, default: ''},
    expDate: {type: String, default: ''},
    layout: {type: Array},
    docs: {type: Types.ObjectId, ref: 'Document'},
    owner: {type: Types.ObjectId, ref: 'User'},
    price: {type: String, default: ''},
    delivery: {
        // type: {type: String},
        // town: {type: String},
        // adress: {type: String},
        // comment: {type: String},
    },
    receiver: {
        // name: {type: String},
        // phone: {type: String},
    }
    
});

const Order = model('Order', orderSchema);



export default Order;
