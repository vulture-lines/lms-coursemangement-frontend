import React, { useState, useEffect } from 'react';

// Mock API data (simulating GET response with userName added)
const mockProgressData = [
  {
    userId: "6803729bc16eaa98a3c46fff",
    userName: "John Doe",
    progress: {
      courseId: "6805dc3b86355dc131e804c7",
      courseTitle: "JavaScript Basics",
      completedLessons: [
        {
          lessonIndex: 0,
          isLessonCompleted: true,
          sublessons: [
            { sublessonIndex: 1, isCompleted: true }
          ],
          percentage: 100
        }
      ],
      completedLessonCount: 1,
      percentage: 100,
      isCompleted: true
    }
  },
  {
    userId: "68033770c2c0584a3b4af07e",
    userName: "Jane Smith",
    progress: {
      courseId: "6805dc3b86355dc131e804c7",
      courseTitle: "JavaScript Basics",
      completedLessons: [],
      completedLessonCount: 0,
      percentage: 0,
      isCompleted: false
    }
  }
];

// Simple PageHeader component
const PageHeader = ({ title }) => (
  <div className="bg-gray-100 py-6 px-4 lg:px-8">
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
  </div>
);

// Component to display individual lesson details (for potential expansion)
const LessonDetails = ({ lesson }) => {
  return (
    <div className="ml-4 mt-2">
      <p className="text-sm text-gray-600">Lesson {lesson.lessonIndex + 1}</p>
      <p className="text-sm">Completion: {lesson.percentage}%</p>
      <p className="text-sm">Status: {lesson.isLessonCompleted ? "Completed" : "In Progress"}</p>
      <div className="ml-4">
        <p className="text-sm font-semibold">Sublessons:</p>
        {lesson.sublessons.map((sublesson) => (
          <p key={sublesson.sublessonIndex} className="text-sm">
            Sublesson {sublesson.sublessonIndex + 1}: {sublesson.isCompleted ? "Completed" : "Not Completed"}
          </p>
        ))}
      </div>
    </div>
  );
};

// ProgressReportTable component
const ProgressReportTable = ({ progressData, isLoading, error }) => {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="w-full rounded-md">
          <thead>
            <tr className="bg-green-600 text-white text-sm font-medium h-10 text-left divide-x divide-gray-200">
              <th className="px-2">COURSE</th>
              <th className="px-2 w-24">PROGRESS</th>
              <th className="px-2 w-24">COMPLETED LESSONS</th>
              <th className="px-2 w-56">USER NAME</th>
              <th className="px-2 w-24">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-x divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" className="text-center text-red-700 py-4">
                  {error}
                </td>
              </tr>
            ) : progressData.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No progress data available.
                </td>
              </tr>
            ) : (
              progressData.map(({ userId, userName, progress }) => (
                <tr key={userId} className="bg-white text-black font-base h-10 divide-x divide-gray-200">
                  <td className="px-2" data-cell="course">
                    {progress.courseTitle}
                  </td>
                  <td className="px-2" data-cell="progress">
                    {progress.percentage}%
                  </td>
                  <td className="px-2" data-cell="completedLessons">
                    {progress.completedLessonCount}
                  </td>
                  <td className="px-2" data-cell="userName">
                    {userName}
                  </td>
                  <td className="px-2" data-cell="status">
                    {progress.isCompleted ? "Completed" : "In Progress"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Grid View */}
      <div className="md:hidden flex flex-col gap-4">
        {isLoading ? (
          <div className="text-center text-gray-500 py-4">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-700 py-4">{error}</div>
        ) : progressData.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No progress data available.</div>
        ) : (
          progressData.map(({ userId, userName, progress }) => (
            <div key={userId} className="grid grid-cols-2 shadow rounded-md p-4 gap-2 text-sm w-full bg-white">
              <label className="font-semibold">Course</label>
              <p>{progress.courseTitle}</p>
              <label className="font-semibold">Progress</label>
              <p>{progress.percentage}%</p>
              <label className="font-semibold">Completed Lessons</label>
              <p>{progress.completedLessonCount}</p>
              <label className="font-semibold">User Name</label>
              <p>{userName}</p>
              <label className="font-semibold">Status</label>
              <p>{progress.isCompleted ? "Completed" : "In Progress"}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
};

// Main AdminProgress component
const AdminProgress = () => {
  const [progressData, setProgressData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  const [lessonIndex, setLessonIndex] = useState('');
  const [sublessonIndex, setSublessonIndex] = useState('');
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);

  // Simulate fetching progress data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    try {
      setTimeout(() => {
        setProgressData(mockProgressData);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to load progress data");
      setIsLoading(false);
    }
  }, []);

  // Handle progress update
  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    setUpdateSuccess(null);

    if (!userName || !lessonIndex || !sublessonIndex) {
      setUpdateError("Please fill in all fields");
      return;
    }

    // Map userName to userId for API call (mock mapping)
    const userMap = {
      "John Doe": "6803729bc16eaa98a3c46fff",
      "Jane Smith": "68033770c2c0584a3b4af07e"
    };
    const userId = userMap[userName];

    if (!userId) {
      setUpdateError("User not found");
      return;
    }

    try {
      const token = localStorage.getItem('authToken'); // Replace with your auth token retrieval method
      const response = await fetch(
        `http://localhost:5000/api/courseProgress/${userId}/6805dc3b86355dc131e804c7`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            lessonIndex: parseInt(lessonIndex),
            sublessonIndex: parseInt(sublessonIndex),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update progress');
      }

      const result = await response.json();
      setUpdateSuccess(result.message || 'Progress updated successfully');
      
      // Optionally refresh progress data
      setProgressData((prevData) => {
        const updatedData = prevData.map((item) =>
          item.userId === userId ? { ...item, progress: result.progress } : item
        );
        return updatedData;
      });
    } catch (err) {
      setUpdateError(err.message || 'Failed to update progress');
    }
  };

  return (
    <>
      <PageHeader title="Course Progress" />
      <div className="px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start justify-between lg:items-center mb-4 gap-4">
          <h3 className="text-base font-medium">Report</h3>
          <input
            type="text"
            placeholder="Search course"
            className="bg-white px-3 py-1 text-black shadow rounded-md"
          />
        </div>

        {/* Update Progress Form */}
        <div className="mb-6 p-4 bg-white shadow rounded-md">
          <h3 className="text-lg font-semibold mb-4">User Progress</h3>
          {updateError && <p className="text-red-700 mb-2">{updateError}</p>}
          {updateSuccess && <p className="text-green-700 mb-2">{updateSuccess}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="User Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-white px-3 py-2 text-black shadow rounded-md"
            />
            <input
              type="number"
              placeholder="Lesson Index"
              value={lessonIndex}
              onChange={(e) => setLessonIndex(e.target.value)}
              className="bg-white px-3 py-2 text-black shadow rounded-md"
            />
            <input
              type="number"
              placeholder="Sublesson Index"
              value={sublessonIndex}
              onChange={(e) => setSublessonIndex(e.target.value)}
              className="bg-white px-3 py-2 text-black shadow rounded-md"
            />
          </div>
          <button
            onClick={handleUpdateProgress}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Update Progress
          </button>
        </div>

        <ProgressReportTable
          progressData={progressData}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </>
  );
};

export default AdminProgress;