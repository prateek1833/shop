const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
    items: [
        {
            item: {
                image: {
                    url: String,
                    filename: String,
                },
                _id: String,
                title: String,
                description: String,
                unit:String,
                price: Number,
                typ:String,
                quantity: Number,
                owner: String,
                __v: Number,
            },
        },
    ],
    status:String,
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    author: {
        _id:String,
        name:String,
        address:String,
        mobile: Number,
        distance:Number,
        balance_due:Number,
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
