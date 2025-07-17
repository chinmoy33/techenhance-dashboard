import DataTable from '../components/Leadtracking/DataTable';
import LoanFunnel from '../components/Leadtracking/Loanfunnelstats';
import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react'
import { recommendationService } from "../services/recommendationService.ts"
import { LoanData } from '../types/LoanData.ts'
import { useTransformLead } from "../hooks/useTransformData.ts"
import { Search, Filter, ListFilter } from 'lucide-react'
import FunnelChart from '../components/Leadtracking/FunnelChart';

function Leadtrackingpage() {
  const [Lead, setLead] = useState<LoanData[]>([]);

  const [filteredLead, setFilteredLead] = useState<LoanData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    interested: '',
    type_of_mutual_fund: '',
    kyc_completed: '',
    final_amount: '',
    final_disbursed_amt: ''
  });
  const [showChart, setShowChart] = useState(false); // State to toggle chart visibility
  const [showFunnelChart, setShowFunnelChart] = useState(false); // State to toggle funnel chart visibility

  useEffect(() => {
    const fetchData = async () => {
      const data = await recommendationService.getLeads();
      //console.log(data[0].eligible_mutualfunds_clients);
      const transformedData = useTransformLead(data);
      console.log(data[0].eligible_mutualfunds_clients);
      console.log("Fetched Leads:", transformedData);
      if (data) {
        console.log("inside fetchData");
        setLead(transformedData);
      }
    };

    // Call immediately once on mount
    fetchData();

  }, [])

  useEffect(() => {
    let updated = [...Lead];

    if (filters.interested) {
      updated = updated.filter(item => item.interested?.toLowerCase() === filters.interested.toLowerCase());
    }

    if (filters.type_of_mutual_fund) {
      updated = updated.filter(item => item.type_of_mutual_fund === filters.type_of_mutual_fund);
    }

    if (filters.kyc_completed) {
      updated = updated.filter(item => item.kyc_completed === (filters.kyc_completed === 'true'));
    }

    if (filters.final_amount) {
      const threshold = parseFloat(filters.final_amount);
      updated = updated.filter(item => item.final_amount >= threshold);
    }

    if (filters.final_disbursed_amt) {
      const threshold = parseFloat(filters.final_disbursed_amt);
      updated = updated.filter(item => item.final_disbursed_amt >= threshold);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      updated = updated.filter(item =>
        item.eligible_mutualfunds_clients?.person_name?.toLowerCase().includes(term) ||
        item.eligible_mutualfunds_clients?.account_number?.toLowerCase().includes(term)
      );
    }

    setFilteredLead(updated);
  }, [Lead, filters, searchTerm]);


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-indigo-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">Loan Analytics Dashboard</h1>
            </div>
            <div className="text-sm text-gray-400">
              {Lead.length} total applications
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Search & Filter</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by Name/Account"
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>


            <div>
              <select
                onChange={(e) => setFilters(prev => ({ ...prev, interested: e.target.value }))}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Interested</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>


            <div>
              <select
                onChange={(e) => setFilters(prev => ({ ...prev, type_of_mutual_fund: e.target.value }))}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="SIP">SIP</option>
                <option value="annually">Annually</option>
                <option value="biannually">Biannually</option>
              </select>
            </div>

            <div>
              <select
                onChange={(e) => setFilters(prev => ({ ...prev, kyc_completed: e.target.value }))}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All KYC</option>
                <option value="true">Completed</option>
                <option value="false">Not Completed</option>
              </select>
            </div>

            <div className="relative">
              <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Min Final Amount"
                onChange={(e) => setFilters(prev => ({ ...prev, final_amount: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Min Disbursed Amount"
                onChange={(e) => setFilters(prev => ({ ...prev, final_disbursed_amt: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

          </div>
        </div>

        {/* DataTable Section */}
        <div className="flex gap-2">
          <DataTable data={filteredLead} />
          <FunnelChart data={filteredLead} />
        </div>


        {/* Loan Funnel Grid Below */}
        <div className="gap-6">
          <LoanFunnel data={filteredLead} />

          {/* Chart Toggle Buttons */}
          {/* <div className="flex gap-4 mt-6"> */}
            {/* New Funnel Chart Button */}
            {/* <button
              onClick={() => setShowFunnelChart(!showFunnelChart)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {showFunnelChart ? 'Hide Funnel Pipeline' : 'Show Funnel Pipeline'}
            </button>
          </div> */}

          {/* Conditionally render the new funnel chart */}
          {/* {showFunnelChart && <FunnelChart data={filteredLead} />} */}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-400 text-sm">
            Loan Analytics Dashboard - Real-time data visualization
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Leadtrackingpage;
