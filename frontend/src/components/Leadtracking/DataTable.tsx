import React from 'react';
import { LoanData } from '../../types/LoanData';

interface DataTableProps {
  data: LoanData[];
}

const DataTable: React.FC<DataTableProps> = ({ data }) => {
  return (
  <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
  <div className="px-6 py-4 bg-gray-700 border-b border-gray-600">
    <h2 className="text-xl font-semibold text-white">Loan Application Data</h2>
    <p className="text-gray-300 text-sm mt-1">Complete dataset overview</p>
  </div>

  {/* Table Wrapper */}
  <div className="overflow-x-auto">
    {/* Fixed-height scrollable section */}
    <div className="max-h-[800px] overflow-y-auto">
      <table className="w-full">
        <thead className="bg-gray-700 sticky top-0 z-10">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Account Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Interested</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mutual Fund Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Final Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">KYC Completed</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Final Disbursed</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-700 transition-colors duration-200">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {item?.eligible_mutualfunds_clients?.person_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {item?.eligible_mutualfunds_clients?.account_number}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item.interested?.toLowerCase() === 'yes'
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.interested?.toLowerCase() === 'yes' ? 'Yes' : 'No'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item?.type_of_mutual_fund}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{item?.amount?.toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{item?.final_amount}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  item?.kyc_completed
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item?.kyc_completed ? 'Clear' : 'Not Clear'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">₹{item?.final_disbursed_amt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

  );
};

export default DataTable;