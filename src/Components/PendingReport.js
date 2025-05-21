// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { FaEye, FaSpinner, FaClock, FaExclamationCircle } from 'react-icons/fa';
// import { useUser } from '../UserContext';
// import ProtocolHistory from './ProtocolHistory';

// const PendingReport = () => {
//   const { user } = useUser();
//   const apiUrl   = (process.env.REACT_APP_API_URL || 'http://localhost:5001').trim();

//   const [reports, setReports]             = useState([]);
//   const [loading, setLoading]             = useState(false);
//   const [error, setError]                 = useState(null);
//   const [selectedPdf, setSelectedPdf]     = useState(null);
//   const [pdfUrls, setPdfUrls]             = useState({});
//   const [loadingPdfIds, setLoadingPdfIds] = useState({});
//   const [showHistoryFor, setShowHistoryFor]     = useState(null);

//   const [showRejectModal, setShowRejectModal]   = useState(false);
//   const [rejectComment, setRejectComment]       = useState('');
//   const [currentReportId, setCurrentReportId]   = useState(null);
//   const [currentReport, setCurrentReport]       = useState(null);
//   const [actionLoading, setActionLoading]       = useState(false);

//   const fetchPendingReports = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res  = await fetch(`${apiUrl}/api/get-all-report-pdfs`);
//       if (!res.ok) throw new Error('Failed to fetch PDF reports');
//       const data = await res.json();
//       const pending = data.filter(r => r.status === 'pending');
//       console.log('Pending reports:', pending);
//       setReports(pending);
//     } catch (err) {
//       console.error('Error fetching reports:', err);
//       setError(err.message || 'Failed to fetch reports. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }, [apiUrl]);

//   useEffect(() => {
//     fetchPendingReports();
//   }, [fetchPendingReports]);

//   const formatDate = dateString => {
//     const opts = { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' };
//     return new Date(dateString).toLocaleDateString('en-US', opts);
//   };

//   const toggleViewReport = async report => {
//     if (selectedPdf === report.id) {
//       setSelectedPdf(null);
//       return;
//     }
//     setSelectedPdf(report.id);
//     if (pdfUrls[report.id]) return;

//     try {
//       setLoadingPdfIds(ids => ({ ...ids, [report.id]: true }));
//       const res = await fetch(`${apiUrl}/api/reports/${report.registration_id}/pdf`);
//       if (!res.ok) throw new Error(`HTTP ${res.status}`);
//       const blob = await res.blob();
//       const url  = URL.createObjectURL(blob);
//       setPdfUrls(urls => ({ ...urls, [report.id]: url }));
//     } catch (err) {
//       console.error('Error loading PDF:', err);
//       alert('Failed to load report PDF.');
//     } finally {
//       setLoadingPdfIds(ids => ({ ...ids, [report.id]: false }));
//     }
//   };

//   // const handleAccept = async reportId => {
//   //   const report = reports.find(r => r.id === reportId);
//   //   if (!report) return alert('Report not found');

//   //   try {
//   //     setActionLoading(true);

//   //     // 1) Lookup the real assignment_id for this student + course
//   //     // const lookupRes = await axios.get(
//   //     //   `${apiUrl}/api/assignment-for-student/${report.registration_id}/course/${report.course_id}`
//   //     // );
//   //     // const assignmentId = lookupRes.data.assignment_id;

//   //     // 2) Update assignment_courses → completed
//   //     try {
//   //       await axios.patch(
//   //         `${apiUrl}/api/assignment_courses/status`,
//   //         {
//   //           assignment_id: report.assignment_id,
//   //           course_id:     report.course_id,
//   //           status:        'completed'
//   //         }
//   //       );
//   //       // …
//   //     } catch (err) {
//   //       console.error('Patch error payload:', {
//   //         body: {
//   //           assignment_id: report.assignment_id,
//   //           course_id:     report.course_id,
//   //           status:        'completed'
//   //         }
//   //       });
//   //       console.error('Server said:', err.response?.data);
//   //       alert(`Failed to accept report: ${err.response?.data?.message || err.message}`);
//   //     }
      

//   //     // 3) Record the report-action
//   //     await axios.post(`${apiUrl}/api/report-action`, {
//   //       reportId,
//   //       studentUsername: report.username?.toLowerCase().replace(/\s+/g, '_'),
//   //       teacherUsername: user?.username,
//   //       action:          'accepted',
//   //       status:          'approved'
//   //     });

//   //     alert('Report accepted successfully!');
//   //     fetchPendingReports();
//   //     setSelectedPdf(null);
//   //   } catch (err) {
//   //     console.error('Error accepting report:', err);
//   //     alert(`Failed to accept report: ${err.message}`);
//   //     setSelectedPdf(null);
//   //   } finally {
//   //     setActionLoading(false);
//   //   }
//   // };

//   // const handleAccept = async reportId => {
//   //   const report = reports.find(r => r.id === reportId);
//   //   if (!report) return alert('Report not found');
  
//   //   try {
//   //     setActionLoading(true);
  
//   //     // assignment_id comes straight from the report object
//   //     const assignmentId = report.assignment_id;
//   //     const courseId     = report.course_id;
  
//   //     if (!assignmentId || !courseId) {
//   //       throw new Error('Missing assignment or course ID');
//   //     }
  
//   //     // 2) Mark that assignment completed via POST instead of PATCH
//   //     await axios.post(
//   //       `${apiUrl}/api/assignment_courses/status`,
//   //       {
//   //         assignment_id: assignmentId,
//   //         course_id:     courseId,
//   //         status:        'completed'
//   //       }
//   //     );
  
//   //     // 3) Log the report-action
//   //     await axios.post(`${apiUrl}/api/report-action`, {
//   //       reportId,
//   //       studentUsername: report.username?.toLowerCase().replace(/\s+/g, '_'),
//   //       teacherUsername: user?.username,
//   //       action:          'accepted',
//   //       status:          'approved'
//   //     });
  
//   //     alert('Report accepted successfully!');
//   //     fetchPendingReports();
//   //     setSelectedPdf(null);
//   //   } catch (err) {
//   //     console.error('Error accepting report:', err);
//   //     alert(`Failed to accept report: ${err.response?.data?.error || err.message}`);
//   //     setSelectedPdf(null);
//   //   } finally {
//   //     setActionLoading(false);
//   //   }
//   // };
  
//   const handleAccept = async reportId => {
//     const report = reports.find(r => r.id === reportId);
//     if (!report) {
//       return alert('Report not found');
//     }
  
//     try {
//       setActionLoading(true);
  
//       // POST to the simplified endpoint:
//       await axios.post(
//         `${apiUrl}/api/assignment-courses/` +
//         `${report.assignment_id}/${report.course_id}/status`,
//         { status: 'completed' }
//       );
  
//       // Log the approval action
//       await axios.post(
//         `${apiUrl}/api/report-action`,
//         {
//           reportId,
//           studentUsername: report.username?.toLowerCase().replace(/\s+/g, '_'),
//           teacherUsername: user.username,
//           action: 'accepted',
//           status: 'approved'
//         }
//       );
  
//       alert('Report accepted!');
//       fetchPendingReports();
//       setSelectedPdf(null);
//     } catch (err) {
//       console.error('Error accepting report:', err.response?.data || err.message);
//       alert(`Failed to accept report: ${err.response?.data?.error || err.message}`);
//       setSelectedPdf(null);
//     } finally {
//       setActionLoading(false);
//     }
//   };
  

//   const openRejectModal = reportId => {
//     const report = reports.find(r => r.id === reportId);
//     setCurrentReportId(reportId);
//     setCurrentReport(report);
//     setRejectComment('');
//     setShowRejectModal(true);
//   };

//   const handleReject = async () => {
//     if (!rejectComment.trim()) {
//       return alert('Please provide a reason for rejection');
//     }
//     try {
//       setActionLoading(true);
//       // Only log the rejection; do NOT change assignment_courses here
//       await axios.post(`${apiUrl}/api/report-action`, {
//         reportId:        currentReportId,
//         studentUsername: currentReport.username?.toLowerCase().replace(/\s+/g, '_'),
//         teacherUsername: user?.username,
//         action:          'rejected',
//         status:          'rejected',
//         comment:         rejectComment
//       });
//       alert('Report rejected with comment!');
//       setShowRejectModal(false);
//       fetchPendingReports();
//       setSelectedPdf(null);
//     } catch (err) {
//       console.error('Error rejecting report:', err);
//       alert(`Failed to reject report: ${err.message}`);
//       setSelectedPdf(null);
//     } finally {
//       setActionLoading(false);
//     }
//   };


//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
//             <h2 className="text-3xl font-bold text-white text-center">
//               Pending Reports
//             </h2>
//           </div>
//           <div className="p-6">
//             {loading ? (
//               <div className="flex justify-center items-center py-12">
//                 <FaSpinner className="animate-spin text-4xl text-blue-600" />
//               </div>
//             ) : error ? (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
//                 <strong>Error:</strong> {error}
//               </div>
//             ) : reports.length > 0 ? (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full bg-white border border-gray-200">
//                   <thead>
//                     <tr className="bg-gray-50 border-b">
//                       <th className="py-3 px-4 text-left uppercase font-semibold text-sm">S.No</th>
//                       <th className="py-3 px-4 text-left uppercase font-semibold text-sm">Date</th>
//                       <th className="py-3 px-4 text-left uppercase font-semibold text-sm">Student Name</th>
//                       <th className="py-3 px-4 text-left uppercase font-semibold text-sm">Patient ID</th>
//                       <th className="py-3 px-4 text-center uppercase font-semibold text-sm">Timing</th>
//                       <th className="py-3 px-4 text-center uppercase font-semibold text-sm">View Report</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {reports.map((report, i) => (
//                       <React.Fragment key={report.id}>
//                         <tr className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                           <td className="py-3 px-4">{i+1}</td>
//                           <td className="py-3 px-4">{formatDate(report.reported_at)}</td>
//                           <td className="py-3 px-4">{report.username || 'Unknown'}</td>
//                           <td className="py-3 px-4">{report.registration_id}</td>
//                           <td className="py-3 px-4 text-center">
//                             <button
//                               onClick={()=>setShowHistoryFor(report.registration_id)}
//                               className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 transition mx-auto"
//                             >
//                               <FaClock /> View Timings
//                             </button>
//                           </td>
//                           <td className="py-3 px-4 text-center">
//                             <button
//                               onClick={()=>toggleViewReport(report)}
//                               className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition mx-auto"
//                             >
//                               <FaEye /> View Report
//                             </button>
//                           </td>
//                         </tr>

//                         {selectedPdf === report.id && (
//                           <tr>
//                             <td colSpan="6" className="border-t border-gray-200 p-4">
//                               {loadingPdfIds[report.id] ? (
//                                 <div className="flex justify-center py-12">
//                                   <FaSpinner className="animate-spin text-4xl text-blue-600" />
//                                 </div>
//                               ) : (
//                                 <>
//                                   <iframe
//                                     src={pdfUrls[report.id]}
//                                     className="w-full h-[500px] mb-6 border border-gray-200 rounded"
//                                     title={`PDF Report ${report.id}`}
//                                   />

//                                   <div className="flex justify-center items-center gap-4 mt-4">
//                                     {actionLoading ? (
//                                       <FaSpinner className="animate-spin text-2xl text-blue-600" />
//                                     ) : (
//                                       <>
//                                         <button
//                                           onClick={() => handleAccept(report.id)}
//                                           className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
//                                         >
//                                           Accept
//                                         </button>
//                                         <button
//                                           onClick={() => openRejectModal(report.id)}
//                                           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
//                                         >
//                                           Reject with Comment
//                                         </button>
//                                       </>
//                                     )}
//                                   </div>
//                                 </>
//                               )}
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <h2 className="text-xl font-semibold text-gray-600">
//                   No pending reports found
//                 </h2>
//                 <p className="text-gray-500">
//                   There are no pending reports to review at this time
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Reject Modal */}
//       {showRejectModal && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
//             <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 flex justify-between items-center">
//               <h3 className="text-xl font-bold text-white flex items-center gap-2">
//                 <FaExclamationCircle className="text-blue-100" />
//                 Reject Report
//               </h3>
//               <button
//                 onClick={() => setShowRejectModal(false)}
//                 className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="p-6">
//               <label className="block text-gray-700 text-sm font-semibold mb-2">
//                 Reason for Rejection
//               </label>
//               <textarea
//                 className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
//                 rows="4"
//                 value={rejectComment}
//                 onChange={e => setRejectComment(e.target.value)}
//                 placeholder="Provide detailed feedback..."
//               />
//               <div className="mt-4 flex justify-end space-x-4">
//                 <button
//                   onClick={() => setShowRejectModal(false)}
//                   className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleReject}
//                   disabled={actionLoading}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center disabled:opacity-70"
//                 >
//                   {actionLoading ? (
//                     <FaSpinner className="animate-spin mr-2" />
//                   ) : (
//                     'Reject Report'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* History Modal */}
//       {showHistoryFor && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
//             <button
//               className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
//               onClick={() => setShowHistoryFor(null)}
//             >
//               ✕
//             </button>
//             <ProtocolHistory registrationId={showHistoryFor} />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PendingReport;
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaEye, FaSpinner, FaClock, FaExclamationCircle, FaFilter, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { useUser } from '../UserContext';
import ProtocolHistory from './ProtocolHistory';

const PendingReport = () => {
  const { user } = useUser();
  const apiUrl = (process.env.REACT_APP_API_URL || 'http://localhost:5001').trim();
  const [reports, setReports]             = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [selectedPdf, setSelectedPdf]     = useState(null);
  const [pdfUrls, setPdfUrls]             = useState({});      
  const [loadingPdfIds, setLoadingPdfIds] = useState({});   
  const [showHistoryFor, setShowHistoryFor] = useState(null);  

  
  const [nameFilter, setNameFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [isDateRangeMode, setIsDateRangeMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [showRejectModal, setShowRejectModal]   = useState(false);
  const [rejectComment, setRejectComment]       = useState('');
  const [currentReportId, setCurrentReportId]   = useState(null);
  const [currentReport, setCurrentReport]       = useState(null);
  const [actionLoading, setActionLoading]       = useState(false);

  const username = user?.username;
  
  const fetchPendingReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/api/get-all-report-pdfs`);
      if (!response.ok) throw new Error('Failed to fetch PDF reports');
      const data = await response.json();
      console.log('API Response:', data);
      
      const pendingReports = data.filter(r => r.status === 'pending' && r.teacher_username === username);
      console.log('Pending Reports:', pendingReports);
      setReports(pendingReports);
      setFilteredReports(pendingReports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err.message || 'Failed to fetch reports. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [apiUrl, user]);

  useEffect(() => {       
    fetchPendingReports();
  }, [fetchPendingReports]);

  
  useEffect(() => {
    applyFilters();
  }, [nameFilter, dateFilter, startDateFilter, endDateFilter, isDateRangeMode, reports]);

  const applyFilters = () => {
    let filtered = [...reports];
    
    // Apply name filter
    if (nameFilter.trim()) {
      filtered = filtered.filter(report => 
        report.username && report.username.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    
    // Apply date filter based on mode
    if (isDateRangeMode) {
      // Date range filter mode
      if (startDateFilter) {
        const startDate = new Date(startDateFilter);
        startDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(report => {
          const reportDate = new Date(report.reported_at);
          return reportDate >= startDate;
        });
      }
      
      if (endDateFilter) {
        const endDate = new Date(endDateFilter);
        endDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(report => {
          const reportDate = new Date(report.reported_at);
          return reportDate <= endDate;
        });
      }
    } else {
      // Single date filter mode
      if (dateFilter) {
        const filterDate = new Date(dateFilter);
        filtered = filtered.filter(report => {
          const reportDate = new Date(report.reported_at);
          return reportDate.toDateString() === filterDate.toDateString();
        });
      }
    }
    
    setFilteredReports(filtered);
  };

  const resetFilters = () => {
    setNameFilter('');
    setDateFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setFilteredReports(reports);
  };

  const toggleDateFilterMode = () => {
    setIsDateRangeMode(!isDateRangeMode);
    setDateFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const toggleViewReport = async (report) => {
    if (selectedPdf === report.id) {
      setSelectedPdf(null);
      return;
    }

    setSelectedPdf(report.id);

    if (pdfUrls[report.id]) {
      return;
    }

    try {
      setLoadingPdfIds(ids => ({ ...ids, [report.id]: true }));
      const res = await fetch(`${apiUrl}/api/reports/${report.registration_id}/pdf`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      setPdfUrls(urls => ({ ...urls, [report.id]: url }));
    } catch (err) {
      console.error('Error loading PDF:', err);
      alert('Failed to load report PDF.');
    } finally {
      setLoadingPdfIds(ids => ({ ...ids, [report.id]: false }));
    }
  };

  const handleAccept = async (reportId) => {
    try {
      setActionLoading(true);
      const report = reports.find(r => r.id === reportId);
      if (!report) throw new Error('Report not found');

      const acceptData = {
        reportId,
        studentUsername: report.username?.toLowerCase().replace(/\s+/g, '_'),
        teacherUsername: user?.username,
        action: 'accepted',
        status: 'approved'
      };
      console.log(acceptData);

      const response = await axios.post(`${apiUrl}/api/report-action`, acceptData);
      if (response.status === 200 || response.status === 201) {
        alert('Report accepted successfully!');
        fetchPendingReports();
        setSelectedPdf(null);
      } else {
        throw new Error('Failed to accept report');
      }
    } catch (err) {
      console.error('Error accepting report:', err);
      alert(`Failed to accept report: ${err.message}`);
      setSelectedPdf(null);
    } finally {
      setActionLoading(false);
    }
  };

  const openRejectModal = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    setCurrentReportId(reportId);
    setCurrentReport(report);
    setRejectComment('');
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (!rejectComment.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }
    try {
      setActionLoading(true);

      const rejectData = {
        reportId: currentReportId,
        studentUsername: currentReport.username?.toLowerCase().replace(/\s+/g, '_'),
        teacherUsername: user?.username,
        action: 'rejected',
        status: 'rejected',
        comment: rejectComment
      };
      const response = await axios.post(`${apiUrl}/api/report-action`, rejectData);
      if (response.status === 200 || response.status === 201) {
        alert('Report rejected with comment!');
        setShowRejectModal(false);
        fetchPendingReports();
        setSelectedPdf(null);
      } else {
        throw new Error('Failed to reject report');
      }
    } catch (err) {
      console.error('Error rejecting report:', err);
      alert(`Failed to reject report: ${err.message}`);
      setSelectedPdf(null);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <h2 className="text-3xl font-bold text-white text-center">
              Pending Reports
            </h2>
          </div>
          
          
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
              >
                <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              {reports.length > 0 && (
                <div className="text-gray-600">
                  <span className="font-medium">{filteredReports.length}</span> of {reports.length} reports displayed
                </div>
              )}
            </div>
            
            {showFilters && (
              <div className="mt-4 space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Filter by student name"
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                {/* Date Filter Toggle */}
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-gray-700 font-medium">Date Filter:</span>
                  <div className="flex items-center bg-gray-200 p-1 rounded-lg">
                    <button
                      onClick={() => setIsDateRangeMode(false)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        !isDateRangeMode 
                          ? 'bg-white shadow text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Single Date
                    </button>
                    <button
                      onClick={() => setIsDateRangeMode(true)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        isDateRangeMode 
                          ? 'bg-white shadow text-blue-600' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Date Range
                    </button>
                  </div>
                </div>
                
                
                <div className={`grid grid-cols-1 ${isDateRangeMode ? 'md:grid-cols-2' : 'md:grid-cols-1'} gap-4`}>
                  {isDateRangeMode ? (
                    <>
                      {/* Date range filter */}
                      <div className="relative">
                        <div className="absolute left-0 top-1/2 -translate-y-[18px] pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          placeholder="Start Date"
                          value={startDateFilter}
                          onChange={(e) => setStartDateFilter(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="text-xs text-gray-500 mt-1 ml-1">
                          From
                        </div>
                      </div>
                      <div className="relative">
                        <div className="absolute left-0 top-1/2 -translate-y-[18px] pl-3 flex items-center pointer-events-none">
                          <FaCalendarAlt className="text-gray-400" />
                        </div>
                        <input
                          type="date"
                          placeholder="End Date"
                          value={endDateFilter}
                          onChange={(e) => setEndDateFilter(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="text-xs text-gray-500 mt-1 ml-1">
                          To
                        </div>
                      </div>
                    </>
                  ) : (
                    
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendarAlt className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={resetFilters}
                    className="py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                <strong>Error:</strong> {error}
              </div>
            ) : filteredReports.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left uppercase font-semibold text-sm">S.No</th>
                      <th className="py-3 px-4 text-left uppercase font-semibold text-sm">Date</th>
                      <th className="py-3 px-4 text-left uppercase font-semibold text-sm">Student Name</th>
                      <th className="py-3 px-4 text-left uppercase font-semibold text-sm">Patient ID</th>
                      <th className="py-3 px-4 text-center uppercase font-semibold text-sm">Timing</th>
                      <th className="py-3 px-4 text-center uppercase font-semibold text-sm">View Report</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report, index) => (
                      <React.Fragment key={report.id}>
                        <tr className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4">{formatDate(report.reported_at)}</td>
                          <td className="py-3 px-4">{report.username || 'Unknown'}</td>
                          <td className="py-3 px-4">{report.registration_id}</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => setShowHistoryFor(report.registration_id)}
                              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 transition mx-auto"
                            >
                              <FaClock /> View Timings
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => toggleViewReport(report)}
                              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition mx-auto"
                            >
                              <FaEye /> View Report
                            </button>
                          </td>
                        </tr>

                        {selectedPdf === report.id && (
                          <tr>
                            <td colSpan="6" className="border-t border-gray-200 p-4">
                              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4 flex items-center">
                                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                                  <FaClock className="text-yellow-600 h-5 w-5" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-yellow-800">
                                    Report Pending Review
                                  </h3>
                                  <p className="text-sm text-yellow-700">
                                    Submitted on {formatDate(report.reported_at)}
                                  </p>
                                </div>
                              </div>

                              {loadingPdfIds[report.id] ? (
                                <div className="flex justify-center py-12">
                                  <FaSpinner className="animate-spin text-4xl text-blue-600" />
                                </div>
                              ) : pdfUrls[report.id] ? (
                                <div>
                                  <iframe
                                    src={pdfUrls[report.id]}
                                    className="w-full h-[500px] mb-6 border border-gray-200 rounded"
                                    title={`PDF Report ${report.id}`}
                                  />
                                  <div className="flex justify-center items-center gap-4 mt-4">
                                    {actionLoading ? (
                                      <FaSpinner className="animate-spin text-2xl text-blue-600" />
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => handleAccept(report.id)}
                                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                        >
                                          Accept
                                        </button>
                                        <button
                                          onClick={() => openRejectModal(report.id)}
                                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                        >
                                          Reject with Comment
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-center py-12">
                                  <FaSpinner className="animate-spin text-4xl text-blue-600" />
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-600">
                  {reports.length > 0 ? 'No matching reports found' : 'No pending reports found'}
                </h2>
                <p className="text-gray-500">
                  {reports.length > 0 
                    ? 'Try adjusting your filters to see more results' 
                    : 'There are no pending reports to review at this time'}
                </p>
                {reports.length > 0 && nameFilter === '' && dateFilter === '' && startDateFilter === '' && endDateFilter === '' && (
                  <button
                    onClick={resetFilters}
                    className="mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition"
                  >
                    Show All Reports
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FaExclamationCircle className="text-blue-100" />
                  Reject Report
                </h3>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Reason for Rejection
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                  rows="4"
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  placeholder="Provide detailed feedback on why the report is being rejected..."
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-6 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-all duration-200 shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium flex items-center transition-all duration-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Reject Report'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* History Modal */}
      {showHistoryFor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
            <button
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800"
              onClick={() => setShowHistoryFor(null)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <ProtocolHistory registrationId={showHistoryFor} />
          </div>
        </div>
      )}

    </div>
  );
};

export default PendingReport;