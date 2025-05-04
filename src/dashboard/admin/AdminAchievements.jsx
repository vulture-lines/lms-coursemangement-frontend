import React, { useState } from 'react';

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([
    {
      _id: '680f0ad4fc34715866376cb7',
      title: 'Achievement 1',
      description: 'Completed Achievement 1',
      badge: 'gold',
      user: '680373b6c9e849266316e9da',
      username: 'ajit1',
      assignedBy: '680373b6c9e849266316e9da',
      assignedByUsername: 'ajit1',
      assignedAt: '2025-04-28T04:57:56.745Z',
      createdAt: '2025-04-28T04:57:56.746Z',
      updatedAt: '2025-04-28T04:57:56.746Z',
    },
    {
      _id: '680f0ad4fc34715866376cb8',
      title: 'Achievement 2',
      description: 'Completed Achievement 2',
      badge: 'silver',
      user: '680373b6c9e849266316e9db',
      username: 'jane_doe',
      assignedBy: '680373b6c9e849266316e9da',
      assignedByUsername: 'ajit1',
      assignedAt: '2025-04-27T10:30:00.000Z',
      createdAt: '2025-04-27T10:30:00.000Z',
      updatedAt: '2025-04-27T10:30:00.000Z',
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = { 
    register: () => {}, 
    handleSubmit: (cb) => (e) => { e.preventDefault(); cb({}); },
    reset: () => {},
    formState: { errors: {} }
  };

  // Generate a simple unique ID for demo purposes
  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Badge color mapping
  const getBadgeColor = (badge) => {
    switch (badge.toLowerCase()) {
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'bronze':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const currentDate = new Date().toISOString();
      if (isEditing && currentAchievement) {
        // Update existing achievement
        const updatedAchievement = {
          ...currentAchievement,
          ...data,
          updatedAt: currentDate,
        };
        setAchievements(achievements.map((achievement) =>
          achievement._id === updatedAchievement._id ? updatedAchievement : achievement
        ));
      } else {
        // Create new achievement
        const newAchievement = {
          _id: generateId(),
          ...data,
          user: data.userId,
          username: 'demo_user', // Static demo username
          assignedBy: '68033770c2c0584a3b4af07e',
          assignedByUsername: 'admin',
          assignedAt: currentDate,
          createdAt: currentDate,
          updatedAt: currentDate,
        };
        setAchievements([newAchievement, ...achievements]);
      }
      reset();
      setShowForm(false);
      setIsEditing(false);
      setCurrentAchievement(null);
    } catch (err) {
      setError('Failed to save achievement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (achievement) => {
    setCurrentAchievement(achievement);
    // Here you could implement a modal or other view functionality
    alert(`Viewing Achievement:\nTitle: ${achievement.title}\nDescription: ${achievement.description}`);
  };

  const handleDownload = (achievement) => {
    // Create a downloadable version of the achievement
    const achievementData = {
      Title: achievement.title,
      Description: achievement.description,
      Badge: achievement.badge,
      'Assigned To': achievement.username,
      'Assigned By': achievement.assignedByUsername,
      'Assigned At': formatDate(achievement.assignedAt)
    };
    
    const blob = new Blob([JSON.stringify(achievementData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${achievement.title.replace(/\s+/g, '_')}_achievement.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCancel = () => {
    reset();
    setShowForm(false);
    setIsEditing(false);
    setCurrentAchievement(null);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Manage Achievements</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            disabled={isLoading}
          >
            Create Certificate
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
            {isEditing ? 'Edit Achievement' : 'Create New Achievement'}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 border rounded-md border-gray-300"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 border rounded-md border-gray-300"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="badge" className="block text-sm font-medium text-gray-700 mb-1">
                Badge *
              </label>
              <select
                id="badge"
                className="w-full px-3 py-2 border rounded-md border-gray-300"
                disabled={isLoading}
              >
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="bronze">Bronze</option>
              </select>
            </div>

            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                User ID *
              </label>
              <input
                id="userId"
                type="text"
                className="w-full px-3 py-2 border rounded-md border-gray-300"
                disabled={isLoading}
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              >
                {isEditing ? 'Update' : 'Create'} Certificate
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {achievements.length === 0 && !isLoading ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
          No achievements yet. Click "Create Achievement" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div key={achievement._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-1">
                <div className={`${getBadgeColor(achievement.badge)} text-xs font-medium px-2.5 py-0.5 rounded-full inline-block ml-2 mt-2 border`}>
                  {achievement.badge.charAt(0).toUpperCase() + achievement.badge.slice(1)}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{achievement.title}</h3>
                <div className="h-24 overflow-hidden">
                  <p className="text-gray-600 text-sm">{achievement.description}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="truncate">{achievement.username || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="truncate">{formatDate(achievement.assignedAt)}</span>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleView(achievement)}
                    className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-green-50 transition-colors duration-200"
                    title="View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => handleDownload(achievement)}
                    className="p-2 text-gray-500 hover:text-green-600 rounded-full hover:bg-green-50 transition-colors duration-200"
                    title="Download"
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