import { ArrowLeft, Clipboard, Edit, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { findFileType } from "../../hook/CourseFunction";
import { UploadFile, UploadFileWithType } from "../../service/api";
import AddTest from "./AddTest";
// import Trash from "../../Assets/Images/trash.png";
// import Edit from "../../Assets/Images/edit.png";
// import Test from "../../Assets/Images/exam.png";
// import AddTest from "./AddTest";
// import { uploadDocument, uploadVideo } from "../../../api/baseApi"; // Ensure the correct function name is imported

// import { findFileType } from "../../../hooks/newCourseFunctions";
// import BackIcon from "../../Assets/Images/left-arrow.png";

const NewLesson = ({ addLesson, cancel, editData, removeThisLesson }) => {
  const [openTest, setOpenTest] = useState({ open: false, data: null });
  const [errors, setErrors] = useState({});
  const [uploadingFile, setUploadingFile] = useState(false);

  const [currentLesson, setCurrentLesson] = useState({
    title: null,
    sublessons: [],
    // test: null,
    updateIndex: null,
    // description: "test-description",
  });

  const [currentSublesson, setCurrentSublesson] = useState({
    title: "",
    // duration: "",
    // fileUrl: "#",
    updateIndex: null,
    // fileType: null,
    test: null,
    file: {
      url: "", // Default empty string for file URL
      type: "", // Default empty string for file type
    },
  });

  const [sublessonFile, setSublessonFile] = useState(null);

  useEffect(() => {
    if (editData) setCurrentLesson(editData);
  }, [editData]);

  const handleAddFile = (file) => {
    const filetype = findFileType(file);
    setSublessonFile(file);
    setCurrentSublesson({ ...currentSublesson, type: filetype });
    setErrors((prev) => ({ ...prev, file: null }));
  };

  const handleSubLessonsInput = (type, value) => {
    setCurrentSublesson({ ...currentSublesson, [type]: value });
    setErrors((prev) => ({ ...prev, [type]: null }));
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log(formData);

      const res = await UploadFileWithType(formData);

      if (res.error) throw new Error(res.error);
      console.log(res.data);

      return res.data;
    } catch (error) {
      throw new Error(`Failed to upload ${error.message}`);
    }
  };

  const addSublessons = async () => {
    try {
      setUploadingFile(true);
      setErrors({});

      // Validate inputs
      if (!currentSublesson.title) {
        setErrors((prev) => ({ ...prev, title: "Title is required" }));
        return;
      }
      if (!currentSublesson.duration) {
        setErrors((prev) => ({ ...prev, duration: "Duration is required" }));
        return;
      }
      //   if (!sublessonFile && currentSublesson.link === "#") {
      //     setErrors((prev) => ({ ...prev, file: "File is required" }));
      //     return;
      //   }

      const newLessons = [...currentLesson.sublessons];

      if (sublessonFile) {
        const Link = await uploadFile(
          sublessonFile
          //   currentSublesson.type === "video" ? "video" : "document"
        );

        if (currentSublesson.updateIndex === null) {
          newLessons.push({
            ...currentSublesson,
            file: {
              url: Link.fileUrl,
              type: Link.fileType,
            },
            // fileUrl: Link.fileUrl,
            // fileType: Link.fileType,
          });
        } else {
          newLessons[currentSublesson.updateIndex] = {
            ...currentSublesson,
            file: {
              url: Link.fileUrl,
              type: Link.fileType,
            },
            // fileUrl: Link.fileUrl,
            // fileType: Link.fileType,
          };
        }
      } else if (currentSublesson.fileUrl !== "#") {
        newLessons[currentSublesson.updateIndex] = currentSublesson;
      }

      setCurrentLesson({ ...currentLesson, sublessons: newLessons });
      setSublessonFile(null);
      setCurrentSublesson({
        title: "",
        duration: "",
        // fileUrl: "#",
        updateIndex: null,
        // fileType: null,
        file: {
          url: "", // Default empty string for file URL
          type: "", // Default empty string for file type
        },
        test: null,
      });
    } catch (error) {
      setErrors((prev) => ({ ...prev, submit: error.message }));
    } finally {
      setUploadingFile(false);
    }
  };

  const validateAndUpdateLesson = () => {
    if (currentLesson.title && currentLesson.sublessons.length > 0) {
      addLesson(currentLesson);
    }
  };

  const setEditSublesson = (chapter, index) => {
    setCurrentSublesson({ ...chapter, updateIndex: index });
  };

  const handleRemoveSublesson = (index) => {
    const newsubLessons = [...currentLesson.sublessons];
    newsubLessons.splice(index, 1);
    setCurrentLesson({ ...currentLesson, sublessons: newsubLessons });
  };

  console.log(editData);

  useEffect(() => {
    if (editData) setCurrentLesson(editData);
  }, [editData]);

  const handleDelete = () => {
    const confirm = window.confirm(
      "Confirm to delete this lesson, all subLessons will be deleted"
    );
    console.log(editData?.title);
    if (confirm) {
      removeThisLesson(editData);
      cancel();
    }
  };

  console.log(currentSublesson);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 bg-opacity-40 flex items-center justify-center overflow-y-auto">
      <div className="bg-white max-w-4xl w-full rounded shadow-lg p-6">
        {openTest.open && (
          <AddTest
            testId={currentSublesson?.test}
            addTest={(data) =>
              setCurrentSublesson({ ...currentSublesson, test: data })
            }
            closeTest={() => setOpenTest({ open: false })}
          />
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div onClick={cancel} className="cursor-pointer">
            {/* <img src={BackIcon} alt="back" className="w-6 h-6" /> */}
            <ArrowLeft className="w-6 h-6" />
          </div>
          <div className="flex gap-3">
            {editData && (
              <div
                className="px-4 py-2 bg-red-100 text-red-600 rounded cursor-pointer"
                onClick={handleDelete}
              >
                Delete Lesson
              </div>
            )}
            <div
              className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
              onClick={validateAndUpdateLesson}
            >
              {!editData?.updateIndex ? "Add to Course" : "Update Course"}
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-4">Create New Lesson</h3>

        {/* Lesson Title + Test Link */}
        <div className="mb-6">
          <p className="mb-1">Lesson Title</p>
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={currentLesson.title}
            onChange={(e) =>
              setCurrentLesson({ ...currentLesson, title: e.target.value })
            }
          />
          <div
            className="mt-3 flex items-center gap-3 bg-gray-100 p-3 rounded cursor-pointer"
            onClick={() =>
              setOpenTest({ open: true, data: currentLesson.testId })
            }
          >
            {/* <img src={Test} alt="test" className="w-5 h-5" /> */}
            <Clipboard className="w-5 h-5" />
            <p className="text-sm text-gray-700">
              {!currentLesson?.testId?.length > 3
                ? "No Tests have been created for this lesson"
                : "Test - click to update"}
            </p>
          </div>
        </div>

        {/* Sublesson Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="mb-1">Sub lesson Title</p>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={currentSublesson.title}
              onChange={(e) => handleSubLessonsInput("title", e.target.value)}
            />
          </div>
          <div>
            <p className="mb-1">Duration</p>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={currentSublesson.duration}
              onChange={(e) =>
                handleSubLessonsInput("duration", e.target.value)
              }
            />
          </div>
          <div className="md:col-span-2">
            <div className="relative w-full border border-dashed border-gray-400 p-3 rounded bg-gray-50">
              <p className="text-sm text-gray-600">
                {sublessonFile?.name || "Upload Media"}
              </p>
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="video/*,audio/*,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                onChange={(e) => handleAddFile(e.target.files[0])}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <div
              className="px-4 py-2 bg-green-600 text-white rounded text-center cursor-pointer"
              onClick={addSublessons}
            >
              {uploadingFile ? "Uploading..." : "Add"}
            </div>
          </div>
        </div>

        {/* Sublessons List */}
        <div className="space-y-4">
          {currentLesson?.sublessons?.map((sublesson, index) => (
            <div
              key={index}
              className={`border rounded p-4 ${
                currentSublesson.updateIndex === index ? "bg-gray-100" : ""
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Sub lesson Title</p>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-4 py-2 mt-1"
                    value={sublesson?.title}
                    readOnly
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-4 py-2 mt-1"
                    value={sublesson?.duration}
                    readOnly
                  />
                </div>
                <div
                  className="col-span-2 mt-2 text-blue-600 underline cursor-pointer"
                  onClick={() => window.open(sublesson?.fileUrl)}
                >
                  Open {sublesson.fileType}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                {/* <img
                  src={Trash}
                  alt="delete"
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => handleRemoveSublesson(index)}
                /> */}
                <Trash
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => handleRemoveSublesson(index)}
                />
                <Edit
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => setEditSublesson(sublesson, index)}
                />
                {/* <img
                  src={Edit}
                  alt="edit"
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => setEditSublesson(sublesson, index)}
                /> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewLesson;
