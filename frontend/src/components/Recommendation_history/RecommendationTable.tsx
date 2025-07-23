// import React from 'react';
// import { RecommendationData } from '../../types/loan';
// import { LoanData } from '../../types/LoanData';
// import { Filter } from 'lucide-react';
// import ContactForm from '../recommendations/ContactForm';
// import { recommendationService } from '../../services/recommendationService.ts';
// import { toast } from 'react-hot-toast';
// import { useDispatch, useSelector } from 'react-redux';
// import { setHasClicked } from '../../store/leadSlice';
// import { RootState } from '../../store';
// import {useTransformLead} from '../../hooks/useTransformData.ts';
// import { useEffect,useState } from 'react';

// interface DataTableProps {
//   data: RecommendationData[];
// }

// const RecommendationTable: React.FC<DataTableProps> = ({ data }) => {
//     const dispatch = useDispatch();
//     const hasClicked = useSelector((state: RootState) => state.lead.hasClicked);

//     const [showForm, setShowForm] = useState(false);
//     const [lead, setLead] = useState<LoanData[]>([]);
//     const [applicantId, setApplicantId] = useState<number>(0);
//     const handleFilterClick=()=>{
//         dispatch(setHasClicked(!hasClicked));
//       }

//     const handleShowForm = (id: number) => {
//         setShowForm(true);
//         setApplicantId(id);
//     }

//     useEffect(() => {
//         const fetchData = async () => {
//           const data = await recommendationService.getLeads();
//           //console.log(data[0].eligible_mutualfunds_clients);
//           const transformedData = useTransformLead(data);
//           console.log(data[0].eligible_mutualfunds_clients);
//           console.log("Fetched Leads:", transformedData);
//           if (data) {
//             console.log("inside fetchData");
//             setLead(transformedData);
//           }
//         };
    
//         // Call immediately once on mount
//         fetchData();
    
//       }, [])
//   return (
//   <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
//   <div className="px-6 py-4 bg-gray-700 border-b border-gray-600 flex items-center justify-between">
//     <div className="flex flex-col"> {/* New div to group title and description */}
//         <h2 className="text-xl font-semibold text-white">All Recommended Applicants Data</h2>
//         <p className="text-gray-300 text-sm mt-1">Complete dataset overview</p>
//     </div>
//     {/* Filter button - now on the far right due to justify-between on parent */}
//     <button
//         onClick={handleFilterClick}
//         className="p-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" // Added styling for clickability
//         title="Go to Lead tracking page"
//     >
//         <Filter className="w-5 h-5 text-gray-300 cursor-pointer hover:text-blue-400" />
//     </button>
//   </div>
//   {showForm && (
//         <ContactForm
//           onSubmit={async(formData) => {
//             console.log('Form Data Submitted:', formData);
//             // TODO: POST to Supabase here
//             try{
//               const {success,message}=await recommendationService.updateLeads(applicantId,formData);
//               if(success)
//               {
//                 toast.success(message);
//               }
//               else
//               {
//                 toast.error(message)
//               }
              
//             }
//             catch(error)
//             {
//               console.error("error occured while updating Leads!");
//             }
//             finally{
//                setShowForm(false);
//             }
           
//           }}
//           onCancel={() => setShowForm(false)}
//         />
//       )}
  
    
//   {/* Table Wrapper */}
//   <div className="overflow-x-auto">
//     {/* Fixed-height scrollable section */}
//     <div className="max-h-[800px] overflow-y-auto">
//       <table className="w-full">
//         <thead className="bg-gray-700 sticky top-0 z-10">
            
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"></th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Account Number</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone Number</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date of birth</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Education</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Loans</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mutual Funds or Investments</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Employment Type</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Income</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bank Branch Name</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Marital Status</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email Address</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Account Type</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Online banking enabled</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SMS banking enabled</th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Eligible</th>
//           </tr>
//         </thead>
//         <tbody className="bg-gray-800 divide-y divide-gray-700">
//           {data.map((item, index) => (
//             <tr key={index} className="hover:bg-gray-700 transition-colors duration-200">
//             <td className="px-6 py-4 whitespace-nowrap text-sm">
//                 <button
//                     className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm"
//                     onClick={() => handleShowForm(item.id)} // This setShowForm is local, might not affect outer form
//                 >
//                     Mark as Contacted
//                 </button>
//             </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.personsName}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.accountNumber}
//               </td>
//                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.phoneNumber}
//               </td>
//                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.age}
//               </td>
//                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.dateOfBirth}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.education}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.loans}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.mutualFundsOrInvestments}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.employmentType}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.income}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.bankBranchName}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.maritalStatus}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.emailAddress}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.accountType}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.onlineBankingEnabled}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.smsBankingEnabled}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                 {item.eligible}
//               </td>
              
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// </div>

//   );
// };

// export default RecommendationTable;
import React from 'react';
import { RecommendationData } from '../../types/loan';
import { LoanData } from '../../types/LoanData'; // Make sure LoanData has eligible_person_id
import { Filter } from 'lucide-react';
import ContactForm from '../recommendations/ContactForm';
import { recommendationService } from '../../services/recommendationService.ts';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setHasClicked } from '../../store/leadSlice';
import { RootState } from '../../store';
import { useTransformLead } from '../../hooks/useTransformData.ts'; // Corrected import
import { useEffect, useState, useMemo } from 'react'; // Added useMemo
import {toggleContactForm} from '../../store/uiSlice.ts';

interface DataTableProps {
    data: RecommendationData[];
    lead: LoanData[];
}

const RecommendationTable: React.FC<DataTableProps> = ({ data , lead }) => {
    const dispatch = useDispatch();
    const hasClicked = useSelector((state: RootState) => state.lead.hasClicked);
    const showContactForm = useSelector((state: RootState) => state.ui.showContactForm);

    //const [showForm, setShowForm] = useState(false);
    //const [lead, setLead] = useState<LoanData[]>(leadData); // This will hold your fetched leads
    const [applicantId, setApplicantId] = useState<number>(0);

    const handleFilterClick = () => {
        dispatch(setHasClicked(!hasClicked));
    }

    const handleShowForm = (id: number) => {
        dispatch(toggleContactForm());
        setApplicantId(id);
    }

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const fetchedLeads = await recommendationService.getLeads();
    //             const transformedLeads = useTransformLead(fetchedLeads); 
    //             console.log("Fetched Leads (raw):", fetchedLeads);
    //             console.log("Transformed Leads:", transformedLeads);

    //             if (transformedLeads) { // Check if transformation was successful
    //                 setLead(transformedLeads);
    //             } else {
    //                 console.warn("useTransformLead did not return valid data.");
    //             }
    //         } catch (error) {
    //             console.error("Error fetching leads:", error);
    //             toast.error("Failed to load lead data.");
    //         }
    //     };

    //     fetchData();
    //     // You might want to refetch leads if `hasClicked` changes, or based on other dependencies.
    //     // For now, it fetches only on mount.
    // }, [showContactForm]); // Added showForm to dependencies to refetch when form is shown

    

    // Memoize the set of contacted IDs for efficient lookup
    // This creates a Set of all eligible_person_id values from your 'lead' state.
    // Set lookups are much faster (O(1) on average) than array lookups (O(n)).
    const contactedPersonIds = useMemo(() => {
        return new Set(lead.map(l => l.eligible_person_id));
    }, [lead]); // Recompute this set only when the 'lead' array changes

    return (
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            <div className="px-6 py-4 bg-gray-700 border-b border-gray-600 flex items-center justify-between">
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-white">All Recommended Applicants Data</h2>
                    <p className="text-gray-300 text-sm mt-1">Complete dataset overview</p>
                </div>
                <button
                    onClick={handleFilterClick}
                    className="p-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Go to Lead tracking page"
                >
                    <Filter className="w-5 h-5 text-gray-300 cursor-pointer hover:text-blue-400" />
                </button>
            </div>
            {showContactForm && (
                <ContactForm
                    onSubmit={async (formData) => {
                        console.log('Form Data Submitted:', formData);
                        try {
                            const { success, message } = await recommendationService.updateLeads(applicantId, formData);
                            if (success) {
                                toast.success(message);
                                // After successful update, you might want to refetch leads to update the button color
                                // or optimistically update the 'lead' state.
                                // For simplicity, let's suggest a refetch for now if the button needs to reflect changes immediately.
                                // This could involve dispatching an action or calling fetchData again.
                                // If applicantId is the eligible_person_id, you can directly add it to a local set.
                                // This depends on if updateLeads is marking it as "contacted".
                                // For now, the `useEffect` will only run on mount, so it won't update dynamically.
                                // A quick fix would be to re-run `fetchData()` here.
                                // await fetchData(); // You might need to make fetchData available outside useEffect or wrap it in useCallback.
                                // For now, let's assume the button state needs to refresh on page load or explicit refresh.
                            } else {
                                toast.error(message);
                            }
                        } catch (error) {
                            console.error("error occurred while updating Leads!", error);
                            toast.error("Failed to update lead.");
                        } finally {
                            dispatch(toggleContactForm());
                        }
                    }}
                    onCancel={() => dispatch(toggleContactForm())} // Use dispatch to toggle the form visibility
                />
            )}

            <div className="overflow-x-auto">
                <div className="max-h-[800px] overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th> {/* Added a header for the button column */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                                {/* ... other headers ... */}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Account Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date of birth</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Education</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Loans</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Mutual Funds or Investments</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Employment Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Income</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Bank Branch Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Marital Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Account Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Online banking enabled</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">SMS banking enabled</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Eligible</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {data.map((item, index) => {
                                // Determine if the current item's ID is in the contactedPersonIds set
                                const isContacted = contactedPersonIds.has(item.id);

                                // Conditionally set button classes
                                const buttonClasses = `px-3 py-1 text-white rounded-md text-sm ${
                                    isContacted
                                        ? "bg-green-600 hover:bg-green-700" // Greener for contacted,
                                        : "bg-indigo-600 hover:bg-indigo-700" // Original for not contacted
                                }`;

                                return (
                                    <tr key={index} className="hover:bg-gray-700 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                className={buttonClasses}
                                                onClick={() => handleShowForm(item.id)}
                                                title={isContacted ? "change contact status" : "Mark as Contacted"}
                                            >
                                                {isContacted ? "Contacted" : "Mark as Contacted"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.personsName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.accountNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.phoneNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.age}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.dateOfBirth}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.education}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.loans}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.mutualFundsOrInvestments}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.employmentType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.income}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.bankBranchName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.maritalStatus}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.emailAddress}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.accountType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.onlineBankingEnabled}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.smsBankingEnabled}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            {item.eligible}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RecommendationTable;