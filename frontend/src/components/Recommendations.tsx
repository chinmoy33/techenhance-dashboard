import { useState, useMemo, useEffect } from "react";
import { loanApplicants } from "../data/loanApplicants";
import { FilterOptions, LoanApplicant } from "../types/loan";
import { LoanApplicantCard } from "./recommendations/LoanApplicantCard.tsx";
import { FilterControls } from "./recommendations/FilterControls.tsx";
import { StatsOverview } from "./recommendations/StatsOverview.tsx";
import { Target, Sparkles } from "lucide-react";
import { dataService } from "../services/dataService";

function Recommendations() {
  const [loanApplicant, setLoanApplicant] =
    useState<LoanApplicant[]>(loanApplicants);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    loantype: "all",
    minSalary: 0,
    maxSalary: 999999,
    risklevel: "all",
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await dataService.getRecommendations();
      if (data) {
        console.log("Fetched recommendations:", data);
        setLoanApplicant(data);
      }
      // axios.get('http://localhost:5000/api/some-data') // change to your backend route
      //   .then(response => {
      //     console.log("Fetched data:", response.data);
      //   })
      //   .catch(error => {
      //     console.error("Error fetching data:", error);
      //   });
    };

    // Call immediately once on mount
    fetchData();

    // Set interval for every 2 minutes (120000 ms)
    const interval = setInterval(fetchData, 120000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  const filteredApplicants = useMemo(() => {
    console.log("Filtering loan applicants:", loanApplicant);
    return loanApplicant.filter((applicant) => {
      const matchesSearch =
        applicant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        applicant.email.toLowerCase().includes(filters.search.toLowerCase());

      const matchesLoanType =
        filters.loantype === "all" || applicant.loantype === filters.loantype;

      const matchesSalary =
        applicant.salary >= filters.minSalary &&
        applicant.salary <= filters.maxSalary;

      const matchesRiskLevel =
        filters.risklevel === "all" ||
        applicant.risklevel === filters.risklevel;

      return (
        matchesSearch && matchesLoanType && matchesSalary && matchesRiskLevel
      );
    });
  }, [filters, loanApplicant]);
  //   const filteredApplicants = useMemo(() => {
  //   return loanApplicants.filter(applicant => {
  //     const matchesSearch =
  //       applicant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
  //       applicant.email.toLowerCase().includes(filters.search.toLowerCase());

  //     const matchesLoanType = filters.loanType === 'all' || applicant.loanType === filters.loanType;

  //     const matchesSalary =
  //       applicant.salary >= filters.minSalary &&
  //       applicant.salary <= filters.maxSalary;

  //     const matchesRiskLevel = filters.riskLevel === 'all' || applicant.riskLevel === filters.riskLevel;

  //     const passes = matchesSearch && matchesLoanType && matchesSalary && matchesRiskLevel;
  //     if (!passes) {
  //       console.log("Excluded:", applicant.name, { matchesSearch, matchesLoanType, matchesSalary, matchesRiskLevel });
  //     }
  //     return passes;
  //   });
  // }, [filters, loanApplicants]);

  const sortedApplicants = useMemo(() => {
    return [...filteredApplicants].sort((a, b) => {
      // Sort by risk level (low risk first), then by credit score (highest first)
      const riskOrder = { low: 0, medium: 1, high: 2 };
      if (a.risklevel !== b.risklevel) {
        return riskOrder[a.risklevel] - riskOrder[b.risklevel];
      }
      return b.creditScore - a.creditScore;
    });
  }, [filteredApplicants]);
  // console.log("loan applicants:", loanApplicants); // how many fetched?
  //   console.log("Filtered Applicants:", filteredApplicants);      // how many left?
  // console.log("Sorted Applicants:", sortedApplicants);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              Loan Recommendations
            </h1>
            <div className="flex items-center gap-1 text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
          </div>
          <p className="text-slate-400 text-lg">
            Discover the most suitable loan candidates based on
            creditworthiness, income, and risk assessment.
          </p>
        </div>

        {/* Stats Overview */}
        <StatsOverview
          applicants={loanApplicant}
          filteredApplicants={filteredApplicants}
        />

        {/* Filter Controls */}
        <FilterControls filters={filters} onFiltersChange={setFilters} />

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Recommended Candidates ({sortedApplicants.length})
            </h2>
            {filters.search ||
            filters.loantype !== "all" ||
            filters.risklevel !== "all" ||
            filters.minSalary > 0 ||
            filters.maxSalary < 999999 ? (
              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    loantype: "all",
                    minSalary: 0,
                    maxSalary: 999999,
                    risklevel: "all",
                  })
                }
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        </div>

        {/* Applicant Cards */}
        {sortedApplicants.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedApplicants.map((applicant) => (
              <LoanApplicantCard key={applicant.id} applicant={applicant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No matches found
              </h3>
              <p className="text-slate-400">
                Try adjusting your search criteria or filters to find suitable
                loan candidates.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;
