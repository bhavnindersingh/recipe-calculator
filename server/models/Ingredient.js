const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  cost: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  supplier: {
    type: String,
    required: true
  },
  minQuantity: {
    type: Number,
    required: true
  },
  supplierContact: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
