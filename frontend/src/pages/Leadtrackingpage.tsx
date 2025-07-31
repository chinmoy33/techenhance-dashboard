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
      try {
        const data = await recommendationService.getLeads();
        const transformedData = useTransformLead(data);
        console.log("Fetched Leads:", transformedData);
        if (transformedData) { // Check if transformedData is not null/undefined
          setLead(transformedData);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
        // Optionally, show a toast notification to the user
      }
    };

    fetchData();
  }, [])

  useEffect(() => {
    let updated = [...Lead];

    // if (filters.interested) {
    //   updated = updated.filter(item => item.interested?.toLowerCase() === filters.interested.toLowerCase());
    // }
    if (filters.interested) {
      if (filters.interested.toLowerCase() === 'not decided') {
        // Filter for items where 'interested' is null, undefined, or an empty string
        updated = updated.filter(item =>
          item.interested == "not decided"
        );
      } else {
        // Existing logic for 'yes' or 'no'
        updated = updated.filter(item => item.interested?.toLowerCase() === filters.interested.toLowerCase());
      }
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

  let attribute1;
  let attribute2;
  let attribute3;
  let attribute4;
  let attribute5;
  let attribute6;
  if (window.innerWidth <= 768) {
    attribute1 = "flex flex-col items-center"
    attribute2 = "w-[95vw]"
    attribute3 = "w-[95vw]"
    attribute4 = "w-[95vw] bg-slate-800 rounded-xl border border-slate-700 "
    attribute5 = ""
    attribute6 = "items-center"
  }
  else {
    attribute1 = ""
    attribute2 = ""
    attribute3 = "w-full"
    attribute4 = "flex"
    attribute5 = "h-auto"
    attribute6 = ""
  }


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className={`${attribute1}`}>
        <header className={`${attribute2} bg-gray-800 shadow-lg border-b border-gray-700`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-3 sm:py-0"> {/* Added flex-col and sm:flex-row */}
              <div className="flex items-center justify-center mb-2 sm:mb-0"> {/* Adjusted margin for mobile */}
                <TrendingUp className="w-8 h-8 text-indigo-400 " />
                <h1 className="text-2xl sm:text-3xl font-bold text-white text-left ml-2"> {/* Adjusted text size */}
                  Fund Analytics Dashboard
                </h1>
              </div>
              <div className="text-sm text-gray-400">
                {Lead.length} total applications
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 sm:space-y-12"> {/* Adjusted spacing */}
        <div className={`${attribute1}`}>
          <div className={`${attribute2} bg-slate-800 rounded-xl p-4 sm:p-6 border border-slate-700 mb-4 sm:mb-6`}> {/* Adjusted padding */}
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Search & Filter</h2>
            </div>

            {/* Filter Grid: Now uses grid-cols-1 for very small screens, then expands */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

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
                  <option value="not decided">Not Decided</option>
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

              {/* <div className="relative">
              <ListFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Min Final Amount"
                onChange={(e) => setFilters(prev => ({ ...prev, final_amount: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div> */}

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
        </div>

        {/* DataTable and FunnelChart Section */}
        {/* Changed from flex gap-2 to flex-col on small screens, then md:flex-row on medium screens */}
        <div className={`flex flex-col ${attribute6} md:justify-center md:flex-row gap-2 ${attribute5}`}> {/* Adjusted gap and direction */}
          {/* DataTable Wrapper: Added overflow-x-auto for responsiveness */}
          <div className={`${attribute3} md:w-3/5 overflow-x-auto bg-slate-800 rounded-xl border border-slate-700`}>
            <DataTable data={filteredLead} />
          </div>

          {/* Funnel Chart Wrapper: Added w-full for small screens and md:w-1/3 for medium and larger */}
          <div className={`${attribute3} md:w-2/5 bg-slate-800 rounded-xl border border-slate-700`}>
            <FunnelChart data={filteredLead} />
          </div>
        </div>

        {/* Loan Funnel Grid Below */}
        {/* Added wrapper for LoanFunnel and adjusted gap */}
        <div className={`${attribute1}`}>
          <div className={`${attribute4}`}>
            <LoanFunnel data={filteredLead} />
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-8 sm:mt-12"> {/* Adjusted margin-top */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-gray-400 text-sm">
            Fund Analytics Dashboard - Real-time data visualization
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Leadtrackingpage;