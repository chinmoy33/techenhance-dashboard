import DataTable from '../components/Leadtracking/DataTable';
import LoanFunnel from '../components/Leadtracking/Loanfunnelstats';
import { History } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react'
import { recommendationService } from "../services/recommendationService.ts"
import { RecommendationData } from '../types/loan'
import { useTransformData,useTransformLead } from "../hooks/useTransformData.ts"
import { Search, Filter, ListFilter } from 'lucide-react'
import RecommendationTable from '../components/Recommendation_history/RecommendationTable.tsx';
import {LoanData} from '../types/LoanData.ts';
import { useDispatch,useSelector } from 'react-redux';
import { toggleContactForm } from '../store/uiSlice.ts';
import { RootState } from '../store';

function RecommendationHistoryPage() {
  const dispatch = useDispatch();
  const showContactForm = useSelector((state: RootState) => state.ui.showContactForm);
  const [history, setHistory] = useState<RecommendationData[]>([]);
  const [lead, setLead] = useState<LoanData[]>([]);  
  const [filteredHistory, setFilteredHistory] = useState<RecommendationData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    interested: '',
    contacted:'',
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await recommendationService.getHistory();
      //console.log(data[0].eligible_mutualfunds_clients);
      const transformedData = useTransformData(data);
      console.log("Fetched History:", transformedData);
      if (data) {
        console.log("inside fetchData");
        setHistory(transformedData);
      }
    };

    // Call immediately once on mount
    fetchData();

  }, [filteredHistory])

  useEffect(() => {
      const fetchData = async () => {
        const data = await recommendationService.getLeads();
        //console.log(data[0].eligible_mutualfunds_clients);
        const transformedData = useTransformLead(data);
        console.log("Fetched Leads:", transformedData);
        if (data) {
          console.log("inside fetchData");
          setLead(transformedData);
        }
      };
  
      // Call immediately once on mount
      fetchData();
  
    }, [showContactForm])
  
    const contactedPersonIds = useMemo(() => {
        return new Set(lead.map(l => l.eligible_person_id));
    }, [lead]); // Recompute this set only when the 'lead' array changes

    const interestedPersonIds = useMemo(() => {
        return new Set(lead.map(l => l.interested=== 'yes' ? l.eligible_person_id : null).filter(id => id !== null));
    }, [lead]); // Recompute this set only when the 'lead' array changes

    const notInterestedPersonIds = useMemo(() => {
        return new Set(lead.map(l => l.interested=== 'no' ? l.eligible_person_id : null).filter(id => id !== null));
    }, [lead]);

    const notDecidedPersonIds = useMemo(() => {
        return new Set(lead.map(l => l.interested=== 'not decided' ? l.eligible_person_id : null).filter(id => id !== null));
    }, [lead]);

  useEffect(() => {
    let updated = [...history];

    if (filters.contacted=== 'yes') {
    //   updated = updated.filter(item => item.contacted?.toLowerCase() === filters.interested.toLowerCase());
        updated = updated.filter(item => contactedPersonIds.has(item.id));
    }

    if (filters.contacted=== 'no') {
    //   updated = updated.filter(item => item.contacted?.toLowerCase() === filters.interested.toLowerCase());
        updated = updated.filter(item => !contactedPersonIds.has(item.id));
    }

    if (filters.interested === 'yes') {
      updated = updated.filter(item => interestedPersonIds.has(item.id));
    }

    if (filters.interested=== 'no') {
    //   updated = updated.filter(item => item.contacted?.toLowerCase() === filters.interested.toLowerCase());
        updated = updated.filter(item => notInterestedPersonIds.has(item.id));
    }

    if (filters.interested=== 'not decided') {
    //   updated = updated.filter(item => item.contacted?.toLowerCase() === filters.interested.toLowerCase());
        updated = updated.filter(item => notDecidedPersonIds.has(item.id));
    }


    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      updated = updated.filter(item =>
        item.personsName?.toLowerCase().includes(term) ||
        item.accountNumber?.toLowerCase().includes(term)
      );
    }

    setFilteredHistory(updated);
  }, [history, filters, searchTerm]);


  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      {/* <header className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <History className="w-8 h-8 text-indigo-400 mr-3" />
              <h1 className="text-2xl font-bold text-white">All Recommendations</h1>
            </div>
            <div className="text-sm text-gray-400">
              {history.length} total applications
            </div>
          </div>
        </div>
      </header> */}
      <header className="bg-gray-800 shadow-lg border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Modified Header div for responsiveness */}
                    <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-16 py-3 sm:py-0">
                    {/* Left side: Icon and Title */}
                        <div className="flex items-center justify-center mb-2 sm:mb-0"> {/* Added justify-center and margin for mobile */}
                            <History className="w-8 h-8 text-indigo-400 mr-3 flex-shrink-0" /> {/* flex-shrink-0 to prevent icon from shrinking */}
                            <h1 className="text-xl sm:text-2xl font-bold text-white text-start sm:text-left leading-tight min-w-0"> {/* Adjusted text size, added text-center, sm:text-left, leading-tight, and min-w-0 */}
                            All Recommendations
                            </h1>
                        </div>
                    {/* Right side: Total Applications count */}
                    <div className="text-sm text-gray-400 flex-shrink-0"> {/* flex-shrink-0 to prevent text from shrinking */}
                    {history.length} total applications
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
                onChange={(e) => setFilters(prev => ({ ...prev, contacted: e.target.value }))}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Contacted</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
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
            
            
          </div>
        </div>

        {/* DataTable Section */}
        <div className="flex gap-2">
          <RecommendationTable data={filteredHistory} lead={lead}/>
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

export default RecommendationHistoryPage;
