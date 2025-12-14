const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // --- 1. Customer Fields ---
  customer_id: { type: String, required: true },
  
  // Existing indexes for Search
  customer_name: { type: String, required: true, index: true }, 
  phone: { type: String, required: true, index: true },         
  
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  
  // NEW INDEX HERE: Needed for fast Region dropdown
  region: { type: String, required: true, index: true }, 
  
  customer_type: { type: String, required: true },

  // --- 2. Product Fields ---
  product_id: { type: String, required: true },
  product_name: { type: String, required: true },
  brand: { type: String, required: true },
  
  // NEW INDEX HERE: Needed for fast Category dropdown
  category: { type: String, required: true, index: true }, 
  
  tags: { type: [String], default: [] }, 

  // --- 3. Sales Fields ---
  quantity: { type: Number, required: true },
  price_per_unit: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total_amount: { type: Number, required: true },
  final_amount: { type: Number, required: true },

  // --- 4. Operational Fields ---
  date: { type: Date, required: true },
  
  // NEW INDEX HERE: Needed for fast Payment dropdown
  payment_method: { type: String, required: true, index: true }, 
  
  order_status: { type: String, required: true },
  delivery_type: { type: String, required: true },
  store_id: { type: String, required: true },
  store_location: { type: String, required: true },
  salesperson_id: { type: String, required: true },
  employee_name: { type: String, required: true }
}, {
  timestamps: true,          // Adds createdAt/updatedAt
  collection: 'transactions' // CRITICAL: Forces Mongoose to use your existing Atlas collection
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;