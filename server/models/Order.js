import { Schema, model, Types } from 'mongoose';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890', 7)

const orderSchema = new Schema({
    uniqueId: {
        type: String,
        required: true,
        default: () => nanoid(7),
        index: { unique: true },
    },
    name: {type: String, require: true},
    manufacturer: {type: String, default: ''},
    cat: {type: String, default: ''},
    type: {type: String, default: ''},
    text: {type: String, default: ''},
    status: {type: String, default: 'created'},
    fromDate: {type: Date, default: Date.now()},
    messages: [{
        from: String,
        date: {type: Date, default: Date.now()},
        text: String
    }],
    owner: {type: Types.ObjectId, ref: 'User'},
    ownerName: {type: String, default: ''},
    addressee: Types.ObjectId,
    archive: {type: Boolean, default: false},
    initialDestination: {
        name: {type: String, default: ''},
        code: {type: String, default: ''},
    },
});

const Order = model('Order', orderSchema);



export default Order;
