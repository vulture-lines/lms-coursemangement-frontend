import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const AdminNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Mock data for demo
  useEffect(() => {
    const mockNotifications = [
      {
        _id: "6805e88d86355dc131e80512",
        title: "New Lecture",
        message: "Join the live session at 6PM",
        type: "announcement",
        readBy: [],
        createdAt: "2025-04-21T06:41:17.975Z",
        isRead: false
      },
      {
        _id: "6805eade86355dc131e80527",
        title: "System Maintenance",
        message: "The system will be down for maintenance tomorrow from 2AM to 4AM",
        type: "alert",
        readBy: [],
        createdAt: "2025-04-20T12:30:45.675Z",
        isRead: true
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const newNotification = {
        _id: Math.random().toString(36).substr(2, 9),
        ...data,
        readBy: [],
        createdAt: new Date().toISOString(),
        isRead: false
      };
      setNotifications([newNotification, ...notifications]);
      reset();
      setShowForm(false);
    } catch (err) {
      setError(err.message || "Failed to save notification");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    setIsLoading(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      setNotifications(notifications.map(notification => 
        notification._id === id ? { ...notification, isRead: true } : notification
      ));
    } catch (err) {
      setError(err.message || "Failed to mark notification as read");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setShowForm(false);
    setError(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Manage Notifications</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm sm:text-base"
            disabled={isLoading}
          >
            Create Notification
          </button>
        )}
      </div>

      {isLoading && (
        <div className="text-center text-gray-500 text-sm sm:text-base">Loading...</div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 sm:mb-8 text-sm sm:text-base">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Create New Notification</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                id="title"
                type="text"
                {...register("title", { required: "Title is required" })}
                className={`w-full px-3 py-2 border rounded-md text-sm sm:text-base ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isLoading}
              />
              {errors.title && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                rows={4}
                {...register("message", { required: "Message is required" })}
                className={`w-full px-3 py-2 border rounded-md text-sm sm:text-base ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isLoading}
              />
              {errors.message && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                id="type"
                {...register("type", { required: "Type is required" })}
                className={`w-full px-3 py-2 border rounded-md text-sm sm:text-base ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isLoading}
              >
                <option value="">Select type</option>
                <option value="announcement">Announcement</option>
                <option value="alert">Alert</option>
                <option value="reminder">Reminder</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                disabled={isLoading}
              >
                Create Notification
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm sm:text-base"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {notifications.length === 0 && !isLoading ? (
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center text-gray-500 text-sm sm:text-base">
            No notifications yet. Click "Create Notification" to add one.
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification._id} 
              className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${
                notification.type === 'alert' ? 'border-red-500' : 
                notification.type === 'reminder' ? 'border-yellow-500' : 'border-green-500'
              }`}
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <div className="mb-3 sm:mb-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">{notification.title}</h2>
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                      notification.type === 'alert' ? 'bg-red-100 text-red-800' : 
                      notification.type === 'reminder' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }">
                      {notification.type}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification._id)}
                      className="p-2 text-gray-500 hover:text-green-600"
                      title="Mark as read"
                      disabled={isLoading}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <p className="text-gray-600 my-3 sm:my-4 text-sm sm:text-base">{notification.message}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm text-gray-500 border-t pt-3 mt-3">
                  <div className="mb-2 sm:mb-0">
                    <span className={`inline-flex items-center ${
                      notification.isRead ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {notification.isRead ? (
                        <>
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Read
                        </>
                      ) : 'Unread'}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm">
                    <span>Posted on {formatDate(notification.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotification;