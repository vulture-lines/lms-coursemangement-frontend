import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateCourseAchievement, GetAllCourseAchievements, UpdateCourseAchievement, GetAllUsers, GetAllCourses, UploadFile } from '../../service/api';

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [certificateLoading, setCertificateLoading] = useState(false);
  const [error, setError] = useState(null);
  const [certificatePreview, setCertificatePreview] = useState(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Fetch all achievements, users, and courses
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const achievementData = await GetAllCourseAchievements();
      setAchievements(achievementData);
      const userData = await GetAllUsers();
      setUsers(userData);
      const courseData = await GetAllCourses();
      setCourses(courseData);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Clean up certificate preview URL
  useEffect(() => {
    return () => {
      if (certificatePreview) {
        URL.revokeObjectURL(certificatePreview);
      }
    };
  }, [certificatePreview]);

  const handleCertificateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (e.g., JPG, PNG).');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setCertificatePreview(previewUrl);
    setCertificateLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await UploadFile(formData);
      if (res?.fileUrl && typeof res.fileUrl === 'string' && res.fileUrl.startsWith('http')) {
        setValue('certificateUrl', res.fileUrl);
      } else {
        throw new Error('Invalid response from server: fileUrl missing or invalid');
      }
    } catch (error) {
      setError(error.message || 'Failed to upload certificate. Please try again.');
      setCertificatePreview(null);
      setValue('certificateUrl', '');
    } finally {
      setCertificateLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      if (isEditing && currentAchievement) {
        await UpdateCourseAchievement(currentAchievement._id, {
          certificateUrl: data.certificateUrl,
        });
      } else {
        await CreateCourseAchievement({
          userId: data.userId,
          courseId: data.courseId,
          certificateUrl: data.certificateUrl,
        });
      }
      await fetchData();
      reset();
      setShowForm(false);
      setIsEditing(false);
      setCurrentAchievement(null);
      setCertificatePreview(null);
    } catch (err) {
      setError(err.message || 'Failed to save achievement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (achievement) => {
    setCurrentAchievement(achievement);
    setIsEditing(true);
    setShowForm(true);
    setCertificatePreview(achievement.certificateUrl || null);
    reset({
      userId: achievement.user,
      courseId: achievement.courseId,
      certificateUrl: achievement.certificateUrl,
    });
  };

  const handleDownload = (achievement) => {
    if (achievement.certificateUrl) {
      const link = document.createElement('a');
      link.href = achievement.certificateUrl;
      link.download = `${(achievement.courseTitle || 'certificate').replace(/\s+/g, '_')}_certificate.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCancel = () => {
    reset();
    setShowForm(false);
    setIsEditing(false);
    setCurrentAchievement(null);
    setError(null);
    setCertificatePreview(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Manage Course Certificates</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            disabled={isLoading}
          >
            Create Course Certificate
          </button>
        )}
      </div>

      {isLoading && (
        <div className="text-center text-gray-500">Loading...</div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Course Certificate' : 'Create Course Certificate'}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                User *
              </label>
              <select
                id="userId"
                {...register('userId', { required: 'User is required' })}
                className={`w-full px-3 py-2 border rounded-md border-gray-300 ${errors.userId ? 'border-red-500' : ''}`}
                disabled={isLoading || isEditing}
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.username || 'Unknown'}
                  </option>
                ))}
              </select>
              {errors.userId && <p className="text-red-500 text-sm mt-1">{errors.userId.message}</p>}
            </div>

            <div>
              <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                Course *
              </label>
              <select
                id="courseId"
                {...register('courseId', { required: 'Course is required' })}
                className={`w-full px-3 py-2 border rounded-md border-gray-300 ${errors.courseId ? 'border-red-500' : ''}`}
                disabled={isLoading || isEditing}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title || 'Unknown Course'}
                  </option>
                ))}
              </select>
              {errors.courseId && <p className="text-red-500 text-sm mt-1">{errors.courseId.message}</p>}
            </div>

            <div>
              <label htmlFor="certificateFile" className="block text-sm font-medium text-gray-700 mb-1">
                Certificate Image *
              </label>
              <input
                id="certificateFile"
                type="file"
                accept="image/*"
                onChange={handleCertificateUpload}
                className={`w-full px-3 py-2 border rounded-md border-gray-300 file:bg-green-600 file:text-white file:border-none file:px-4 file:py-2 file:rounded ${errors.certificateUrl ? 'border-red-500' : ''}`}
                disabled={isLoading || certificateLoading}
                aria-label="Certificate Image"
                aria-describedby={errors.certificateUrl ? 'certificate-error' : undefined}
              />
              <input
                type="hidden"
                {...register('certificateUrl', { required: 'Certificate image is required' })}
              />
              {errors.certificateUrl && (
                <p id="certificate-error" className="text-red-500 text-sm mt-1">
                  {errors.certificateUrl.message}
                </p>
              )}
              {certificateLoading && (
                <div className="mt-2 flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 text-green-600 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </div>
              )}
              {certificatePreview && (
                <div className="mt-4">
                  <p className="mb-1 text-sm text-gray-600">Certificate Preview</p>
                  <div className="relative w-40 h-40 rounded-md overflow-hidden">
                    <img
                      src={certificatePreview}
                      alt="Certificate Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading || certificateLoading}
              >
                {isEditing ? 'Update' : 'Create'} Certificate
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isLoading || certificateLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {achievements.length === 0 && !isLoading ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
          No course certificates yet. Click "Create Course Certificate" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div key={achievement._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {achievement.certificateUrl ? (
                <img
                  src={achievement.certificateUrl}
                  alt={`${achievement.courseTitle || 'Certificate'}`}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Certificate Image
                </div>
              )}
              <div className="p-5">
                <h3 className="text-lg font-semibold">{achievement.courseTitle || 'Unknown Course'}</h3>
                <p className="text-gray-600">Awarded to: {achievement.username || 'Unknown'}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(achievement)}
                    className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-green-50 transition-colors duration-200"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828l-5.657-5.657a2 2 0 112.828-2.828l2.829 2.829" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDownload(achievement)}
                    className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-green-50 transition-colors duration-200"
                    title="Download"
                    disabled={!achievement.certificateUrl}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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
};

export default AdminAchievements;