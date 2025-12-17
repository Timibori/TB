const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerDetails: {
    name: String,
    email: String,
    message: String
  },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);