import { Schema, model, Types } from 'mongoose';

const orderSchema = new Schema({
    name: {type: String, require: true},
    type: {type: String, default: ''},
    quan: {type: String, default: ''},
    comment: {type: String, default: ''},
    status: {type: String, default: ''},
    fromDate: {type: String, default: ''},
    message: {type: Array},
    target: {type: Types.ObjectId, ref: 'Reagent'},
    owner: {type: Types.ObjectId, ref: 'User'},
});

const Order = model('Order', orderSchema);



export default Order;
