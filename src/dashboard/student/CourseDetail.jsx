// import {
//   AppWindowMac,
//   ArrowLeft,
//   Award,
//   BookOpen,
//   PlayCircle,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router";
// import { CreateCourseEnrollment } from "../../service/api";

// function CourseDetail() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const course = location.state?.course || null;

//   const [isPurchased, setIsPurchased] = useState(false);
//   const UserInfo = JSON.parse(localStorage.getItem("loginData"));

//   useEffect(() => {
//     const purchasedCourses =
//       JSON.parse(localStorage.getItem("purchasedCourses")) || [];
//     if (purchasedCourses.includes(course._id)) {
//       setIsPurchased(true);
//     }
//   }, [course._id]);

//   const handlePurchase = async () => {
//     const purchasedCourses =
//       JSON.parse(localStorage.getItem("purchasedCourses")) || [];
//     if (!purchasedCourses.includes(course._id)) {
//       await CreateCourseEnrollment({
//         courseId: course._id,
//       });
//       purchasedCourses.push(course._id);
//       localStorage.setItem(
//         "purchasedCourses",
//         JSON.stringify(purchasedCourses)
//       );
//       setIsPurchased(true);
//     }
//   };

//   return (
//     <>
//       <div className="min-h-[calc(100vh-4rem)] flex flex-col  p-4 w-full">
//         <div className="h-[300px] relative rounded-md overflow-hidden">
//           <button
//             className="absolute top-4 left-4 text-white bg-green-600 font-semibold text-sm px-3 py-2 rounded-md flex items-center gap-2 z-20"
//             onClick={() => navigate(-1)}
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Courses
//           </button>
//           <img
//             src={course.thumbnail}
//             alt={course.title}
//             className="bg-green-50 object-cover object-center w-full h-full rounded-md overflow-hidden shadow-sm"
//             onError={(e) => {
//               e.target.onerror = null;
//               e.target.src = "/vite.svg";
//             }}
//           />
//           <div className="absolute bottom-0 bg-gradient-to-t from-neutral-900/60 from-10% to-green-50/0 z-10 w-full h-full"></div>

//           <div className="absolute bottom-10 left-10 z-10 text-white pr-4">
//             <h2 className="text-2xl font-semibold">{course.title}</h2>
//             <p className="text-base font-medium">{course.description}</p>
//           </div>
//         </div>
//         <div className="flex-1 w-full py-4 md:px-4">
//           <div className="flex flex-col-reverse lg:flex-row gap-4 justify-between  items-start w-full">
//             <div className="flex-1 w-full">
//               <div className="flex flex-col gap-4 w-full">
//                 <h2 className="font-semibold text-lg">Content</h2>
//                 <Accordion course={course} />
//               </div>
//             </div>
//             <div className="lg:max-w-[300px] p-4 flex flex-col gap-4 w-full bg-white shadow rounded-md">
//               <div className="flex items-center justify-between">
//                 <p className="flex items-center gap-2 font-bold text-lg">
//                   Rs. {course.price}
//                   <span className="line-through text-neutral-500 text-sm">
//                     Rs. {course.price * 2}
//                   </span>
//                 </p>
//                 <div className="flex items-center gap-2 font-bold text-base text-red-600">
//                   50%
//                 </div>
//               </div>
//               <button
//                 onClick={handlePurchase}
//                 disabled={isPurchased}
//                 className={`w-full px-5 py-2 rounded-md text-white ${
//                   isPurchased
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-green-700 hover:bg-green-600"
//                 }`}
//               >
//                 {isPurchased ? "Purchased" : "Buy Now"}
//               </button>
//               <div className="border-t-2 border-neutral-300 py-4">
//                 <h3 className="font-semibold text-base">
//                   This course includes
//                 </h3>

//                 <div className="text-sm flex flex-col gap-2 mt-2 text-neutral-400">
//                   <p className="flex items-center gap-2">
//                     <AppWindowMac />
//                     <span className="font-medium">
//                       Access on mobile and Desktop
//                     </span>
//                   </p>
//                   <p className="flex items-center gap-2">
//                     <Award />
//                     <span className="font-medium">
//                       Achievement of completion
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default CourseDetail;

// const AccordionItem = ({ title, children }) => (
//   <details className="px-4 py-2 rounded-md transition-all duration-300 [open]:bg-green-400 shadow w-full bg-white">
//     <summary className="cursor-pointer flex px-3 py-2 items-center gap-2 text-green-800 font-semibold">
//       <BookOpen className="h-5 w-5" />
//       <span>{title}</span>
//     </summary>
//     <div className="pl-10 px-3 py-2 text-sm text-gray-700 flex flex-col gap-2">
//       {children}
//     </div>
//   </details>
// );

// const Accordion = ({ course }) => {
//   return (
//     <div className="flex flex-col gap-1">
//       {course.lessons?.map((lesson, index) => (
//         <AccordionItem
//           key={index + 1}
//           title={lesson.title}
//           className="bg-green-100"
//         >
//           {lesson.sublessons?.map((sublesson, index) => (
//             <div className="px-3 py-2 flex items-center gap-2 text-green-800 font-semibold w-full">
//               <PlayCircle className="h-5 w-5 text-green-800" />
//               <span className="text-green-800 font-medium w-full">
//                 {sublesson.title}
//               </span>
//             </div>
//           ))}
//         </AccordionItem>
//       ))}
//     </div>
//   );
// };


import {
  AppWindowMac,
  ArrowLeft,
  Award,
  BookOpen,
  PlayCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { CreateCourseEnrollment, GetCourseEnrollment } from "../../service/api";

function CourseDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const course = location.state?.course || null;

  const [isPurchased, setIsPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const UserInfo = JSON.parse(localStorage.getItem("loginData"));

  useEffect(() => {
    const checkEnrollmentStatus = async () => {
      try {
        const res = await GetCourseEnrollment(UserInfo._id);
        const enrollments = res?.data?.enrolledCourses || [];

        const match = enrollments.find(
          (item) =>
            item.courseId === course._id &&
            item.isApproved === true &&
            new Date(item.expiryDate) > new Date()
        );

        if (match) {
          setIsPurchased(true);
        }
      } catch (error) {
        console.error("Error checking enrollment:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (UserInfo?._id && course?._id) {
      checkEnrollmentStatus();
    }
  }, [UserInfo?._id, course?._id]);

  const handlePurchase = async () => {
    try {
      await CreateCourseEnrollment({ courseId: course._id });
      alert("Enrollment request sent. Waiting for admin approval.");
    } catch (error) {
      const msg = error?.response?.data?.error || "Something went wrong";
      if (msg.includes("waiting for admin")) {
        alert("You are already enrolled. Waiting for admin approval.");
      } else if (msg.includes("already enrolled")) {
        alert("Already enrolled in this course.");
      } else {
        alert(msg);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col p-4 w-full">
      <div className="h-[300px] relative rounded-md overflow-hidden">
        <button
          className="absolute top-4 left-4 text-white bg-green-600 font-semibold text-sm px-3 py-2 rounded-md flex items-center gap-2 z-20"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Courses
        </button>
        <img
          src={course.thumbnail}
          alt={course.title}
          className="bg-green-50 object-cover object-center w-full h-full rounded-md overflow-hidden shadow-sm"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/vite.svg";
          }}
        />
        <div className="absolute bottom-0 bg-gradient-to-t from-neutral-900/60 from-10% to-green-50/0 z-10 w-full h-full"></div>
        <div className="absolute bottom-10 left-10 z-10 text-white pr-4">
          <h2 className="text-2xl font-semibold">{course.title}</h2>
          <p className="text-base font-medium">{course.description}</p>
        </div>
      </div>

      <div className="flex-1 w-full py-4 md:px-4">
        <div className="flex flex-col-reverse lg:flex-row gap-4 justify-between items-start w-full">
          <div className="flex-1 w-full">
            <div className="flex flex-col gap-4 w-full">
              <h2 className="font-semibold text-lg">Content</h2>
              <Accordion course={course} />
            </div>
          </div>
          <div className="lg:max-w-[300px] p-4 flex flex-col gap-4 w-full bg-white shadow rounded-md">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-bold text-lg">
                Rs. {course.price}
                <span className="line-through text-neutral-500 text-sm">
                  Rs. {course.price * 2}
                </span>
              </p>
              <div className="flex items-center gap-2 font-bold text-base text-red-600">
                50%
              </div>
            </div>

            <button
              onClick={handlePurchase}
              disabled={isLoading || isPurchased}
              className={`w-full px-5 py-2 rounded-md text-white ${
                isPurchased
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-700 hover:bg-green-600"
              }`}
            >
              {isPurchased ? "Purchased" : "Buy Now"}
            </button>

            <div className="border-t-2 border-neutral-300 py-4">
              <h3 className="font-semibold text-base">This course includes</h3>
              <div className="text-sm flex flex-col gap-2 mt-2 text-neutral-400">
                <p className="flex items-center gap-2">
                  <AppWindowMac />
                  <span className="font-medium">
                    Access on mobile and Desktop
                  </span>
                </p>
                <p className="flex items-center gap-2">
                  <Award />
                  <span className="font-medium">Achievement of completion</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;

const AccordionItem = ({ title, children }) => (
  <details className="px-4 py-2 rounded-md transition-all duration-300 [open]:bg-green-400 shadow w-full bg-white">
    <summary className="cursor-pointer flex px-3 py-2 items-center gap-2 text-green-800 font-semibold">
      <BookOpen className="h-5 w-5" />
      <span>{title}</span>
    </summary>
    <div className="pl-10 px-3 py-2 text-sm text-gray-700 flex flex-col gap-2">
      {children}
    </div>
  </details>
);

const Accordion = ({ course }) => {
  return (
    <div className="flex flex-col gap-1">
      {course.lessons?.map((lesson, index) => (
        <AccordionItem key={index + 1} title={lesson.title}>
          {lesson.sublessons?.map((sublesson, i) => (
            <div
              key={i}
              className="px-3 py-2 flex items-center gap-2 text-green-800 font-semibold w-full"
            >
              <PlayCircle className="h-5 w-5 text-green-800" />
              <span className="text-green-800 font-medium w-full">
                {sublesson.title}
              </span>
            </div>
          ))}
        </AccordionItem>
      ))}
    </div>
  );
};
