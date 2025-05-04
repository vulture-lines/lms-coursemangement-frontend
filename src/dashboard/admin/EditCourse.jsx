import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
// import { deleteCourse, updateCourse } from "../../../api/baseApi";
import NewLesson from "./NewLesson";
// import { convertToCourseFormData } from "../../../hooks/newCourseFunctions";
import axios from "axios";
import {
  DeleteCourseById,
  GetCourseById,
  UpdateCourseById,
} from "../../service/api";
import NoLesson from "../../assets/no-lesson-illustration.svg";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { convertToCourseFormData } from "../../hook/CourseFunction";
// const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
const EditCourse = () => {
  // State for "What You Get" section
  const [currentWhatYouGet, setWhatYouGet] = useState([]);
  const [currentGet, setCurrentGet] = useState({ title: "", description: "" });
  const [editIndexGet, setEditIndexGet] = useState(null);

  // State for "Who Is This For" section
  const [whoIsThisFor, setWhoIsThisFor] = useState([]);
  const [currentWho, setCurrentWho] = useState({ text: "" });
  const [editIndexWho, setEditIndexWho] = useState(null);

  // Handle input change for "What You Get"
  const handleWhatYouGetInput = (key, value) => {
    setCurrentGet({ ...currentGet, [key]: value });
  };

  // Handle input change for "Who Is This For"
  const handleWhoIsThisForInput = (value) => {
    setCurrentWho({ text: value });
  };

  const handleAddWhoIsThisFor = (event) => {
    event.preventDefault();
    if (currentWho.text) {
      const newWhoIsThisFor = [...courseData.whoIsThisFor]; // Clone existing array

      if (editIndexWho !== null) {
        newWhoIsThisFor[editIndexWho] = { text: currentWho.text };
      } else {
        newWhoIsThisFor.push({ text: currentWho.text });
      }

      setCourseData({ ...courseData, whoIsThisFor: newWhoIsThisFor }); // Update state

      setCurrentWho({ text: "" });
      setEditIndexWho(null);
    }
  };

  // Remove "What You Get"
  const handleRemoveWhatYouGet = (index) => {
    setWhatYouGet(currentWhatYouGet.filter((_, i) => i !== index));
  };

  const handleRemoveWhoIsThisFor = (index) => {
    const updatedList = courseData.whoIsThisFor.filter((_, i) => i !== index);
    setCourseData({ ...courseData, whoIsThisFor: updatedList });
  };

  // Set edit values for "What You Get"
  const setEditValuesGet = (item, index) => {
    setCurrentGet(item);
    setEditIndexGet(index);
  };

  // Set edit values for "Who Is This For"
  const setEditValuesWho = (item, index) => {
    setCurrentWho(item);
    setEditIndexWho(index);
  };

  const addNewWhatYouGet = () => {
    if (currentGet.title && currentGet.description) {
      const newWhatYouGet = [...courseData.whatYouGet]; // Clone the existing array

      if (editIndexGet === null) {
        newWhatYouGet.push({
          title: currentGet.title,
          description: currentGet.description,
        });
      } else {
        newWhatYouGet[editIndexGet] = {
          title: currentGet.title,
          description: currentGet.description,
        };
      }

      setCourseData({ ...courseData, whatYouGet: newWhatYouGet });

      setCurrentGet({ title: "", description: "" });
      setEditIndexGet(null);
    }
  };

  const addNewWhoIsThisFor = () => {
    if (currentWho.text) {
      const newWhoIsThisFor = [...courseData.whoIsThisFor]; // Clone the existing array

      if (editIndexWho === null) {
        newWhoIsThisFor.push({
          text: currentWho.text,
        });
      } else {
        newWhoIsThisFor[editIndexWho] = {
          text: currentWho.text,
        };
      }

      setCourseData({ ...courseData, whoIsThisFor: newWhoIsThisFor });

      setCurrentWho({ text: "" });
      setEditIndexWho(null);
    }
  };
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id);

  const [popupOpen, setPopupOpen] = useState({ open: false, data: null });
  const [editCourse, setEditCourse] = useState(false);
  const [currentOverview, setCurrentOverview] = useState({
    heading: "",
    content: "",
    updateIndex: null,
  });

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: null,
    thumbnail: null,
    overviewPoints: [],
    lessons: [],
  });

  useEffect(() => {
    if (popupOpen) window.scrollTo(0, 0);
  }, [popupOpen]);

  // useEffect(() => {
  //   setCourseData(courseDetails);
  // }, [courseDetails]);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      const res = await GetCourseById(id);
      console.log("Course data", res);
      setCourseData(res);
    };
    fetchCourseDetails();
  }, [id]);

  const handledirectInput = (type, value) => {
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
    setCurrentOverview({ ...currentOverview, [type]: value });
  };

  const addNewOverview = () => {
    if (currentOverview.heading && currentOverview.content) {
      const newOverview = courseData.overviewPoints;
      if (
        currentOverview.updateIndex === null ||
        currentOverview.updateIndex === undefined
      ) {
        newOverview.push({
          ...currentOverview,
          updateIndex: newOverview.length > 0 ? newOverview?.length : 0,
        });
        setCourseData({ ...courseData, overviewPoints: newOverview });
      } else {
        newOverview[currentOverview?.updateIndex] = currentOverview;
        setCourseData({ ...courseData, overviewPoints: newOverview });
      }
      setCurrentOverview({
        heading: "",
        content: "",
        updateIndex: null,
      });
    }
  };

  const addLessontoCourse = (lesson) => {
    console.log("lesson", lesson);
    const newLessons = [...courseData.lessons];
    if (lesson?.updateIndex === null || lesson?.updateIndex === undefined) {
      newLessons.push({
        ...lesson,
        updateIndex: newLessons?.length > 0 ? newLessons?.length : 0,
      });
      setCourseData({ ...courseData, lessons: newLessons });
    } else {
      newLessons[lesson.updateIndex] = lesson;
      setCourseData({ ...courseData, lessons: newLessons });
    }
    setPopupOpen({ open: false });
  };

  const uploadCourse = async () => {
    try {
      // const courseFormData = convertToCourseFormData(courseData);
      // const data = await axios.put(
      //   `${apiBaseUrl}/courseDetail/edit/${id}`,
      //   courseFormData
      // );
      const res = await UpdateCourseById(courseData, id);
      console.log("Course updated", res);
      console.log(res);
      navigate("/admin/courses");
    } catch (error) {
      console.log(error);
    }
  };

  console.log(courseData);

  const deleteThisCourse = async () => {
    const confirm = window.confirm(
      "Confirm to delete this course. All lessons associated will be lost."
    );
    if (confirm) {
      try {
        // const res = await deleteCourse(courseDetails._id);
        const res = await DeleteCourseById(courseData._id);
        if (res) {
          navigate("/admin/courses");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleRemoveOverview = (index) => {
    const newOverviews = [...courseData?.overviewPoints];
    newOverviews.splice(index, 1);
    setCourseData({ ...courseData, overviewPoints: newOverviews });
  };

  const removeLessonFromCourse = (lesson) => {
    const newLessons = [...courseData.lessons];
    newLessons.splice(lesson.updateIndex, 1);
    console.log(newLessons);
    setCourseData({ ...courseData, lessons: newLessons });
  };

  const openEditLesson = (lesson, index) => {
    lesson.updateIndex = index;
    setPopupOpen({ open: true, data: lesson });
  };

  const setEditValues = (overview, index) => {
    overview.updateIndex = index;
    setCurrentOverview(overview);
  };

  console.log(courseData);

  return (
    <div
      className="course-list-cnt p-4 new-course overflow-auto md:overflow-scroll"
      style={{ overflow: popupOpen ? "hidden" : "scroll" }}
    >
      <div className="top-header-cnt flex justify-between items-center mb-4">
        <div className="back-btn" onClick={() => navigate("/admin")}>
          <ArrowLeft className="h-4 w-4" />
        </div>
        {editCourse ? (
          <div className="top-btn-cnt flex space-x-4">
            <div
              className="course-delete-btn bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
              onClick={() => setEditCourse(false)}
            >
              Cancel Edit
            </div>
            <div
              className="add-new-lesson-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
              onClick={uploadCourse}
            >
              Update Course
            </div>
          </div>
        ) : (
          <div className="top-btn-cnt flex space-x-4">
            <div
              className="course-delete-btn bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
              onClick={() => deleteThisCourse()}
            >
              Delete Course
            </div>
            <div
              className="add-new-lesson-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
              onClick={() => setEditCourse(true)}
            >
              Edit Course
            </div>
          </div>
        )}
      </div>

      <div className="top-header-cnt mb-6">
        <h3 className="course-new-title text-2xl font-semibold">
          Course Details
        </h3>
        <p className="course-new-description text-gray-600">
          Edit course and publish
        </p>
      </div>

      <div className="input-split-cover flex flex-col md:flex-row gap-6">
        <form className="left-form flex-1">
          <div className="course-name-cnt mb-4">
            <p className="text-sm font-semibold">Enter course Name</p>
            <input
              type="text"
              className="name-input mt-2 p-3 w-full border border-gray-300 rounded-lg"
              value={courseData.title}
              readOnly={editCourse ? false : true}
              onChange={(e) => handledirectInput("title", e.target.value)}
            />
          </div>

          <div className="course-description-cnt mb-4">
            <p className="text-sm font-semibold">Describe course</p>
            <textarea
              className="description-input mt-2 p-3 w-full border border-gray-300 rounded-lg"
              readOnly={editCourse ? false : true}
              value={courseData.description}
              onChange={(e) => handledirectInput("description", e.target.value)}
            />
          </div>

          <div className="flex gap-6 mb-4">
            <div className="course-name-cnt responsive-input flex-1">
              <p className="text-sm font-semibold">Enter course price</p>
              <input
                type="number"
                className="name-input mt-2 p-3 w-full border border-gray-300 rounded-lg"
                placeholder="₹"
                value={courseData.price || ""}
                readOnly={editCourse ? false : true}
                onChange={(e) => handledirectInput("price", e.target.value)}
              />
            </div>

            <div className="course-name-cnt flex-1">
              <p className="text-sm font-semibold">Upload course thumbnail</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCourseData({ ...courseData, thumbnail: e.target.files[0] })
                }
                className="styled-input mt-2 p-3 w-full border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="course-description-cnt mb-4">
            <p className="text-sm font-semibold">OverviewPoints</p>
            {editCourse && (
              <div className="overview-input-cnt flex flex-col gap-4">
                <input
                  type="text"
                  className="name-input p-3 w-full border border-gray-300 rounded-lg"
                  value={currentOverview.heading}
                  placeholder="Heading"
                  onChange={(e) =>
                    handleOverviewInput("heading", e.target.value)
                  }
                />
                <textarea
                  className="overview-input p-3 w-full border border-gray-300 rounded-lg"
                  placeholder="Description"
                  value={currentOverview.content}
                  onChange={(e) =>
                    handleOverviewInput("content", e.target.value)
                  }
                />
                <div
                  className="overview-add-btn bg-green-500 text-white p-3 rounded cursor-pointer hover:bg-green-600"
                  onClick={() => addNewOverview()}
                >
                  <p>Add</p>
                </div>
              </div>
            )}
            {courseData?.overviewPoints?.map((overview, index) => (
              <div className="overviewPoint-cnt mb-4" key={index}>
                <div className="overview-head-cnt flex justify-between items-center">
                  <p className="overviewPoint-heading text-lg font-semibold">
                    {overview?.heading}
                  </p>
                  {editCourse && (
                    <div className="action-btn-cnt-overview flex space-x-2">
                      <Trash
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => handleRemoveOverview(index)}
                      />
                      <Edit
                        className="h-4 w-4 cursor-pointer"
                        onClick={() => setEditValues(overview, index)}
                      />
                    </div>
                  )}
                </div>
                <p className="overviewPoint-content">{overview?.content}</p>
              </div>
            ))}
          </div>
        </form>

        <form className="form-right flex-1">
          <div className="form-right-header flex justify-between items-center mb-6">
            <h3 className="course-new-title text-2xl font-semibold">
              List The Lessons
            </h3>
            {editCourse && (
              <div
                className="add-new-lesson-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                onClick={() => setPopupOpen({ open: true, data: null })}
              >
                Add new lesson
              </div>
            )}
          </div>

          <div className="lesson-list-cnt">
            {courseData.lessons?.length > 0 ? (
              courseData?.lessons?.map((lesson, index) => (
                <div
                  className="lesson bg-white p-4 mb-4 rounded shadow-lg cursor-pointer"
                  key={index}
                  style={{ pointerEvents: editCourse ? "all" : "none" }}
                  onClick={() => openEditLesson(lesson, index)}
                >
                  <h1 className="lesson-number text-xl font-semibold">
                    {index + 1}
                  </h1>
                  <div className="lesson-title-cnt mt-2">
                    <h3 className="lesson-title text-lg font-semibold">
                      {lesson?.title}
                    </h3>
                  </div>
                  <ul className="lesson-subtitle-cnt mt-4">
                    {lesson?.chapter?.map((video, idx) => (
                      <li key={idx}>
                        <p className="lesson-subtitle text-sm">
                          {video?.title}
                        </p>
                        <p className="lesson-duration-txt text-sm text-gray-600">
                          duration: {video?.duration}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <div className="no-lesson-cnt flex justify-center items-center py-10">
                <img
                  src={NoLesson}
                  alt="no-lesson"
                  className="empty-lesson-img"
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {popupOpen.open && (
        <NewLesson
          addLesson={(lesson) => addLessontoCourse(lesson)}
          editData={popupOpen?.data}
          cancel={() => setPopupOpen({ open: false, data: null })}
          removeThisLesson={(lesson) => removeLessonFromCourse(lesson)}
        />
      )}
    </div>
  );
};

export default EditCourse;
