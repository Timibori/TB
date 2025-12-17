const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  // I made this optional (required: false) so your current data works
  image: { type: String, required: false } 
});

module.exports = mongoose.model('Menu', MenuSchema);