import axios from "axios";

const baseUrl = "https://law-lms.onrender.com";
const Token = JSON.parse(localStorage.getItem("loginData"));
// console.log(Token.token);

axios.defaults.headers.common["Authorization"] = `Bearer ${Token?.token}`;

// =================================  Authentication section ========================

// Register
export const AuthRegister = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/api/auth/signup`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// Login
export const AuthLogin = async (data) => {
  try {
    const res = await axios.post(`${baseUrl}/api/auth/login`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// logout
export const Logout = async () => {
  try {
    const res = await axios.post(`${baseUrl}/api/auth/logout`);
    localStorage.clear();
    return res.data.message;
  } catch (error) {
    console.log(error);
  }
};

// =================================  Authentication section ========================
//
//
//
//
// =================================  user section ========================
// Get all users
export const GetAllUsers = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/users`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message || error.message || "Failed to fetch users"
    );
  }
};

// Update user by ID
export const UpdateUserById = async (userId, userData) => {
  try {
    const res = await axios.put(`${baseUrl}/api/users/${userId}`, userData);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message || error.message || "Failed to update user"
    );
  }
};

// Update user approval status
export const UpdateUserApproval = async (userId, isApproved) => {
  try {
    const res = await axios.put(`${baseUrl}/api/users/approve/${userId}`, {
      isApproved,
    });
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to update approval status"
    );
  }
};

// Delete user by ID
export const DeleteUserById = async (userId) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/users/${userId}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message || error.message || "Failed to delete user"
    );
  }
};
// =================================  user section ========================
//
//
//
//
// =================================  course section ========================

// Get all courses
export const GetAllCourses = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/courses`);
    return res.data;
  } catch (error) {
    console.error("Error fetching all courses:", error);
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch courses"
    );
  }
};

// Get all courses by id
export const GetCourseById = async (id) => {
  try {
    if (!id) throw new Error("Course ID is required");
    const res = await axios.get(`${baseUrl}/api/courses/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching course with ID ${id}:`, error);
    throw (
      error.response?.data?.message || error.message || "Failed to fetch course"
    );
  }
};
// Add new course
export const AddNewCourseApi = async (courseData) => {
  try {
    const res = await axios.post(`${baseUrl}/api/courses`, courseData);
    return res.data;
  } catch (error) {
    console.error("Error adding new course:", error);
    throw (
      error.response?.data?.message || error.message || "Failed to add course"
    );
  }
};

// Update course by id
export const UpdateCourseById = async (courseData, id) => {
  try {
    const res = await axios.put(`${baseUrl}/api/courses/${id}`, courseData);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to update course"
    );
  }
};

// Delete course by id
export const DeleteCourseById = async (id) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/courses/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error deleting course with ID ${id}:`, error);
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to delete course"
    );
  }
};

// Create Course Enrollment
export const CreateCourseEnrollment = async ({ courseId }) => {
  try {
    const res = await axios.post(`${baseUrl}/api/enrollments/${courseId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data?.message;
  }
};
// Get Course Enrollment
export const GetCourseEnrollment = async ({ userId }) => {
  try {
    const res = await axios.get(`${baseUrl}/api/enrollments/${userId}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data?.message;
  }
};

// Update Course Enrollment
export const UpdateCourseEnrollment = async ({ userId, courseId }) => {
  try {
    const res = await axios.put(
      `${baseUrl}/api/enrollments/${userId}/${courseId}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data?.message;
  }
};

// Course Progress post method
export const CourseProgressPost = async ({ userId, courseId, payload }) => {
  try {
    const res = await axios.post(
      `${baseUrl}/api/courseProgress/${userId}/${courseId}`,
      payload
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data?.message;
  }
};

// Course Progress Get method
export const CourseProgressGet = async ({ userId, courseId }) => {
  try {
    const res = await axios.get(
      `${baseUrl}/api/courseProgress/${userId}/${courseId}`
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return error.response?.data?.message;
  }
};
// =================================  course section ========================
//
//
//
//
// =================================  Upload file section ========================
// without type
export const UploadFile = async (file) => {
  try {
    const res = await axios.post(`${baseUrl}/api/upload`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res.data);

    if (res.status === 200) {
      return res;
    }
  } catch (error) {
    console.log(error);
    return error.message;
  }
};
// with type
export const UploadFileWithType = async (file) => {
  try {
    const res = await axios.post(
      `https://z-backend-2xag.onrender.com/api/upload/type`,
      file,
      {
        // const res = await axios.post(`${baseUrl}/api/upload/type`, file, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(res.data);

    if (res.status === 200) {
      return res;
    }
  } catch (error) {
    console.log(error);
    return error?.response?.data?.message || error.message || "Upload failed";
  }
};
// =================================  Upload file section ========================

// =================================  Upload file section ========================
//
//
//
//
//
//
//
//
//// ================================= Announcement section ========================

// Create announcement
export const CreateAnnouncement = async (announcementData) => {
  try {
    const res = await axios.post(
      `${baseUrl}/api/announcements`,
      announcementData
    );
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to create announcement"
    );
  }
};

// Get all announcements
export const GetAllAnnouncements = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/announcements/all`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch announcements"
    );
  }
};

// Get announcement by ID
export const GetAnnouncementById = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/api/announcements/${id}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch announcement"
    );
  }
};

// Update announcement
export const UpdateAnnouncement = async (id, updateData) => {
  try {
    const res = await axios.put(
      `${baseUrl}/api/announcements/${id}`,
      updateData
    );
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to update announcement"
    );
  }
};

// ================================= Announcement section ========================
//
// =================================  forum section ========================

// Add forum post
export const addFormPost = async (post) => {
  try {
    const res = await axios.post(`${baseUrl}/api/forum`, post, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to add forum post"
    );
  }
};

// Get all forum posts
export const getAllFormPost = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/forum`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch forum posts"
    );
  }
};

// Get forum post by ID
export const getFormPost = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/api/forum/${id}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch forum post"
    );
  }
};

// Edit forum post
export const editFormPost = async (id, post) => {
  try {
    const res = await axios.put(`${baseUrl}/api/forum/${id}`, post, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to edit forum post"
    );
  }
};

// Add forum post reply
export const addFormPostComment = async (id, payload) => {
  try {
    const res = await axios.post(`${baseUrl}/api/forum/${id}/reply`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message || error.message || "Failed to add reply"
    );
  }
};

// Update reply
export const updateFormCommentReply = async (postId, replyId, payload) => {
  try {
    const res = await axios.put(
      `${baseUrl}/api/forum/${postId}/reply/${replyId}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message || error.message || "Failed to update reply"
    );
  }
};

// Like forum post
export const likeForumPost = async (postId) => {
  try {
    const res = await axios.put(`${baseUrl}/api/forum/${postId}/like`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to like forum post"
    );
  }
};

// Delete forum post
export const deleteForumPost = async (postId) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/forum/${postId}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to delete forum post"
    );
  }
};

// =================================  forum section ========================

// ================================= Calendar section ========================

// Create calendar event
export const CreateCalendarEvent = async (eventData) => {
  try {
    const res = await axios.post(`${baseUrl}/api/calender`, eventData);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to create calendar event"
    );
  }
};

// Get all calendar events
export const GetAllCalendarEvents = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/calender`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch calendar events"
    );
  }
};

// Get calendar event by ID
export const GetCalendarEventById = async (id) => {
  try {
    const res = await axios.get(`${baseUrl}/api/calender/${id}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch calendar event"
    );
  }
};

// Update calendar event by ID
export const UpdateCalendarEventById = async (id, eventData) => {
  try {
    const res = await axios.put(`${baseUrl}/api/calender/${id}`, eventData);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to update calendar event"
    );
  }
};

// Delete calendar event by ID
export const DeleteCalendarEventById = async (id) => {
  try {
    const res = await axios.delete(`${baseUrl}/api/calender/${id}`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to delete calendar event"
    );
  }
};

// ================================= Calendar section ========================

// ================================= Query Section ========================

// Get all queries
export const GetAllQueries = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/queries`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch queries"
    );
  }
};

// Create a new query/ticket
export const CreateQuery = async (queryData) => {
  try {
    const res = await axios.post(`${baseUrl}/api/queries`, queryData);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message || error.message || "Failed to create query"
    );
  }
};

// ================================= Query Section ========================

// ================================= Notification Section ========================

// Get all notifications
export const GetAllNotifications = async () => {
  try {
    const res = await axios.get(`${baseUrl}/api/notifications`);
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch notifications"
    );
  }
};

// Mark notification as read
export const MarkNotificationAsRead = async (id) => {
  try {
    const res = await axios.put(`${baseUrl}/api/notifications/${id}`, {
      isRead: true,
    });
    return res.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.message ||
      "Failed to mark notification as read"
    );
  }
};

// ================================= Notification Section ========================
