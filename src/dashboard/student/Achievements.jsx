import React, { useState, useEffect } from 'react';
import { GetCourseAchievementsByUserId } from '../../service/api';

// Utility function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Download certificate image
const handleDownload = (achievement) => {
  if (achievement.certificateUrl) {
    const link = document.createElement('a');
    link.href = achievement.certificateUrl;
    link.download = `${achievement.courseTitle.replace(/\s+/g, '_')}_certificate.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

function Achievements() {
  // Retrieve user info from localStorage
  let userInfo = {};
  try {
    userInfo = JSON.parse(localStorage.getItem('loginData')) || {};
  } catch (e) {
    console.error('Failed to parse loginData:', e);
  }
  const authToken = userInfo.token;
  const currentUserId = userInfo.user?._id;

  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!currentUserId || !authToken) {
        setError('Please log in to view achievements');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await GetCourseAchievementsByUserId(currentUserId, authToken);
        const validAchievements = Array.isArray(data)
          ? data.filter((achievement) => achievement && achievement._id && achievement.courseTitle)
          : [];
        setAchievements(validAchievements);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Session expired. Please log in again.');
        } else {
          setError(err.message || 'Failed to load course achievements');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAchievements();
  }, [currentUserId, authToken]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Course Certificates</h1>

      {isLoading && (
        <div className="text-center text-gray-500">Loading...</div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
          {error}
        </div>
      )}

      {achievements.length === 0 && !isLoading ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
          No course certificates yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {achievement.certificateUrl ? (
                <img
                  src={achievement.certificateUrl}
                  alt={`${achievement.courseTitle} certificate`}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Certificate Image
                </div>
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {achievement.courseTitle}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  Awarded to: {achievement.username || 'Unknown'}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Completed: {formatDate(achievement.completedAt)}
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleDownload(achievement)}
                    className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-green-50 transition-colors duration-200"
                    title="Download Certificate"
                    aria-label={`Download ${achievement.courseTitle} certificate image`}
                    disabled={!achievement.certificateUrl}
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Achievements;


// import React, { useState, useEffect } from 'react';
// import { GetCourseAchievementsByUserId } from '../../service/api';

// const formatDate = (dateString) => {
//   if (!dateString) return '';
//   const options = { year: 'numeric', month: 'long', day: 'numeric' };
//   return new Date(dateString).toLocaleDateString(undefined, options);
// };

// const Achievements = () => {
//   const [achievements, setAchievements] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Get user ID from localStorage loginData
//   const userId = (() => {
//     try {
//       const tokenData = JSON.parse(localStorage.getItem('loginData'));
//       return tokenData?.user?._id || null;
//     } catch {
//       return null;
//     }
//   })();

//   useEffect(() => {
//     const fetchAchievements = async () => {
//       if (!userId) {
//         setError('User not logged in');
//         return;
//       }

//       setIsLoading(true);
//       setError(null);
//       try {
//         const data = await GetCourseAchievementsByUserId(userId);
//         setAchievements(data);
//       } catch (err) {
//         setError(err.message || 'Failed to load achievements');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAchievements();
//   }, [userId]);


//   const handleDownload = async (url, title) => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();
//       const blobUrl = window.URL.createObjectURL(blob);
      
//       const link = document.createElement('a');
//       link.href = blobUrl;
//       link.download = `${title.replace(/\s+/g, '_')}_certificate.jpg`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(blobUrl);
//     } catch (error) {
//       alert('Failed to download certificate. Try again later.');
//       console.error('Download error:', error);
//     }
//   };
  

//   return (
//     <div className="container mx-auto px-6 py-8">
//       {isLoading && <p className="text-gray-500">Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {achievements.length === 0 && !isLoading ? (
//         <div className="text-center text-gray-500">No achievements found.</div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {achievements.map((achievement) => (
//             <div
//               key={achievement._id}
//               className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
//             >
//               <img
//                 src={achievement.certificateUrl}
//                 alt="Certificate Preview"
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-4">
//                 <h3 className="text-lg font-semibold text-gray-800">{achievement.courseTitle}</h3>
//                 <p className="text-sm text-gray-500 mt-1">
//                   Completed: {formatDate(achievement.completedAt)}
//                 </p>

//                 <div className="mt-4 flex justify-between">
//                   <a
//                     href={achievement.certificateUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="bg-blue-500 text-white text-sm px-4 py-1 rounded hover:bg-blue-600"
//                   >
//                     Preview
//                   </a>
//                   <button
//                     onClick={() =>
//                       handleDownload(achievement.certificateUrl, achievement.courseTitle)
//                     }
//                     className="bg-green-500 text-white text-sm px-4 py-1 rounded hover:bg-green-600"
//                   >
//                     Download
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Achievements;
