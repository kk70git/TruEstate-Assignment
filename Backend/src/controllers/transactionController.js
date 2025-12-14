const Transaction = require('../models/Transaction');

const buildFilter = (param) => {
  if (!param) return null;
  const arrayParam = Array.isArray(param) ? param : [param];
  return { $in: arrayParam };
};

const getTransactions = async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 10,
      sort = 'date',
      gender,
      region,
      category,
      minAge,
      maxAge,
      startDate,
      endDate,
      paymentMethod,
      tags
    } = req.query;

    const query = {};

    // --- 1. Search ---
    if (search) {
      query.$or = [
        { customer_name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // --- 2. Filters ---
    if (gender) query.gender = buildFilter(gender);
    if (region) query.region = buildFilter(region);
    if (category) query.category = buildFilter(category);
    if (paymentMethod) query.payment_method = buildFilter(paymentMethod);
    
    // Tags Logic: Since it is [String], we use $in to find ANY matching tag
    if (tags) query.tags = buildFilter(tags);

    // Age Range
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }

    // Date Range (Custom)
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate); // Consider setting time to 23:59:59 if needed
    }

    // --- 3. Sorting ---
    let sortOptions = {};
    if (sort === 'date') {
       sortOptions = { date: -1, customer_name: 1, quantity: -1 }; 
    } else if (sort === 'quantity') {
       sortOptions = { quantity: -1, customer_name: 1, date: -1 }; 
    } else if (sort === 'name') {
       sortOptions = { customer_name: 1, date: -1, quantity: -1 }; 
    } else {
       sortOptions = { date: -1, _id: 1 };
    }

    // --- 4. Execution ---
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [transactions, total, statsData] = await Promise.all([
      Transaction.find(query).sort(sortOptions).skip(skip).limit(limitNumber),
      Transaction.countDocuments(query),
      // Stats Aggregation
      Transaction.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            totalUnits: { $sum: "$quantity" },
            totalAmount: { $sum: "$total_amount" }, 
            totalDiscount: { $sum: "$discount" }
          }
        }
      ])
    ]);

    const stats = statsData.length > 0 ? statsData[0] : { totalUnits: 0, totalAmount: 0, totalDiscount: 0 };

    res.status(200).json({
      success: true,
      transactions,
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      stats: {
        units: stats.totalUnits,
        amount: stats.totalAmount,
        discount: stats.totalDiscount
      }
    });

  } catch (error) {
    console.error("Error in getTransactions:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getFilterOptions = async (req, res) => {
  try {
    // Fetch distinct values for dropdowns
    const [regions, categories, paymentMethods, tags] = await Promise.all([
        Transaction.distinct('region'),
        Transaction.distinct('category'),
        Transaction.distinct('payment_method'),
        Transaction.distinct('tags') // Fetch unique tags from the array
    ]);

    res.status(200).json({
      regions: regions.filter(r => r),
      categories: categories.filter(c => c),
      paymentMethods: paymentMethods.filter(p => p),
      tags: tags.filter(t => t)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getTransactions, getFilterOptions };