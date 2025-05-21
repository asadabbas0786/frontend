// // import React, { useEffect, useState, useRef } from "react";
// // import html2canvas from "html2canvas";
// // import jsPDF from "jspdf";
// // import ctscan from "../../Assest/00000269.jpg";
// // import onesimlogo from "../../Assest/logo192.jpg";
// // import { useNavigate, useParams, useLocation } from "react-router-dom";
// // import { useUser } from "../../UserContext";

// // const Report = () => {
// //   const reportRef = useRef();
// //   const buttonRef = useRef();
// //   const { topicId, courseId } = useParams();
// //   const navigate = useNavigate();
// //   const location = useLocation();
// //   const registrationId = location.state?.registration_id || "";
// //   const previousReportId = location.state?.reportId;
// //   const assignmentId = location.state?.assignmentId;

// //   useEffect(() => {
// //     console.log('🚀 Passed previousReportId:', previousReportId);
// //   }, [previousReportId]);

// //   console.log('Assignment ID:', assignmentId);

// //   const { user } = useUser();

// //   const [analysisData, setAnalysisData] = useState(null);
// //   const [registrationData, setRegistrationData] = useState(null);
// //   const [loadingAnalysis, setLoadingAnalysis] = useState(true);
// //   const [loadingRegistration, setLoadingRegistration] = useState(true);
// //   const [isSaving, setIsSaving] = useState(false);

// //   // Fetch analysis data
// //   useEffect(() => {
// //     if (!registrationId) return;
// //     fetch(`${process.env.REACT_APP_API_URL}/api/image-analysis/${registrationId}`)
// //       .then((res) => {
// //         if (!res.ok) throw new Error("Failed to fetch image analysis data");
// //         return res.json();
// //       })
// //       .then(setAnalysisData)
// //       .catch(console.error)
// //       .finally(() => setLoadingAnalysis(false));
// //   }, [registrationId]);

// //   // Fetch registration data
// //   useEffect(() => {
// //     if (!registrationId) return;
// //     fetch(`${process.env.REACT_APP_API_URL}/api/patient-registration/${registrationId}`)
// //       .then((res) => {
// //         if (!res.ok) throw new Error("Failed to fetch patient registration data");
// //         return res.json();
// //       })
// //       .then(setRegistrationData)
// //       .catch(console.error)
// //       .finally(() => setLoadingRegistration(false));
// //   }, [registrationId]);

// //   // Download PDF locally
// //   const handleDownloadPDF = () => {
// //     if (buttonRef.current) buttonRef.current.style.display = "none";
// //     html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: "#fff" })
// //       .then((canvas) => {
// //         const img = canvas.toDataURL("image/png");
// //         const pdf = new jsPDF("p", "mm", "a4");
// //         const pdfWidth = 210;
// //         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
// //         pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
// //         const filename = `CT_Scan_Report_${user?.username || "UnknownUser"}.pdf`;
// //         pdf.save(filename);
// //       })
// //       .catch(console.error)
// //       .finally(() => {
// //         if (buttonRef.current) buttonRef.current.style.display = "block";
// //       });
// //   };

// //   // Print
// //   const handlePrint = () => {
// //     const printHTML = reportRef.current.innerHTML;
// //     const original = document.body.innerHTML;
// //     document.body.innerHTML = printHTML;
// //     window.print();
// //     document.body.innerHTML = original;
// //     window.location.reload();
// //   };

// //   // Save & Next using JSON payload (includes topic_id & course_id)
// //   const handleNext = async () => {
// //     setIsSaving(true);
// //     try {
// //       // 1) Render at high resolution
// //       const canvas = await html2canvas(reportRef.current, {
// //         scale: 2,
// //         useCORS: true,
// //         backgroundColor: "#fff",
// //       });

// //       // 2) Create PDF and get a Data URI string
// //       const img = canvas.toDataURL("image/png");
// //       const pdf = new jsPDF("p", "mm", "a4");
// //       const width = 210;
// //       const height = (canvas.height * width) / canvas.width;
// //       pdf.addImage(img, "PNG", 0, 0, width, height);
// //       const dataUriString = pdf.output("datauristring"); // "data:application/pdf;base64,..."

// //       console.log('Assignment ID:', assignmentId);
// //       if (previousReportId) {
// //         const updateResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/update-report-status`, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({
// //             report_id: previousReportId,
// //             status: "deleted"
// //           })
// //         });
        
// //         if (!updateResponse.ok) {
// //           throw new Error("Failed to update old report status");
// //         }
// //       }

// //       // 4) Build JSON payload for new report
// //       const payload = {
// //         registration_id: registrationId,
// //         pdf_data: dataUriString,
// //         reported_at: new Date().toISOString(),
// //         username: user?.username || "UnknownUser",
// //         topic_id: topicId,
// //         course_id: courseId,
// //         assignment_id: assignmentId
// //       };

// //       // 5) POST as JSON to create new report
// //       const apiUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000").trim();
// //       const res = await fetch(`${apiUrl}/api/save-report-pdf`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       });

// //       if (!res.ok) {
// //         const errText = await res.text();
// //         throw new Error(errText);
// //       }

// //       // 6) Navigate on success
// //       navigate(
// //         `/student-dashboard/courses/ongoing/${topicId}/protocols/post-counselling/${courseId}`,
// //         { state: { registration_id: registrationId } }
// //       );
// //     } catch (err) {
// //       console.error("Error saving PDF:", err);
// //       alert(`Failed to save report: ${err.message}`);
// //       setIsSaving(false);
// //     }
// //   };

// //   if (loadingAnalysis || loadingRegistration) {
// //     return (
// //       <div className="flex justify-center items-center min-h-screen bg-gray-200">
// //         <p className="text-xl font-bold">Loading...</p>
// //       </div>
// //     );
// //   }

// //   // Fallbacks & data parsing
// //   const patientName = registrationData?.name || "Yashvi M Patel";
// //   const patientAge = registrationData?.age || "21";
// //   const patientSex = registrationData?.gender || "N/A";
// //   const registeredOn = registrationData?.created_at
// //     ? new Date(registrationData.created_at).toLocaleString()
// //     : "Time";
// //   const finding = analysisData?.finding || "Default Finding text.";
// //   const impression = analysisData?.impression || "Default Impression text.";

// //   let imagesToShow = [];
// //   if (analysisData?.selected_image) {
// //     try {
// //       const parsed =
// //         typeof analysisData.selected_image === "string"
// //           ? JSON.parse(analysisData.selected_image)
// //           : analysisData.selected_image;
// //       imagesToShow = Array.isArray(parsed) ? parsed : [parsed];
// //     } catch {
// //       imagesToShow = [analysisData.selected_image];
// //     }
// //   }
// //   if (!imagesToShow.length) imagesToShow = [ctscan];
// //   const reportedOn = new Date().toLocaleString();

// //   return (
// //     <div className="flex justify-center bg-gray-200 p-4 min-h-screen">
// //       <div ref={reportRef} className="w-[210mm] bg-white shadow-lg p-8 rounded-lg">
// //         {/* Header */}
// //         <div className="flex justify-between items-center mb-4">
// //           <img src={onesimlogo} alt="Logo" className="w-32 h-20 object-fill rounded-sm" />
// //           <div className="text-center">
// //             <h1 className="text-3xl font-bold">
// //               ONESIM <span className="text-blue-700">CLINIC</span>
// //             </h1>
// //             <h3 className="text-lg font-semibold">X-Ray | CT - Scan | MRI | USG</h3>
// //             <h6 className="text-sm">
// //               ONE SIMULATION PVT LTD. UNIT NO T4 B 611 NX ONE, HEALTHCARE
// //               COMPLEX, NOIDA - 201306
// //             </h6>
// //           </div>
// //           <div className="text-right text-sm">
// //             <h3>0123456789 | 0912345678</h3>
// //             <h3>onesimulation@gmail.com</h3>
// //           </div>
// //         </div>
// //         <div className="w-full h-6 bg-blue-700 text-white flex justify-end">
// //           <div className="mr-2">www.onesimulation.co.in</div>
// //         </div>

// //         {/* Patient Info */}
// //         <div className="mt-6 grid grid-cols-3 text-sm gap-4">
// //           <div>
// //             <h2 className="font-bold text-lg">{patientName}</h2>
// //             <h3>Age: {patientAge}</h3>
// //             <h3>Sex: {patientSex}</h3>
// //           </div>
// //           <div>
// //             <h3 className="font-bold">PID: {registrationId}</h3>
// //             <h3>
// //               Ref. by: <span className="font-bold">Dr. Ankur Srivastava</span>
// //             </h3>
// //           </div>
// //           <div>
// //             <h3>
// //               <span className="font-bold">Registered on:</span> {registeredOn}
// //             </h3>
// //             <h3>
// //               <span className="font-bold">Reported on:</span> {reportedOn}
// //             </h3>
// //           </div>
// //         </div>

// //         {/* Scan Details */}
// //         <div className="w-full h-px bg-black my-6" />
// //         <h1 className="text-center text-2xl font-bold">CT SCAN</h1>
// //         <div className="mt-6 space-y-4 text-sm">
// //           <div>
// //             <h1 className="font-bold">Part</h1>
// //             <p>Brain: Plain</p>
// //           </div>
// //           <div>
// //             <h1 className="font-bold">Technique</h1>
// //             <p>
// //               Plain CT scan was carried out on a multi-detector scanner. Axial
// //               sections from the base of the skull to the cranial vault were
// //               obtained and evaluated.
// //             </p>
// //           </div>
// //           <div>
// //             <h1 className="font-bold">Findings</h1>
// //             <p>{finding}</p>
// //           </div>
// //           <div>
// //             <h1 className="font-bold">Impression</h1>
// //             <p>{impression}</p>
// //           </div>
// //         </div>

// //         {/* Images */}
// //         <div className="mt-4 flex justify-center space-x-4">
// //           {imagesToShow.map((img, idx) => (
// //             <img
// //               key={idx}
// //               src={img}
// //               alt={`CT Scan ${idx + 1}`}
// //               className="w-60 max-h-[250px] object-fill rounded-md shadow-md"
// //             />
// //           ))}
// //         </div>

// //         {/* Signatures */}
// //         <div className="w-full h-[3px] bg-gray-600 my-8" />
// //         <div className="flex justify-between text-center mb-10">
// //           {["Dr. XYZ", "Dr. XYZ", "Dr. XYZ"].map((n, i) => (
// //             <div key={i}>
// //               <h1 className="font-bold text-lg">{n}</h1>
// //               <h3 className="text-sm">MBBS, MD (Radiology)</h3>
// //               <h3 className="text-sm">Consultant Radiologist</h3>
// //             </div>
// //           ))}
// //         </div>
// //         <div className="w-full h-10 bg-blue-700 text-white flex items-center justify-end pr-2">
// //           <div>www.onesimulation.co.in</div>
// //         </div>
// //       </div>

// //       {/* Actions */}
// //       <div className="flex justify-center mt-10 mb-6 space-x-4">
// //           <button
// //             ref={buttonRef}
// //             onClick={handleDownloadPDF}
// //             className="w-40 py-3 rounded-lg text-base font-medium transition duration-200 shadow-md bg-blue-600 text-white hover:bg-blue-700"
// //           >
// //             Download
// //           </button>
// //           <button
// //             onClick={handlePrint}
// //             className="w-40 py-3 rounded-lg text-base font-medium transition duration-200 shadow-md bg-blue-600 text-white hover:bg-blue-700"
// //           >
// //             Print Report
// //           </button>
// //           <button
// //             onClick={handleNext}
// //             disabled={isSaving}
// //             className={`w-40 py-3 rounded-lg text-base font-medium transition duration-200 shadow-md ${
// //               isSaving ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
// //             } text-white`}
// //           >
// //             {isSaving ? "Saving..." : "Next →"}
// //           </button>
// //         </div>
// //     </div>
// //   );
// // };

// // export default Report;


// // // import React, { useEffect, useState, useRef } from "react";
// // // import html2canvas from "html2canvas";
// // // import jsPDF from "jspdf";
// // // import ctscan from "../../Assest/00000269.jpg";
// // // import onesimlogo from "../../Assest/logo192.jpg";
// // // import { useNavigate, useParams, useLocation } from "react-router-dom";
// // // // Import the custom hook from your UserContext file
// // // import { useUser } from "../../UserContext";

// // // const Report = () => {
// // //   const reportRef = useRef();
// // //   const buttonRef = useRef();
// // //   const { topicId, courseId } = useParams();
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   const registrationId = location.state?.registration_id || "";

// // //   // Correctly get current user info from context
// // //   const { user } = useUser();
// // //   console.log("User from context:", user);

// // //   const [analysisData, setAnalysisData] = useState(null);
// // //   const [registrationData, setRegistrationData] = useState(null);
// // //   const [loadingAnalysis, setLoadingAnalysis] = useState(true);
// // //   const [loadingRegistration, setLoadingRegistration] = useState(true);
// // //   const [isSaving, setIsSaving] = useState(false);

// // //   // Fetch image analysis data
// // //   useEffect(() => {
// // //     if (registrationId) {
// // //       fetch(`${process.env.REACT_APP_API_URL}/api/image-analysis/${registrationId}`)
// // //         .then((res) => {
// // //           if (!res.ok) {
// // //             throw new Error("Failed to fetch image analysis data");
// // //           }
// // //           return res.json();
// // //         })
// // //         .then((data) => {
// // //           setAnalysisData(data);
// // //           setLoadingAnalysis(false);
// // //         })
// // //         .catch((error) => {
// // //           console.error("Error fetching analysis data:", error);
// // //           setLoadingAnalysis(false);
// // //         });
// // //     }
// // //   }, [registrationId]);

// // //   // Fetch patient registration data
// // //   useEffect(() => {
// // //     if (registrationId) {
// // //       fetch(`${process.env.REACT_APP_API_URL}/api/patient-registration/${registrationId}`)
// // //         .then((res) => {
// // //           if (!res.ok) {
// // //             throw new Error("Failed to fetch patient registration data");
// // //           }
// // //           return res.json();
// // //         })
// // //         .then((data) => {
// // //           setRegistrationData(data);
// // //           setLoadingRegistration(false);
// // //         })
// // //         .catch((error) => {
// // //           console.error("Error fetching registration data:", error);
// // //           setLoadingRegistration(false);
// // //         });
// // //     }
// // //   }, [registrationId]);

// // //   // Handle downloading PDF locally
// // //   const handleDownloadPDF = () => {
// // //     if (buttonRef.current) buttonRef.current.style.display = "none";
// // //     html2canvas(reportRef.current, { scale: 2 })
// // //       .then((canvas) => {
// // //         const imgData = canvas.toDataURL("image/png");
// // //         const pdf = new jsPDF("p", "mm", "a4");
// // //         const imgWidth = 210;
// // //         const imgHeight = (canvas.height * imgWidth) / canvas.width;
// // //         // Use username in the PDF file name; fallback if not available
// // //         const username = user?.username || "UnknownUser";
// // //         pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
// // //         pdf.save(`CT_Scan_Report_${username}.pdf`);
// // //         if (buttonRef.current) buttonRef.current.style.display = "block";
// // //       })
// // //       .catch((err) => {
// // //         console.error("Error generating PDF:", err);
// // //         if (buttonRef.current) buttonRef.current.style.display = "block";
// // //       });
// // //   };

// // //   // Handle saving the PDF to the database using the Express API
// // //   const handleNext = async () => {
// // //     try {
// // //       setIsSaving(true);

// // //       // Generate PDF with lower quality to reduce size
// // //       const canvas = await html2canvas(reportRef.current, {
// // //         scale: 1.0,
// // //         useCORS: true,
// // //         logging: false,
// // //         imageTimeout: 0,
// // //         allowTaint: true,
// // //       });

// // //       // Convert canvas to a lower quality JPEG
// // //       const imgData = canvas.toDataURL("image/jpeg", 0.5);
// // //       const pdf = new jsPDF("p", "mm", "a4");
// // //       const imgWidth = 210;
// // //       const imgHeight = (canvas.height * imgWidth) / canvas.width;
// // //       pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

// // //       // Convert PDF to a base64 encoded string (data URI)
// // //       const pdfBase64 = pdf.output("datauristring");

// // //       // Get the current time; the API will use this or default if not provided
// // //       const currentTime = new Date().toISOString();

// // //       // Function to save PDF with retry mechanism
// // //       const savePDFWithRetry = async (retryCount = 0, maxRetries = 3) => {
// // //         try {
// // //           const apiUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000").trim();
// // //           const response = await fetch(`${apiUrl}/api/save-report-pdf`, {
// // //             method: "POST",
// // //             headers: {
// // //               "Content-Type": "application/json",
// // //             },
// // //             body: JSON.stringify({
// // //               registration_id: registrationId,
// // //               pdf_data: pdfBase64,
// // //               reported_at: currentTime,
// // //               // Include username in the payload
// // //               username: user?.username,
// // //             }),
// // //           });

// // //           if (!response.ok) {
// // //             throw new Error("Failed to save PDF to database");
// // //           }

// // //           const result = await response.json();
// // //           console.log("PDF saved successfully:", result);

// // //           // Navigate to the next page after successful save
// // //           navigate(
// // //             `/student-dashboard/courses/ongoing/${topicId}/protocols/post-counselling/${courseId}`,
// // //             { state: { registration_id: registrationId } }
// // //           );
// // //         } catch (error) {
// // //           console.error(`Error saving PDF (attempt ${retryCount + 1}/3):`, error);

// // //           // Retry with exponential backoff if under the retry limit
// // //           if (retryCount < maxRetries) {
// // //             const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
// // //             setTimeout(() => savePDFWithRetry(retryCount + 1, maxRetries), delay);
// // //           } else {
// // //             alert("Failed to save report after multiple attempts. Please try again.");
// // //             setIsSaving(false);
// // //           }
// // //         }
// // //       };

// // //       // Start saving the PDF with retry logic
// // //       await savePDFWithRetry();

// // //     } catch (error) {
// // //       console.error("Error generating PDF:", error);
// // //       alert("Failed to generate report. Please try again.");
// // //       setIsSaving(false);
// // //     }
// // //   };

// // //   // Handle printing the report
// // //   const handlePrint = () => {
// // //     const printContent = reportRef.current.innerHTML;
// // //     const originalContent = document.body.innerHTML;
// // //     document.body.innerHTML = printContent;
// // //     window.print();
// // //     document.body.innerHTML = originalContent;
// // //     window.location.reload();
// // //   };

// // //   if (loadingAnalysis || loadingRegistration) {
// // //     return (
// // //       <div className="flex justify-center items-center min-h-screen bg-gray-200">
// // //         <p className="text-xl font-bold">Loading...</p>
// // //       </div>
// // //     );
// // //   }

// // //   // Fallback defaults if registration or analysis data is missing
// // //   const patientName = registrationData?.name || "Yashvi M Patel";
// // //   const patientAge = registrationData?.age || "21";
// // //   const patientSex = registrationData?.gender || "N/A";
// // //   const registeredOnDynamic = registrationData?.created_at
// // //     ? new Date(registrationData.created_at).toLocaleString()
// // //     : "Time";

// // //   const finding = analysisData?.finding || "Default Finding text.";
// // //   const impression = analysisData?.impression || "Default Impression text.";

// // //   // Parse selected images from analysis data
// // //   let imagesToShow = [];
// // //   if (analysisData?.selected_image) {
// // //     try {
// // //       let parsed = typeof analysisData.selected_image === "string"
// // //         ? JSON.parse(analysisData.selected_image)
// // //         : analysisData.selected_image;
// // //       if (Array.isArray(parsed)) {
// // //         imagesToShow = parsed;
// // //       } else if (typeof parsed === "string" && parsed) {
// // //         imagesToShow = [parsed];
// // //       }
// // //     } catch (error) {
// // //       console.error("Error parsing selected_image:", error);
// // //       imagesToShow = [analysisData.selected_image];
// // //     }
// // //   }
// // //   if (imagesToShow.length === 0) {
// // //     imagesToShow = [ctscan];
// // //   }

// // //   const reportedOn = new Date().toLocaleString();

// // //   return (
// // //     <div className="flex justify-center bg-gray-200 p-4 min-h-screen">
// // //       <div ref={reportRef} className="w-[210mm] bg-white shadow-lg p-8 rounded-lg">
// // //         <div className="flex justify-between items-center mb-4">
// // //           <img src={onesimlogo} className="w-32 rounded-sm object-fill h-20" alt="Logo" />
// // //           <div className="text-center">
// // //             <h1 className="text-3xl font-bold">
// // //               ONESIM <span className="text-blue-700">CLINIC</span>
// // //             </h1>
// // //             <h3 className="text-lg font-semibold">X-Ray | CT - Scan | MRI | USG</h3>
// // //             <h6 className="text-sm">
// // //               ONE SIMULATION PVT LTD. UNIT NO T4 B 611 NX ONE, HEALTHCARE COMPLEX, NOIDA - 201306
// // //             </h6>
// // //           </div>
// // //           <div className="text-right text-sm">
// // //             <h3>0123456789 | 0912345678</h3>
// // //             <h3>onesimulation@gmail.com</h3>
// // //           </div>
// // //         </div>

// // //         <div className="w-full h-6 relative bg-blue-700 text-white flex justify-end">
// // //           <div className="mr-2">www.onesimulation.co.in</div>
// // //         </div>

// // //         <div className="mt-6 grid grid-cols-3 text-sm gap-4">
// // //           <div>
// // //             <h2 className="font-bold text-lg">{patientName}</h2>
// // //             <h3>Age: {patientAge}</h3>
// // //             <h3>Sex: {patientSex}</h3>
// // //           </div>
// // //           <div>
// // //             <h3 className="font-bold">PID: {registrationId}</h3>
// // //             <h3>
// // //               Ref. by: <span className="font-bold">Dr. Ankur Srivastava</span>
// // //             </h3>
// // //           </div>
// // //           <div>
// // //             <h3>
// // //               <span className="font-bold">Registered on:</span> {registeredOnDynamic}
// // //             </h3>
// // //             <h3>
// // //               <span className="font-bold">Reported on:</span> {reportedOn}
// // //             </h3>
// // //           </div>
// // //         </div>

// // //         <div className="w-full h-px bg-black my-6"></div>
// // //         <h1 className="text-center text-2xl font-bold">CT SCAN</h1>

// // //         <div className="mt-6 space-y-4 text-sm">
// // //           <div>
// // //             <h1 className="font-bold">Part</h1>
// // //             <p>Brain: Plain</p>
// // //           </div>
// // //           <div>
// // //             <h1 className="font-bold">Technique</h1>
// // //             <p>
// // //               Plain CT scan was carried out on a multi-detector scanner. Axial sections from the base
// // //               of the skull to the cranial vault were obtained and evaluated.
// // //             </p>
// // //           </div>
// // //           <div>
// // //             <h1 className="font-bold">Findings</h1>
// // //             <p>{finding}</p>
// // //           </div>
// // //           <div>
// // //             <h1 className="font-bold">Impression</h1>
// // //             <p>{impression}</p>
// // //           </div>
// // //         </div>

// // //         <div className="mt-4 flex justify-center space-x-4">
// // //           {imagesToShow.map((img, index) => (
// // //             <img
// // //               key={index}
// // //               src={img}
// // //               alt={`CT Scan ${index + 1}`}
// // //               className="w-60 rounded-md shadow-md max-h-[250px] object-fill"
// // //             />
// // //           ))}
// // //         </div>

// // //         <div className="w-full h-[3px] bg-gray-600 my-8"></div>

// // //         <div className="flex justify-between text-center mb-10">
// // //           {["Dr. XYZ", "Dr. XYZ", "Dr. XYZ"].map((name, index) => (
// // //             <div key={index}>
// // //               <h1 className="font-bold text-lg">{name}</h1>
// // //               <h3 className="text-sm">MBBS, MD (Radiology)</h3>
// // //               <h3 className="text-sm">Consultant Radiologist</h3>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         <div className="w-full h-10 relative bg-blue-700 items-center text-white text-right pr-2 flex">
// // //           <div className="flex absolute right-0 mr-2">www.onesimulation.co.in</div>
// // //         </div>

// // //         <div className="flex justify-center mt-10 mb-6 space-x-4">
// // //           <button
// // //             ref={buttonRef}
// // //             onClick={handleDownloadPDF}
// // //             className="w-40 py-3 rounded-lg text-base font-medium transition duration-200 shadow-md bg-blue-600 text-white hover:bg-blue-700"
// // //           >
// // //             Download
// // //           </button>
// // //           <button
// // //             onClick={handlePrint}
// // //             className="w-40 py-3 rounded-lg text-base font-medium transition duration-200 shadow-md bg-blue-600 text-white hover:bg-blue-700"
// // //           >
// // //             Print Report
// // //           </button>
// // //           <button
// // //             onClick={handleNext}
// // //             disabled={isSaving}
// // //             className={`w-40 py-3 rounded-lg text-base font-medium transition duration-200 shadow-md ${
// // //               isSaving ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
// // //             } text-white`}
// // //           >
// // //             {isSaving ? "Saving..." : "Next →"}
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Report;

// import React, { useEffect, useState, useRef } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import ctscan from "../../Assest/00000269.jpg";
// import onesimlogo from "../../Assest/logo192.jpg";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import { useUser } from "../../UserContext";

// const Report = () => {
//   const reportRef = useRef();
//   const buttonRef = useRef();
//   const { topicId, courseId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const registrationId = location.state?.registration_id || "";
//   const previousReportId = location.state?.reportId;
//   const assignmentId = location.state?.assignmentId;
//   const teacher_username = location.state?.teacher_username;

//   useEffect(() => {
//     console.log('🚀 Passed previousReportId:', previousReportId);
//   }, [previousReportId]);

//     useEffect(() => {
//     console.log('🚀 Passed teacherusername:', teacher_username);
//   }, [teacher_username]);

//   console.log('Assignment ID:', assignmentId);

//   const { user } = useUser();

//   const [analysisData, setAnalysisData] = useState(null);
//   const [registrationData, setRegistrationData] = useState(null);
//   const [loadingAnalysis, setLoadingAnalysis] = useState(true);
//   const [loadingRegistration, setLoadingRegistration] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [course, setCourse] = useState(null);

//   // Fetch analysis data
//   useEffect(() => {
//     if (!registrationId) return;
//     fetch(`${process.env.REACT_APP_API_URL}/api/image-analysis/${registrationId}`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch image analysis data");
//         return res.json();
//       })
//       .then(setAnalysisData)
//       .catch(console.error)
//       .finally(() => setLoadingAnalysis(false));
//   }, [registrationId]);

  
//      useEffect(() => {
//      if (!courseId) return;

//      fetch(`${process.env.REACT_APP_API_URL}/api/courses/${courseId}`)
//        .then((res) => {
//          if (!res.ok) throw new Error();
//          return res.json();
//        })
//        .then(data => setCourse(data))
//        .catch(() => setCourse(false));
//    }, [courseId]);

//    console.log('Course:', course);
//   // Fetch registration data
//   useEffect(() => {
//     if (!registrationId) return;
//     fetch(`${process.env.REACT_APP_API_URL}/api/patient-registration/${registrationId}`)
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch patient registration data");
//         return res.json();
//       })
//       .then(setRegistrationData)
//       .catch(console.error)
//       .finally(() => setLoadingRegistration(false));
//   }, [registrationId]);

//   // Download PDF locally
//   const handleDownloadPDF = () => {
//     if (buttonRef.current) buttonRef.current.style.display = "none";
//     html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: "#fff" })
//       .then((canvas) => {
//         const img = canvas.toDataURL("image/png");
//         const pdf = new jsPDF("p", "mm", "a4");
//         const pdfWidth = 210;
//         const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
//         pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
//         const filename = `CT_Scan_Report_${user?.username || "UnknownUser"}.pdf`;
//         pdf.save(filename);
//       })
//       .catch(console.error)
//       .finally(() => {
//         if (buttonRef.current) buttonRef.current.style.display = "block";
//       });
//   };

//   // Print
//   const handlePrint = () => {
//     const printHTML = reportRef.current.innerHTML;
//     const original = document.body.innerHTML;
//     document.body.innerHTML = printHTML;
//     window.print();
//     document.body.innerHTML = original;
//     window.location.reload();
//   };

//   // Save & Next using JSON payload (includes topic_id & course_id)
//   const handleNext = async () => {
//     setIsSaving(true);
//     try {
//       // 1) Render at high resolution
//       const canvas = await html2canvas(reportRef.current, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: "#fff",
//       });

//       // 2) Create PDF and get a Data URI string
//       const img = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const width = 210;
//       const height = (canvas.height * width) / canvas.width;
//       pdf.addImage(img, "PNG", 0, 0, width, height);
//       const dataUriString = pdf.output("datauristring"); // "data:application/pdf;base64,..."

//       console.log('Assignment ID:', assignmentId);
//       if (previousReportId) {
//         const updateResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/update-report-status`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             report_id: previousReportId,
//             status: "deleted"
//           })
//         });
        
//         if (!updateResponse.ok) {
//           throw new Error("Failed to update old report status");
//         }
//       }

//       // 4) Build JSON payload for new report
//       const payload = {
//         registration_id: registrationId,
//         pdf_data: dataUriString,
//         reported_at: new Date().toISOString(),
//         username: user?.username || "UnknownUser",
//         topic_id: topicId,
//         course_id: courseId,
//         assignment_id: assignmentId,
//         teacher_username: teacher_username,
//       };

//       // 5) POST as JSON to create new report
//       const apiUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000").trim();
//       const res = await fetch(`${apiUrl}/api/save-report-pdf`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(errText);
//       }

//       // 6) Navigate on success
//       navigate(
//         `/student-dashboard/courses/ongoing/${topicId}/protocols/post-counselling/${courseId}`,
//         { state: { registration_id: registrationId } }
//       );
//     } catch (err) {
//       console.error("Error saving PDF:", err);
//       alert(`Failed to save report: ${err.message}`);
//       setIsSaving(false);
//     }
//   };

//   if (loadingAnalysis || loadingRegistration) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-200">
//         <p className="text-xl font-bold">Loading...</p>
//       </div>
//     );
//   }

//   // Fallbacks & data parsing
//   const patientName = registrationData?.name || "Yashvi M Patel";
//   const patientAge = registrationData?.age || "21";
//   const patientSex = registrationData?.gender || "N/A";
//   const registeredOn = registrationData?.created_at
//     ? new Date(registrationData.created_at).toLocaleString()
//     : "Time";
//   const finding = analysisData?.finding || "Default Finding text.";
//   const impression = analysisData?.impression || "Default Impression text.";

//   let imagesToShow = [];
//   if (analysisData?.selected_image) {
//     try {
//       const parsed =
//         typeof analysisData.selected_image === "string"
//           ? JSON.parse(analysisData.selected_image)
//           : analysisData.selected_image;
//       imagesToShow = Array.isArray(parsed) ? parsed : [parsed];
//     } catch {
//       imagesToShow = [analysisData.selected_image];
//     }
//   }
//   if (!imagesToShow.length) imagesToShow = [ctscan];
//   const reportedOn = new Date().toLocaleString();

//   return (
//     <div className="flex justify-center bg-gray-200 p-4 min-h-screen">
//       <div ref={reportRef} className="w-[210mm] bg-white shadow-lg p-8 rounded-lg">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <img src={onesimlogo} alt="Logo" className="w-32 h-20 object-fill rounded-sm" />
//           <div className="text-center">
//             <h1 className="text-3xl font-bold">
//               ONESIM <span className="text-blue-700">CLINIC</span>
//             </h1>
//             <h3 className="text-lg font-semibold">X-Ray | CT - Scan | MRI | USG</h3>
//             <h6 className="text-sm">
//               ONE SIMULATION PVT LTD. UNIT NO T4 B 611 NX ONE, HEALTHCARE
//               COMPLEX, NOIDA - 201306
//             </h6>
//           </div>
//           <div className="text-right text-sm">
//             <h3>0123456789 | 0912345678</h3>
//             <h3>onesimulation@gmail.com</h3>
//           </div>
//         </div>
//         <div className="w-full h-6 bg-blue-700 text-white flex justify-end">
//           <div className="mr-2">www.onesimulation.co.in</div>
//         </div>

//         {/* Patient Info */}
//         <div className="mt-6 grid grid-cols-3 text-sm gap-4">
//           <div>
//             <h2 className="font-bold text-lg">{patientName}</h2>
//             <h3>Age: {patientAge}</h3>
//             <h3>Sex: {patientSex}</h3>
//           </div>
//           <div>
//             <h3 className="font-bold">PID: {registrationId}</h3>
//             <h3>
//               Ref. by: <span className="font-bold">Dr. Ankur Srivastava</span>
//             </h3>
//           </div>
//           <div>
//             <h3>
//               <span className="font-bold">Registered on:</span> {registeredOn}
//             </h3>
//             <h3>
//               <span className="font-bold">Reported on:</span> {reportedOn}
//             </h3>
//           </div>
//         </div>

//         {/* Scan Details */}
//         <div className="w-full h-px bg-black my-6" />
//         <h1 className="text-center text-2xl font-bold">CT SCAN</h1>
//         <div className="mt-6 space-y-4 text-sm">
//           <div>
//             <h1 className="font-bold">Part</h1>
//             <p>{course.title}</p>
//           </div>
//           <div>
//             <h1 className="font-bold">Technique</h1>
//             <p>
//               {course.description}
//             </p>
//           </div>
//           <div>
//             <h1 className="font-bold">Findings</h1>
//             <p>{finding}</p>
//           </div>
//           <div>
//             <h1 className="font-bold">Impression</h1>
//             <p>{impression}</p>
//           </div>
//         </div>

//         {/* Images */}
//         <div className="mt-4 flex justify-center space-x-4">
//           {imagesToShow.map((img, idx) => (
//             <img
//               key={idx}
//               src={img}
//               alt={`CT Scan ${idx + 1}`}
//               className="w-60 max-h-[250px] object-fill rounded-md shadow-md"
//             />
//           ))}
//         </div>

//         {/* Signatures */}
//         <div className="w-full h-[3px] bg-gray-600 my-8" />
//         <div className="flex justify-between text-center mb-10">
//           {["Dr. XYZ", "Dr. XYZ", "Dr. XYZ"].map((n, i) => (
//             <div key={i}>
//               <h1 className="font-bold text-lg">{n}</h1>
//               <h3 className="text-sm">MBBS, MD (Radiology)</h3>
//               <h3 className="text-sm">Consultant Radiologist</h3>
//             </div>
//           ))}
//         </div>
//         <div className="w-full h-10 bg-blue-700 text-white flex items-center justify-end pr-2">
//           <div>www.onesimulation.co.in</div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-center mt-10 space-x-4">
//           <button
//             ref={buttonRef}
//             onClick={handleDownloadPDF}
//             className="w-40 py-3 rounded-lg text-base font-medium transition duration-200 shadow-md bg-blue-600 text-white hover:bg-blue-700"
//           >
//             Download
//           </button>
//           <button
//             onClick={handlePrint}
//             className="w-40 py-3 rounded-lg text-base font-medium transition duration-200 shadow-md bg-blue-600 text-white hover:bg-blue-700"
//           >
//             Print Report
//           </button>
//           <button
//             onClick={handleNext}
//             disabled={isSaving}
//             className={`w-40 py-3 rounded-lg text-base font-medium transition duration-200 shadow-md ${
//               isSaving ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//             } text-white`}
//           >
//             {isSaving ? "Saving..." : "Next →"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Report;
import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ctscan from "../../Assest/00000269.jpg";
import onesimlogo from "../../Assest/logo192.jpg";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useUser } from "../../UserContext";

const Report = () => {
  const reportRef = useRef();
  const buttonRef = useRef();
  const { topicId, courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const registrationId = location.state?.registration_id || "";
  const previousReportId = location.state?.reportId;
  const assignmentId = location.state?.assignmentId;
  const teacher_username = location.state?.teacher_username;

  const { user } = useUser();

  // Data states
  const [analysisData, setAnalysisData] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [loadingRegistration, setLoadingRegistration] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // Single state for course: null = loading, object = success, false = error
  const [course, setCourse] = useState(null);

  // Fetch analysis data
  useEffect(() => {
    if (!registrationId) return;
    fetch(`${process.env.REACT_APP_API_URL}/api/image-analysis/${registrationId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch image analysis data");
        return res.json();
      })
      .then(setAnalysisData)
      .catch(console.error)
      .finally(() => setLoadingAnalysis(false));
  }, [registrationId]);

  // Fetch course data
  useEffect(() => {
    if (!courseId) return;
    fetch(`${process.env.REACT_APP_API_URL}/api/courses/reporting/${courseId}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setCourse(data))
      .catch(() => setCourse(false));
  }, [courseId]);

  // Fetch registration data
  useEffect(() => {
    if (!registrationId) return;
    fetch(`${process.env.REACT_APP_API_URL}/api/patient-registration/${registrationId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch patient registration data");
        return res.json();
      })
      .then(setRegistrationData)
      .catch(console.error)
      .finally(() => setLoadingRegistration(false));
  }, [registrationId]);

  // Guard for loading and error states
  if (loadingAnalysis || loadingRegistration || course === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
        <p className="text-xl font-bold">Loading…</p>
      </div>
    );
  }
  if (course === false) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
        <p className="text-xl font-bold text-red-500">Failed to load course</p>
      </div>
    );
  }

  // Handler: Download PDF
  const handleDownloadPDF = () => {
    if (buttonRef.current) buttonRef.current.style.display = "none";
    html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: "#fff" })
      .then((canvas) => {
        const img = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = 210;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
        const filename = `CT_Scan_Report_${user?.username || "UnknownUser"}.pdf`;
        pdf.save(filename);
      })
      .catch(console.error)
      .finally(() => {
        if (buttonRef.current) buttonRef.current.style.display = "block";
      });
  };

  // Handler: Print
  const handlePrint = () => {
    const printHTML = reportRef.current.innerHTML;
    const original = document.body.innerHTML;
    document.body.innerHTML = printHTML;
    window.print();
    document.body.innerHTML = original;
    window.location.reload();
  };

  // Handler: Save & Next
  const handleNext = async () => {
    setIsSaving(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: "#fff" });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const width = 210;
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, width, height);
      const dataUriString = pdf.output("datauristring");

      if (previousReportId) {
        const updateResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/update-report-status`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ report_id: previousReportId, status: "deleted" }),
          }
        );
        if (!updateResponse.ok) throw new Error("Failed to update old report status");
      }
      console.log("courseName", course.title);
      const payload = {
        registration_id: registrationId,
        pdf_data: dataUriString,
        reported_at: new Date().toISOString(),
        username: user?.username || "UnknownUser",
        topic_id: topicId,
        course_id: courseId,
        assignment_id: assignmentId,
        teacher_username,
        course_name: course.title,
      };

      const apiUrl = (process.env.REACT_APP_API_URL || "http://localhost:5000").trim();
      const res = await fetch(`${apiUrl}/api/save-report-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      navigate(
        `/student-dashboard/courses/ongoing/${topicId}/protocols/post-counselling/${courseId}`,
        { state: { registration_id: registrationId , teacher_username } }
      );
    } catch (err) {
      console.error("Error saving PDF:", err);
      alert(`Failed to save report: ${err.message}`);
      setIsSaving(false);
    }
  };

  // Data parsing & defaults
  const patientName = registrationData?.name || "Yashvi M Patel";
  const patientAge = registrationData?.age || "21";
  const patientSex = registrationData?.gender || "N/A";
  const registeredOn = registrationData?.created_at
    ? new Date(registrationData.created_at).toLocaleString()
    : "Time";
  const finding = analysisData?.finding || "Default Finding text.";
  const impression = analysisData?.impression || "Default Impression text.";
  let imagesToShow = [];
  if (analysisData?.selected_image) {
    try {
      const parsed =
        typeof analysisData.selected_image === "string"
          ? JSON.parse(analysisData.selected_image)
          : analysisData.selected_image;
      imagesToShow = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      imagesToShow = [analysisData.selected_image];
    }
  }
  if (!imagesToShow.length) imagesToShow = [ctscan];
  const reportedOn = new Date().toLocaleString();

  return (
    <div className="flex justify-center bg-gray-200 p-4 min-h-screen">
      <div ref={reportRef} className="w-[210mm] bg-white shadow-lg p-8 rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <img src={onesimlogo} alt="Logo" className="w-32 h-20 object-fill rounded-sm" />
          <div className="text-center">
            <h1 className="text-3xl font-bold">
              ONESIM <span className="text-blue-700">CLINIC</span>
            </h1>
            <h3 className="text-lg font-semibold">X-Ray | CT - Scan | MRI | USG</h3>
            <h6 className="text-sm">
              ONE SIMULATION PVT LTD. UNIT NO T4 B 611 NX ONE, HEALTHCARE
              COMPLEX, NOIDA - 201306
            </h6>
          </div>
          <div className="text-right text-sm">
            <h3>0123456789 | 0912345678</h3>
            <h3>onesimulation@gmail.com</h3>
          </div>
        </div>
        <div className="w-full h-6 bg-blue-700 text-white flex justify-end">
          <div className="mr-2">www.onesimulation.co.in</div>
        </div>

        {/* Patient & Course Info */}
        <div className="mt-6 grid grid-cols-3 text-sm gap-4">
          <div>
            <h2 className="font-bold text-lg">{patientName}</h2>
            <h3>Age: {patientAge}</h3>
            <h3>Sex: {patientSex}</h3>
          </div>
          <div>
            <h3 className="font-bold">PID: {registrationId}</h3>
            <h3>
              Ref. by: <span className="font-bold">Dr. Ankur Srivastava</span>
            </h3>
          </div>
          <div>
            <h3>
              <span className="font-bold">Registered on:</span> {registeredOn}
            </h3>
            <h3>
              <span className="font-bold">Reported on:</span> {reportedOn}
            </h3>
          </div>
        </div>

        {/* Scan Details */}
        <div className="w-full h-px bg-black my-6" />
        <h1 className="text-center text-2xl font-bold">CT SCAN</h1>
        <div className="mt-6 space-y-4 text-sm">
          <div>
            <h1 className="font-bold">Part</h1>
            <p>{course.title}</p>
          </div>
          <div>
            <h1 className="font-bold">Technique</h1>
            <p>{course.description}</p>
          </div>
          <div>
            <h1 className="font-bold">Findings</h1>
            <p>{finding}</p>
          </div>
          <div>
            <h1 className="font-bold">Impression</h1>
            <p>{impression}</p>
          </div>
        </div>

        {/* Images */}
        <div className="mt-4 flex justify-center space-x-4">
          {imagesToShow.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`CT Scan ${idx + 1}`}
              className="w-60 max-h-[250px] object-fill rounded-md shadow-md"
            />
          ))}
        </div>

        {/* Signatures */}
        <div className="w-full h-[3px] bg-gray-600 my-8" />
        <div className="flex justify-between text-center mb-10">
          {['Dr. XYZ', 'Dr. XYZ', 'Dr. XYZ'].map((n, i) => (
            <div key={i}>
              <h1 className="font-bold text-lg">{n}</h1>
              <h3 className="text-sm">MBBS, MD (Radiology)</h3>
              <h3 className="text-sm">Consultant Radiologist</h3>
            </div>
          ))}
        </div>
        <div className="w-full h-10 bg-blue-700 text-white flex items-center justify-end pr-2">
          <div>www.onesimulation.co.in</div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-10 space-x-4">
          <button
            ref={buttonRef}
            onClick={handleDownloadPDF}
            className="w-40 py-3 rounded-lg text-base font-medium transition duration-200 shadow-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Download
          </button>
          <button
            onClick={handlePrint}
            className="w-40 py-3 rounded-lg text-base font-medium transition duration-200 shadow-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Print Report
          </button>
          <button
            onClick={handleNext}
            disabled={isSaving}
            className={`w-40 py-3 rounded-lg text-base font-medium transition duration-200 shadow-md ${
              isSaving ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isSaving ? 'Saving...' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Report;
