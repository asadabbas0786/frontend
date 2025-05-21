import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';  // Assuming you're using axios for HTTP requests

const Overview = () => {
    const navigate = useNavigate();
    const { topicId, courseId } = useParams();
    const location = useLocation();
    const reportId = location.state?.reportId;
    const teacher_username = location.state?.teacher_username;
    const assignmentId = location.state?.assignmentId;
    const [showModal, setShowModal] = useState(false);
    const [details, setDetails] = useState({
        title: "Loading Course...",
        intro: "",
        objectives: [],
        structure: [],
        details: {}
    });

    useEffect(() => {
              console.log('🚀 Passed reportId:', reportId);
          }, [reportId]);
    
        useEffect(() => {
            console.log('🚀 Passed teacherusername:', teacher_username);
        }, [teacher_username]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${process.env.REACT_APP_API_URL}/api/course-overview/${courseId}`;
                const response = await axios.get(url);
                setDetails(response.data);
            } catch (error) {
                console.error('Error fetching course details:', error);
                setDetails({
                    title: "Unknown Course",
                    intro: "No details available for this course.",
                    objectives: [],
                    structure: [],
                    details: {}
                });
            }
        };
        fetchData();
    }, [courseId]);

    const handleNext = () => {
        setShowModal(true);
    };

    const handleCaseType = (isEmergency) => {
        navigate(`/student-dashboard/courses/ongoing/${topicId}/protocols/patient-registration/${courseId}`,
            { 
                state: { 
                    reportId,
                    assignmentId,
                    teacher_username,
                    isEmergency,
                    courseDetails: details
                }
            }
        );
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="min-h-full bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
            <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                    <h1 className="text-3xl font-bold text-white text-center">
                        {details.title}
                    </h1>
                    <p className="text-blue-100 text-center mt-2">
                        Please review all the information before proceeding
                    </p>
                </div>

                {/* Form Content */}
                <div className="p-8 bg-white/80">
                   
                    {/* <div className="mb-8">
                        <div className="bg-blue-50/80 p-4 rounded-lg mb-4">
                           <h2 className="text-xl font-semibold text-blue-800">What is CT Scan?</h2>      
                        </div>
                        <div className="bg-gray-50/80 p-4 rounded-lg">
                            <p className="text-gray-700">{details.intro}</p>
                        </div>
                    </div> */}

                    {/* Learning Objectives */} 
                    {/* {details.objectives && details.objectives.length > 0 && (
                        <div className="mb-8">
                            <div className="bg-blue-50/80 p-4 rounded-lg mb-4">
                                <h2 className="text-xl font-semibold text-blue-800">Learning Objectives</h2>
                            </div>
                            <div className="space-y-4">
                                {details.objectives.map((objective, index) => (
                                    <div key={index} className="flex items-center space-x-4 bg-gray-50/80 p-4 rounded-lg">
                                        <span className="text-gray-700">{objective}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Course Structure */}
                    {details.structure && details.structure.length > 0 && (
  <div className="mb-8">
    <div className="bg-blue-50/80 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-semibold text-blue-800">Course Structure</h2>
    </div>
    <div className="space-y-4">
      {details.structure.map((section, index) => (
        <div key={index} className="bg-gray-50/80 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{section}</h3>

          {section === "Important Notes" ? (
            <ul className="space-y-2">
              {details.details[section].map((note, i) => (
                <li key={i} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`important-note-${i}`}
                    className="form-checkbox h-5 w-5 text-blue-600 mr-3"
                  />
                  <label htmlFor={`important-note-${i}`} className="text-gray-700">
                    {note}
                  </label>
                </li>
              ))}
            </ul>
          ) : Array.isArray(details.details[section]) ? (
            <ul className="list-disc list-inside text-gray-700">
              {details.details[section].map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          ) : (
            Object.entries(details.details[section] || {}).map(([key, values], i) => (
              <div key={i} className="mt-2">
                <h4 className="font-semibold text-gray-700">{key}:</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {values.map((value, j) => (
                    <li key={j}>{value}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  </div>
)}


                    {/* Next Button */}
                    <div className="flex justify-center mt-10 mb-6">
                        <button
                            onClick={handleNext}
                            className="w-40 py-3 rounded-lg text-base font-medium transition duration-200 shadow-md bg-blue-600 text-white hover:bg-blue-700"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>

            
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
                       
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select Scan Type</h2>
                        <div className="space-y-4">
                            <button
                                onClick={() => handleCaseType(true)}
                                className="w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-700 transition duration-200"
                            >
                                Emergency Scan
                            </button>
                            <button
                                onClick={() => handleCaseType(false)}
                                className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Normal Scan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Overview;