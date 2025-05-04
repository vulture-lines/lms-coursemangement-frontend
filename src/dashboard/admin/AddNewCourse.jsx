import React, { useEffect, useState } from "react";
import axios from "axios";
// import Nolesson from "../../Assets/Images/no-lesson-illustration.svg";
import { useLocation, useNavigate, useParams } from "react-router";

// import Trash from "../../Assets/Images/trash.png";
// import EditImg from "../../Assets/Images/edit.png";
import NewLesson from "./NewLesson";
// import { addnewCourse } from "../../../api/baseApi";
// import { convertToCourseFormData } from "../../../hooks/newCourseFunctions";

import NoLesson from "../../assets/no-lesson-illustration.svg";
import { Edit, Trash } from "lucide-react";
import { convertToCourseFormData } from "../../hook/CourseFunction";
import { AddNewCourseApi, GetCourseById, UploadFile } from "../../service/api";
const UserInfo = JSON.parse(localStorage.getItem("loginData"));

const AddNewCourse = () => {
  const [currentWhatYouGet, setCurrentWhatYouGet] = useState({
    title: "",
    description: "",
    updateIndex: null,
  });
  const [currentWhoIsThisFor, setCurrentWhoIsThisFor] = useState({
    text: "",
    updateIndex: null,
  });
  // console.log(currentWhatYouGet,currentWhoIsThisFor);

  const handleInputChange = (section, type, value) => {
    setError(null);
    if (section === "whatYouGet") {
      setCurrentWhatYouGet({ ...currentWhatYouGet, [type]: value });
    } else if (section === "whoIsThisFor") {
      setCurrentWhoIsThisFor({ ...currentWhoIsThisFor, text: value });
    }
  };

  const addNewItem = (section) => {
    if (
      section === "whatYouGet" &&
      currentWhatYouGet.title &&
      currentWhatYouGet.description
    ) {
      const newItems = [...courseData.whatYouGet];
      if (currentWhatYouGet.updateIndex === null) {
        newItems.push({ ...currentWhatYouGet, updateIndex: newItems.length });
      } else {
        newItems[currentWhatYouGet.updateIndex] = { ...currentWhatYouGet };
      }
      setCourseData({ ...courseData, whatYouGet: newItems });
      setCurrentWhatYouGet({ title: "", description: "", updateIndex: null });
    } else if (section === "whoIsThisFor" && currentWhoIsThisFor.text) {
      const newItems = [...courseData.whoIsThisFor];
      if (currentWhoIsThisFor.updateIndex === null) {
        newItems.push({ ...currentWhoIsThisFor, updateIndex: newItems.length });
      } else {
        newItems[currentWhoIsThisFor.updateIndex] = { ...currentWhoIsThisFor };
      }
      setCourseData({ ...courseData, whoIsThisFor: newItems });
      setCurrentWhoIsThisFor({ text: "", updateIndex: null });
    }
  };

  const removeItem = (section, index) => {
    const newItems = [...courseData[section]];
    newItems.splice(index, 1);
    const updatedItems = newItems.map((item, idx) => ({
      ...item,
      updateIndex: idx,
    }));
    setCourseData({ ...courseData, [section]: updatedItems });
  };

  const setEditValues1 = (section, item, index) => {
    if (section === "whatYouGet") {
      setCurrentWhatYouGet({ ...item, updateIndex: index });
    } else if (section === "whoIsThisFor") {
      setCurrentWhoIsThisFor({ ...item, updateIndex: index });
    }
  };

  const { courseId } = useParams();
  const [courseContentDetailsData, setCourseContentDetailsData] = useState({});
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [fetchError, setFetchError] = useState(false);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [popupOpen, setPopupOpen] = useState({ open: false, data: null });
  const [currentOverview, setCurrentOverview] = useState({
    heading: "",
    content: "",
    updateIndex: null,
  });

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail: null,
    overviewPoints: [],
    lessons: [],
    whatYouGet: [],
    whoIsThisFor: [],
    // mentor: UserInfo?.user._id,
    // mentorName: UserInfo?.user.username,
  });

  console.log(courseData);

  useEffect(() => {
    if (popupOpen.open) window.scrollTo(0, 0);
  }, [popupOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

        // const response = await axios.get(
        //   `${apiBaseUrl}/courseDetail/${courseId}`
        // );
        const response = await GetCourseById(courseId);
        setCourseContentDetailsData(response.data);
        // console.log(response.data.price);
        setIsLoading(false);
        setFetchError(false);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setIsLoading(false);
        setFetchError(true);
      }
    };

    fetchData();
  }, []);

  const validateCourse = () => {
    if (!courseData.title.trim()) return "Course title is required";
    if (!courseData.description.trim()) return "Course description is required";
    const numericPrice = parseFloat(courseData.price);
    if (isNaN(numericPrice) || numericPrice <= 0)
      return "Valid price is required";
    if (courseData.lessons.length === 0)
      return "At least one lesson is required";
    return null;
  };

  const handledirectInput = (type, value) => {
    setError(null);
    if (type === "price") {
      // Ensure price is stored as a number
      const numericValue = parseFloat(value);
      setCourseData({
        ...courseData,
        [type]: isNaN(numericValue) ? "" : numericValue,
      });
    } else {
      setCourseData({ ...courseData, [type]: value });
    }
  };

  const handleOverviewInput = (type, value) => {
    setError(null);
    setCurrentOverview({ ...currentOverview, [type]: value });
  };

  const addNewOverview = () => {
    if (currentOverview.heading && currentOverview.content) {
      const newOverview = [...courseData.overviewPoints];
      if (currentOverview.updateIndex === null) {
        newOverview.push({
          heading: currentOverview.heading,
          content: currentOverview.content,
          updateIndex: newOverview.length > 0 ? newOverview.length : 0,
        });
      } else {
        newOverview[currentOverview.updateIndex] = {
          heading: currentOverview.heading,
          content: currentOverview.content,
          updateIndex: currentOverview.updateIndex,
        };
      }
      setCourseData({ ...courseData, overviewPoints: newOverview });
      setCurrentOverview({
        heading: "",
        content: "",
        updateIndex: null,
      });
    }
  };

  const handleRemoveOverview = (index) => {
    const newOverviews = [...courseData.overviewPoints];
    newOverviews.splice(index, 1);
    const updatedOverviews = newOverviews.map((overview, idx) => ({
      ...overview,
      updateIndex: idx,
    }));
    setCourseData({ ...courseData, overviewPoints: updatedOverviews });
  };

  const setEditValues = (overview, index) => {
    setCurrentOverview({
      heading: overview.heading,
      content: overview.content,
      updateIndex: index,
    });
  };

  const addLessontoCourse = (lesson) => {
    const newLessons = [...courseData.lessons];
    if (lesson.updateIndex === null) {
      newLessons.push({
        ...lesson,
        updateIndex: newLessons.length > 0 ? newLessons.length : 0,
      });
    } else {
      newLessons[lesson.updateIndex] = lesson;
    }
    setCourseData({ ...courseData, lessons: newLessons });
    setPopupOpen({ open: false, data: null });
  };

  const removeLessonFromCourse = (lesson) => {
    const newLessons = [...courseData.lessons];
    newLessons.splice(lesson.updateIndex, 1);
    const updatedLessons = newLessons.map((lesson, idx) => ({
      ...lesson,
      updateIndex: idx,
    }));
    setCourseData({ ...courseData, lessons: updatedLessons });
    setPopupOpen({ open: false, data: null });
  };

  const HandleThumbnail = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const res = await UploadFile(formData);
    console.log(res);
    setCourseData({ ...courseData, thumbnail: res.data.fileUrl });
  };

  // const HandleThumbnail = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   // Basic validation
  //   if (!file.type.startsWith("image/")) {
  //     alert("Please select a valid image file.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("file", file);

  //   try {
  //     // setLoading(true); // Optional: show a loading spinner
  //     const res = await UploadFile("file", formData);

  //     if (res?.data?.fileUrl) {
  //       setCourseData((prev) => ({
  //         ...prev,
  //         thumbnail: res.data.fileUrl,
  //       }));
  //     } else {
  //       throw new Error("Invalid response from server.");
  //     }
  //   } catch (error) {
  //     console.error("Thumbnail upload failed:", error);
  //     alert("Failed to upload thumbnail. Please try again.");
  //   } finally {
  //     setLoading(false); // Optional: hide loading spinner
  //   }
  // };

  const uploadCourse = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const validationError = validateCourse();
      if (validationError) {
        setError(validationError);
        return;
      }

      // const courseFormData = convertToCourseFormData(courseData);
      // const response = await AddNewCourseApi(courseFormData);
      const response = await AddNewCourseApi(courseData);

      console.log(response); // Log the full response object
      console.log(response.data); // Log just the data part

      // Update this condition to check for newCourse instead of course
      if (response.data?.newCourse) {
        navigate("/admin");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error(
        "Error creating course:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.details ||
          error.response?.data?.message ||
          error.message ||
          "Failed to create course. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      // className={`course-list-cnt ${
      //   popupOpen.open ? "overflow-hidden" : "overflow-scroll"
      // } new-course`}
      className="p-4"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold">Create New Course</h3>
          <p className="text-gray-600">Create new course and lets publish</p>
        </div>

        {error && <div className="text-red-500 my-2">{error}</div>}

        <div className="flex space-x-4">
          <div
            className="bg-red-100 text-red-700 px-4 py-2 rounded cursor-pointer"
            onClick={() => navigate("/admin/courses")}
          >
            Cancel
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={uploadCourse}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Course"}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Form */}
        <form className="w-full md:w-2/3 space-y-6">
          {/* Title */}
          <div>
            <p className="mb-1">Enter course Name</p>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={courseData.title}
              onChange={(e) => handledirectInput("title", e.target.value)}
              placeholder="Course Title"
            />
          </div>

          {/* Description */}
          <div>
            <p className="mb-1">Describe course</p>
            <textarea
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={courseData.description}
              onChange={(e) => handledirectInput("description", e.target.value)}
              placeholder="Course Description"
            />
          </div>

          {/* Price & Thumbnail */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <p className="mb-1">Enter course price</p>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-4 py-2"
                value={courseData.price || ""}
                placeholder="₹"
                onChange={(e) => handledirectInput("price", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <p className="mb-1">Upload course thumbnail</p>
              <input
                type="file"
                accept="image/*"
                // onChange={(e) =>
                //   setCourseData({ ...courseData, thumbnail: e.target.files[0] })
                // }
                onChange={HandleThumbnail}
                className="w-full bg-green-600 text-white px-4 py-2"
              />
            </div>
          </div>

          {/* Overview Points */}
          {/* <div>
            <p className="mb-2 font-semibold">Overview Points</p>
            <div className="flex flex-col md:flex-row gap-2 mb-4 items-start">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded px-4 py-2"
                value={currentOverview.heading}
                placeholder="Heading"
                onChange={(e) => handleOverviewInput("heading", e.target.value)}
              />
              <textarea
                className="flex-1 border border-gray-300 rounded px-4 py-2"
                placeholder="Description"
                value={currentOverview.content}
                onChange={(e) => handleOverviewInput("content", e.target.value)}
              />
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={addNewOverview}
                type="button"
              >
                Add
              </button>
            </div>

            {courseData.overviewPoints.map((overview, index) => (
              <div
                className="mb-4 border border-gray-200 p-4 rounded"
                key={index}
              >
                <div className="flex justify-between items-center">
                  <p className="font-bold">{overview.heading}</p>
                  <div className="flex space-x-2">
                   
                    <Trash
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => handleRemoveOverview(index)}
                    />
                    <Edit
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => setEditValues(overview, index)}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-700">{overview.content}</p>
              </div>
            ))}
          </div> */}

          {/* What You Get */}
          {/* <div>
            <p className="mb-2 font-semibold">What You Get</p>
            <div className="flex flex-col md:flex-row gap-2 mb-4 items-start">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded px-4 py-2"
                value={currentWhatYouGet.title}
                placeholder="Title"
                onChange={(e) =>
                  handleInputChange("whatYouGet", "title", e.target.value)
                }
              />
              <textarea
                className="flex-1 border border-gray-300 rounded px-4 py-2"
                placeholder="Description"
                value={currentWhatYouGet.description}
                onChange={(e) =>
                  handleInputChange("whatYouGet", "description", e.target.value)
                }
              />
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => addNewItem("whatYouGet")}
                type="button"
              >
                Add
              </button>
            </div>

            {courseData.whatYouGet.map((item, index) => (
              <div
                className="mb-4 border border-gray-200 p-4 rounded"
                key={index}
              >
                <div className="flex justify-between items-center">
                  <p className="font-bold">{item.title}</p>
                  <div className="flex space-x-2">
                    
                    <Trash
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => removeItem("whatYouGet", index)}
                    />
                    <Edit
                      className="w-5 h-5 cursor-pointer"
                      onClick={() => setEditValues1("whatYouGet", item, index)}
                    />
                   
                  </div>
                </div>
                <p className="text-sm text-gray-700">{item.description}</p>
              </div>
            ))}

          
            <p className="mt-6 mb-2 font-semibold">Who Is This For</p>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded px-4 py-2"
                value={currentWhoIsThisFor.text}
                placeholder="Content"
                onChange={(e) =>
                  handleInputChange("whoIsThisFor", "text", e.target.value)
                }
              />
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={() => addNewItem("whoIsThisFor")}
                type="button"
              >
                Add
              </button>
            </div>

            {courseData.whoIsThisFor.map((item, index) => (
              <div
                className="mb-4 border border-gray-200 p-4 rounded"
                key={index}
              >
                <div className="flex justify-between items-center">
                  <p>{item.text}</p>
                  <div className="flex space-x-2">
                    <Trash
                      className="cursor-pointer w-5 h-5"
                      onClick={() => removeItem("whoIsThisFor", index)}
                    />
                    <Edit
                      className="cursor-pointer w-5 h-5"
                      onClick={() =>
                        setEditValues1("whoIsThisFor", item, index)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        </form>

        {/* Right Side Lesson Form */}
        <form className="w-full md:w-1/2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">List The Lessons</h3>
            <div
              className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
              onClick={() => setPopupOpen({ open: true, data: null })}
            >
              Add new lesson
            </div>
          </div>

          <div className="space-y-4 overflow-auto">
            {courseData.lessons.length > 0 ? (
              courseData.lessons.map((lesson, index) => (
                <div
                  key={index}
                  className="border p-4 rounded cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    setPopupOpen({
                      open: true,
                      data: { ...lesson, updateIndex: index },
                    })
                  }
                >
                  <h1 className="text-lg font-semibold">Lesson {index + 1}</h1>
                  <h3 className="text-md font-medium">{lesson.title}</h3>
                  <ul className="list-disc pl-5 mt-2 overflow-auto h-[500px]">
                    {lesson.sublessons?.map((sublesson, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {sublesson.title} —{" "}
                        <span className="italic">
                          duration: {sublesson.duration}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="flex justify-center">
                <img
                  src={NoLesson}
                  alt="no-lesson"
                  className=" inset-0 object-fill"
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Pop-up component rendering if needed */}
      {popupOpen.open && (
        <NewLesson
          addLesson={addLessontoCourse}
          editData={popupOpen.data}
          cancel={() => setPopupOpen({ open: false, data: null })}
          removeThisLesson={removeLessonFromCourse}
        />
      )}
    </div>
  );
};

export default AddNewCourse;
