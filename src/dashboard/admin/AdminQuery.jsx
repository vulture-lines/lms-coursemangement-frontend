import React, { useState, useEffect } from 'react';

// Mock API functions (unchanged)
const mockTickets = [
  {
    _id: "68073b03f9630252a3e1f087",
    raisedBy: "Saran T",
    title: "Doubt in topic X",
    issue: "I didn't understand the concept",
    status: "confirmed",
    requestMessage: "resateasoj",
    requestedDate: "2025-02-21",
    scheduledDate: "2025-02-20",
    time: "11:25",
    meetingLink: "https://meet.google.com/rdj-fmkb-huk",
    purpose: "fcbgcbvcb"
  },
  {
    _id: "68073b03f9630252a3e1f088",
    raisedBy: "Saran TG",
    title: "Issue with assignment Y",
    issue: "Need clarification on submission process",
    status: "confirmed",
    requestMessage: "-",
    requestedDate: "-",
    scheduledDate: "2025-02-20",
    time: "11:25",
    meetingLink: "https://meet.google.com/rdj-fmkb-huk",
    purpose: "dzf"
  },
  {
    _id: "68073b03f9630252a3e1f089",
    raisedBy: "Saran T",
    title: "Another question",
    issue: "Need help with project",
    status: "confirmed",
    requestMessage: "-",
    requestedDate: "-",
    scheduledDate: "2025-02-21",
    time: "15:25",
    meetingLink: "https://meet.google.com/rdj-fmkb-huk",
    purpose: "dfdgd"
  },
  {
    _id: "68073b03f9630252a3e1f090",
    raisedBy: "Saran TG",
    title: "Request for extension",
    issue: "I need more time",
    status: "pending",
    requestMessage: "drgrd",
    requestedDate: "2025-03-14",
    scheduledDate: "Not Scheduled",
    time: "Not Set",
    meetingLink: "No Link",
    purpose: "-"
  },
  {
    _id: "68073b03f9630252a3e1f091",
    raisedBy: "Test",
    title: "Test request",
    issue: "Testing system",
    status: "pending",
    requestMessage: "Test",
    requestedDate: "2000-10-10",
    scheduledDate: "Not Scheduled",
    time: "Not Set",
    meetingLink: "No Link",
    purpose: "-"
  }
];

const AdminQuery = () => {
  const [meetings, setMeetings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    raisedBy: '',
    requestMessage: '',
    requestedDate: '',
    scheduledDate: '',
    time: '',
    meetingLink: '',
    purpose: ''
  });

  // Fetch all meetings (unchanged)
  useEffect(() => {
    const fetchMeetings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await new Promise(resolve => setTimeout(() => resolve(mockTickets), 500));
        setMeetings(data);
      } catch (err) {
        setError(err.message || "Failed to load meetings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const saveData = async () => {
      try {
        if (isEditing && currentMeeting) {
          const updatedMeeting = {
            ...currentMeeting,
            ...formData,
            status: formData.scheduledDate && formData.scheduledDate !== "Not Scheduled" ? "confirmed" : "pending"
          };
          await new Promise(resolve => setTimeout(resolve, 500));
          setMeetings(meetings.map(meeting => 
            meeting._id === updatedMeeting._id ? updatedMeeting : meeting
          ));
        } else {
          const newMeeting = {
            _id: Math.random().toString(36).substr(2, 9),
            ...formData,
            status: formData.scheduledDate && formData.scheduledDate !== "Not Scheduled" ? "confirmed" : "pending"
          };
          await new Promise(resolve => setTimeout(resolve, 500));
          setMeetings([...meetings, newMeeting]);
        }
        resetForm();
      } catch (err) {
        setError(err.message || "Failed to save meeting");
      } finally {
        setIsLoading(false);
      }
    };
    
    saveData();
  };

  const resetForm = () => {
    setFormData({
      raisedBy: '',
      requestMessage: '',
      requestedDate: '',
      scheduledDate: '',
      time: '',
      meetingLink: '',
      purpose: ''
    });
    setShowForm(false);
    setIsEditing(false);
    setCurrentMeeting(null);
  };

  const handleEdit = (meeting) => {
    setCurrentMeeting(meeting);
    setFormData({
      raisedBy: meeting.raisedBy,
      requestMessage: meeting.requestMessage,
      requestedDate: meeting.requestedDate,
      scheduledDate: meeting.scheduledDate === "Not Scheduled" ? "" : meeting.scheduledDate,
      time: meeting.time === "Not Set" ? "" : meeting.time,
      meetingLink: meeting.meetingLink === "No Link" ? "" : meeting.meetingLink,
      purpose: meeting.purpose === "-" ? "" : meeting.purpose
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMeetings(meetings.filter(meeting => meeting._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete meeting");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Query Management</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 text-sm sm:text-base"
          >
            Schedule Meeting
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 sm:mb-6 text-sm sm:text-base">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="text-center text-gray-500 py-4 text-sm sm:text-base">Loading...</div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            {isEditing ? 'Edit Meeting' : 'Schedule New Meeting'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  User Name
                </label>
                <input
                  type="text"
                  name="raisedBy"
                  value={formData.raisedBy}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Request Message
                </label>
                <input
                  type="text"
                  name="requestMessage"
                  value={formData.requestMessage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requested Date
                </label>
                <input
                  type="date"
                  name="requestedDate"
                  value={formData.requestedDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link
                </label>
                <input
                  type="text"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <input
                  type="text"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm sm:text-base"
                disabled={isLoading}
              >
                {isEditing ? 'Update' : 'Schedule'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm sm:text-base"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-green-500 text-white uppercase text-xs sm:text-sm">
              <th className="px-4 sm:px-6 py-3 text-left">User Name</th>
              <th className="px-4 sm:px-6 py-3 text-left">Status</th>
              <th className="px-4 sm:px-6 py-3 text-left">Request Message</th>
              <th className="px-4 sm:px-6 py-3 text-left">Requested Date</th>
              <th className="px-4 sm:px-6 py-3 text-left">Scheduled Date</th>
              <th className="px-4 sm:px-6 py-3 text-left">Time</th>
              <th className="px-4 sm:px-6 py-3 text-left">Meeting Link</th>
              <th className="px-4 sm:px-6 py-3 text-left">Purpose</th>
              <th className="px-4 sm:px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {meetings.length === 0 && !isLoading ? (
              <tr>
                <td colSpan="9" className="px-4 sm:px-6 py-4 text-center text-gray-500 text-sm">
                  No meetings scheduled yet.
                </td>
              </tr>
            ) : (
              meetings.map(meeting => (
                <tr key={meeting._id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 text-sm">{meeting.raisedBy}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm ${
                      meeting.status === 'confirmed' 
                        ? 'text-green-800 bg-white' 
                        : 'text-yellow-800 bg-yellow-400'
                    }`}>
                      {meeting.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm">{meeting.requestMessage}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm">{meeting.requestedDate}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm">{meeting.scheduledDate}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm">{meeting.time}</td>
                  <td className="px-4 sm:px-6 py-4 text-sm">
                    {meeting.meetingLink !== "No Link" ? (
                      <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline">
                        Open Link
                      </a>
                    ) : (
                      meeting.meetingLink
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm">{meeting.purpose}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleEdit(meeting)}
                        className="px-3 sm:px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 text-xs sm:text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(meeting._id)}
                        className="px-3 sm:px-4 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 text-xs sm:text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {meetings.length === 0 && !isLoading ? (
          <div className="text-center text-gray-500 py-4 text-sm">
            No meetings scheduled yet.
          </div>
        ) : (
          meetings.map(meeting => (
            <div key={meeting._id} className="bg-white rounded-lg shadow-md p-4">
              <div className="space-y-2">
                <div>
                  <span className="font-medium text-sm">User Name:</span> {meeting.raisedBy}
                </div>
                <div>
                  <span className="font-medium text-sm">Status:</span>
                  <span className={`ml-2 px-2 py-1 text-xs ${
                    meeting.status === 'confirmed' 
                      ? 'text-green-800 bg-white' 
                      : 'text-yellow-800 bg-yellow-400'
                  }`}>
                    {meeting.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-sm">Request Message:</span> {meeting.requestMessage}
                </div>
                <div>
                  <span className="font-medium text-sm">Requested Date:</span> {meeting.requestedDate}
                </div>
                <div>
                  <span className="font-medium text-sm">Scheduled Date:</span> {meeting.scheduledDate}
                </div>
                <div>
                  <span className="font-medium text-sm">Time:</span> {meeting.time}
                </div>
                <div>
                  <span className="font-medium text-sm">Meeting Link:</span>{' '}
                  {meeting.meetingLink !== "No Link" ? (
                    <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:underline text-sm">
                      Open Link
                    </a>
                  ) : (
                    meeting.meetingLink
                  )}
                </div>
                <div>
                  <span className="font-medium text-sm">Purpose:</span> {meeting.purpose}
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => handleEdit(meeting)}
                    className="flex-1 px-3 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(meeting._id)}
                    className="flex-1 px-3 py-2 bg-red-500 text-white font-bold rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminQuery;