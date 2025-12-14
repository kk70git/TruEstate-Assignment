import React from 'react';
import { Copy } from 'lucide-react';

const TransactionTable = ({ transactions, loading }) => {
  const headers = [
    'Transaction ID', 'Date', 'Customer ID', 'Customer Name', 'Phone Number', 
    'Gender', 'Age', 'Product Category', 'Quantity', 'Total Amount', 
    'Customer Region', 'Product ID', 'Employee Name'
  ];

  const getVal = (val) => val || 'N/A';

  if (loading) {
    return (
      <div className="overflow-x-auto w-full bg-white rounded-lg border border-gray-100 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f3f3f3] border-b border-gray-200 text-xs font-semibold text-gray-600">
              {headers.map((h) => <th key={h} className="px-6 py-4 min-w-[140px] whitespace-nowrap">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...Array(10)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                {headers.map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full bg-white rounded-lg border border-gray-100 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#f3f3f3] border-b border-gray-200 text-xs font-semibold text-gray-600">
            {headers.map((h) => (
              <th key={h} className="px-6 py-4 min-w-[140px] whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="13" className="px-6 py-10 text-center text-gray-500 text-sm">
                No transactions found.
              </td>
            </tr>
          ) : (
            transactions.map((t, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                
                {/* 1. Transaction ID */}
                <td className="px-6 py-4 text-gray-500 font-mono">
                   {getVal(t._id).toString().slice(-7).toUpperCase()}
                </td>
                
                {/* 2. Date */}
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {t.date ? new Date(t.date).toISOString().split('T')[0] : 'N/A'}
                </td>
                
                {/* 3. Customer ID */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  {getVal(t.customer_id)}
                </td>
                
                {/* 4. Customer Name */}
                <td className="px-6 py-4 font-medium text-gray-900">
                   {getVal(t.customer_name)}
                </td>
                
                {/* 5. Phone Number */}
                <td className="px-6 py-4 text-gray-500">
                  <div className="flex items-center gap-2">
                    {getVal(t.phone)} 
                    <Copy size={14} className="text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>
                </td>
                
                {/* 6. Gender */}
                <td className="px-6 py-4">{getVal(t.gender)}</td>
                
                {/* 7. Age */}
                <td className="px-6 py-4">{getVal(t.age)}</td>
                
                {/* 8. Product Category */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  {getVal(t.category)}
                </td>
                
                {/* 9. Quantity */}
                <td className="px-6 py-4 text-center font-medium text-gray-900">
                  {String(t.quantity || 0).padStart(2, '0')}
                </td>

                {/* 10. Total Amount */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  ₹{t.total_amount ? t.total_amount.toLocaleString() : '0'}
                </td>

                {/* 11. Customer Region */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  {getVal(t.region)}
                </td>

                {/* 12. Product ID */}
                <td className="px-6 py-4 text-gray-900 font-medium font-mono">
                  {getVal(t.product_id)}
                </td>

                {/* 13. Employee Name */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  {getVal(t.employee_name)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;