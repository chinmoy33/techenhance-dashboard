import React from 'react';
import { FilterOptions, LoanType, RiskLevel } from '../../types/loan.ts';
import { Search, Filter, DollarSign } from 'lucide-react';

interface FilterControlsProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({ filters, onFiltersChange }) => {
  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  // const handleLoanTypeChange = (loantype: LoanType | 'all') => {
  //   onFiltersChange({ ...filters, loantype });
  // };

  const handleRiskLevelChange = (risklevel: RiskLevel | 'all') => {
    onFiltersChange({ ...filters, risklevel });
  };

  const handleSalaryRangeChange = (minSalary: number, maxSalary: number) => {
    onFiltersChange({ ...filters, minSalary, maxSalary });
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white">Search & Filter</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Loan Type */}
        {/* <div>
          <select
            value={filters.loantype}
            onChange={(e) => handleLoanTypeChange(e.target.value as LoanType | 'all')}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Loan Types</option>
            <option value="car">Car Loan</option>
            <option value="house">House Loan</option>
            <option value="personal">Personal Loan</option>
            <option value="business">Business Loan</option>
            <option value="education">Education Loan</option>
            <option value="no loan">No Loan</option>
          </select>
        </div> */}

        {/* Risk Level */}
        <div>
          <select
            value={filters.risklevel}
            onChange={(e) => handleRiskLevelChange(e.target.value as RiskLevel | 'all')}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
          </select>
        </div>

        {/* Salary Range */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <select
            value={`${filters.minSalary}-${filters.maxSalary}`}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-').map(Number);
              handleSalaryRangeChange(min, max);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="0-9999999">All Salaries</option>
            <option value="0-250000">Under $250k</option>
            <option value="250000-500000">$250k - $500k</option>
            <option value="500000-750000">$500k - $750k</option>
            <option value="750000-1000000">$750k - $1000k</option>
            <option value="1000000-9999999">Above $1000k</option>
          </select>
        </div>
      </div>
    </div>
  );
};