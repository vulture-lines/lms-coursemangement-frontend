"use client";

import { useState } from "react";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  MessageSquare,
  Share2,
  Send,
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
} from "lucide-react";
import { ForumCommentItem } from "./ForumCommentItem";

export function ForumPostCard({ post, currentUser }) {
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [isDeleted, setIsDeleted] = useState(false);

  // Debug log to check usernames
  console.log("currentUser:", currentUser);
  console.log("post.user:", post.user);
  console.log("Can edit/delete:", currentUser?.username === post.user.username);

  const handleUpvote = () => {
    if (upvoted) {
      setUpvotes(upvotes - 1);
      setUpvoted(false);
    } else {
      setUpvotes(downvoted ? upvotes + 2 : upvotes + 1);
      setUpvoted(true);
      setDownvoted(false);
    }
  };

  const handleDownvote = () => {
    if (downvoted) {
      setUpvotes(upvotes + 1);
      setDownvoted(false);
    } else {
      setUpvotes(upvoted ? upvotes - 2 : upvotes - 1);
      setDownvoted(true);
      setUpvoted(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `https://devforum.example.com/post/${post.id}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: `c${comments.length + 1}`,
        author: currentUser?.username || "currentUser",
        content: newComment,
        upvotes: 1,
        timePosted: "Just now",
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      post.content = editedContent;
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setIsDeleted(true);
    }
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-start gap-4">
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleUpvote}
            className={`p-1 rounded-full hover:bg-gray-100 ${
              upvoted ? "text-orange-500" : "text-gray-600"
            }`}
          >
            <ArrowUpCircle className="h-5 w-5" />
          </button>
          <span className="font-medium text-sm">{upvotes}</span>
          <button
            onClick={handleDownvote}
            className={`p-1 rounded-full hover:bg-gray-100 ${
              downvoted ? "text-green-500" : "text-gray-600"
            }`}
          >
            <ArrowDownCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1">
          <div className="text-sm text-gray-500 flex items-center gap-2 mb-1">
            <span>Posted by u/{post.user.username}</span>•
            <span>{post.timePosted}</span>
          </div>
          <h3 className="text-lg font-semibold">{post.title}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-0 ml-12">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full min-h-[100px] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        ) : (
          <p className="mb-4 text-gray-800">{post.content}</p>
        )}
        {post.files && (
          <div className="relative w-full h-64 mb-4 rounded-md overflow-hidden">
            <img
              src={post.files[0] || "/placeholder.svg"}
              alt={post.title}
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 pt-0 ml-12 text-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{comments.length} Comments</span>
            {showComments ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
          >
            <Share2 className="h-4 w-4" />
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>
          {/* Temporarily remove condition for testing */}
          {  (
            <>
              <button
                onClick={handleEdit}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
              >
                <Edit className="h-4 w-4" />
                <span>{isEditing ? "Save" : "Edit"}</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 text-gray-600 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </>
          ) }
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-4 space-y-4">
            <div className="flex gap-2 items-start">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold text-white">
                {currentUser?.username?.slice(0, 2).toUpperCase() || "CU"}
              </div>
              <div className="flex-1 flex gap-2">
                <textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full min-h-[2.5rem] p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 pl-10">
              {comments.map((comment) => (
                <ForumCommentItem key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}