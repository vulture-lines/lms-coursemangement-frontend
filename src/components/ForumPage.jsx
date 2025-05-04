// import { Search } from "lucide-react";
// import PageHeader from "./PageHeader";

// function ForumPage() {
//   return (
//     <>
//       <PageHeader title={"Forum"} />

//       <div className="flex justify-between items-center rounded-md lg:px-8 px-4">
//         <form className="flex items-center w-full">
//           <div className="flex gap-2 items-center  p-2 rounded-md w-full max-w-[500px]">
//             <Search />
//             <input type="text" placeholder="Search" className="outline-none" />
//           </div>
//           <button type="submit"></button>
//         </form>
//         <button className="lg:px-4 lg:py-2 p-2 bg-green-500 text-white outline-none rounded whitespace-nowrap">
//           Create Post
//         </button>
//       </div>
//     </>
//   );
// }

// export default ForumPage;

"use client";

import { useEffect, useState } from "react";
// import { PostCard } from "@/components/post-card";
// import { NewPostForm } from "@/components/new-post-form";

import { Search } from "lucide-react";
import { NewForumPostForm } from "./NewForumPostForm";
import { ForumPostCard } from "./ForumPostCard";
import { addFormPost, getAllFormPost } from "../service/api";

// Sample data for initial posts
// const initialPosts = [
//   {
//     id: "1",
//     title: "What's the best way to learn React in 2025?",
//     description:
//       "I'm new to web development and want to learn React. What resources would you recommend for a beginner in 2025?",
//     author: "reactNewbie",
//     upvotes: 124,
//     comments: 23,
//     timePosted: "5 hours ago",
//     imageUrl: null,
//   },
//   {
//     id: "2",
//     title: "Has anyone tried the new Vercel v0 AI assistant?",
//     description:
//       "I've been using Vercel's v0 AI assistant for my projects and I'm impressed with how it can generate entire components. What has been your experience with it?",
//     author: "techExplorer",
//     upvotes: 89,
//     comments: 15,
//     timePosted: "2 hours ago",
//     imageUrl: "/placeholder.svg?height=300&width=600",
//   },
//   {
//     id: "3",
//     title: "Debugging issue with Next.js App Router",
//     description:
//       "I'm having trouble with dynamic routes in Next.js App Router. My [slug] pages aren't receiving the correct params. Has anyone encountered this issue before?",
//     author: "nextDeveloper",
//     upvotes: 45,
//     comments: 8,
//     timePosted: "1 day ago",
//     imageUrl: null,
//   },
// ];

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);

  const fetchAllPost = async () => {
    try {
      const Posts = await getAllFormPost();
      setPosts(Posts);
      console.log(Posts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllPost();
  }, []);

  const handleNewPost = async (post) => {
    // const newPost = {
    //   id: (posts.length + 1).toString(),
    //   author: "currentUser",
    //   upvotes: 1,
    //   comments: 0,
    //   timePosted: "Just now",
    //   ...post,
    // };
    const payload = {
      title: post.title,
      content: post.description,
      files: post.imageUrl,
    };
    const res = await addFormPost(payload);
    console.log(res);

    // setPosts([newPost, ...posts]);
    setShowNewPostForm(false);
  };
  console.log(posts);

  return (
    <div className="container mx-auto py-6 max-w-4xl px-4">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">DevForum</h1>
            <button
              onClick={() => setShowNewPostForm(!showNewPostForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
            >
              {showNewPostForm ? "Cancel" : "Create Post"}
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </header>

        {/* New Post Form */}
        {showNewPostForm && (
          <div className="mb-6">
            <NewForumPostForm
              onSubmit={handleNewPost}
              onCancel={() => setShowNewPostForm(false)}
            />
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <ForumPostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
