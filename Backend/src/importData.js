require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Transaction = require('./models/Transaction');

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB");

    // OPTIONAL: Only uncomment this if you want to wipe clean and start over.
    // Since you already have 280k, you might want to keep them. 
    // If you want a full fresh start, uncomment the next line:
    // await Transaction.deleteMany({}); console.log("🗑️ Cleared DB");

    const filePath = 'C:/Users/hp/Downloads/truestate_assignment_dataset.csv';
    
    let batch = [];
    const BATCH_SIZE = 1000; 
    let totalInserted = 0;

    const stream = fs.createReadStream(filePath).pipe(csv());

    console.log("🚀 Starting Resilient Import...");

    for await (const data of stream) {
      const mappedData = {
        customer_id: data['Customer ID'],
        customer_name: data['Customer Name'],
        phone: data['Phone Number'],
        gender: data['Gender'],
        age: Number(data['Age']),
        region: data['Customer Region'],
        customer_type: data['Customer Type'],
        product_id: data['Product ID'],
        product_name: data['Product Name'],
        brand: data['Brand'],
        category: data['Product Category'],
        tags: data['Tags'] ? data['Tags'].split(',') : [],
        quantity: Number(data['Quantity']),
        price_per_unit: Number(data['Price per Unit']),
        discount: Number(data['Discount Percentage']),
        total_amount: Number(data['Total Amount']),
        final_amount: Number(data['Final Amount']),
        date: new Date(data['Date']),
        payment_method: data['Payment Method'],
        order_status: data['Order Status'],
        delivery_type: data['Delivery Type'],
        store_id: data['Store ID'],
        store_location: data['Store Location'],
        salesperson_id: data['Salesperson ID'],
        employee_name: data['Employee Name']
      };

      batch.push(mappedData);

      if (batch.length >= BATCH_SIZE) {
        try {
          // ordered: false tells Mongo to continue even if one fails
          await Transaction.insertMany(batch, { ordered: false });
          totalInserted += batch.length;
          process.stdout.write(`\r⏳ Inserted ${totalInserted} records...`);
        } catch (err) {
            // If it's a duplicate error (11000), we just log it and move on
            if (err.code === 11000) {
                 process.stdout.write(`\r⚠️  Batch had duplicates (Safe to ignore), continuing...`);
            } else {
                 console.error('\n❌ Other Error:', err.message);
            }
        }
        batch = []; // Clear batch to free memory
      }
    }

    // Insert remaining rows
    if (batch.length > 0) {
      try {
        await Transaction.insertMany(batch, { ordered: false });
        totalInserted += batch.length;
      } catch (err) {
        console.log("Finished with some duplicate warnings (expected).");
      }
    }

    console.log(`\n🎉 Import Complete! Total Records: ${totalInserted}`);
    process.exit();

  } catch (error) {
    console.error("\n❌ Fatal Error:", error);
    process.exit(1);
  }
};

importData();