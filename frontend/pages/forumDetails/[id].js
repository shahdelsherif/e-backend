import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ForumDetails() {
  const [forum, setForum] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newReplyContent, setNewReplyContent] = useState({});
  const router = useRouter();
  const { id } = router.query; 

  useEffect(() => {
    if (!id) return; 

    const fetchForumDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/forums/forum/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch forum details');
        }
        const data = await response.json();
        setForum(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchForumDetails();
  }, [id]);

  const handleSearch = () => {

    if (!forum) return;
    const filteredPosts = forum.posts.filter((post) =>
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setForum((prevForum) => ({ ...prevForum, posts: filteredPosts }));
  };

  const handleAddPost = async () => {
    if (!newPostContent.trim()) return;

    console.log(await localStorage.getItem('student_id'))

    const newPost = {
      forumId: id,  
      userId: localStorage.getItem('student_id'), 
      content: newPostContent,
      timestamp: new Date(),
      replies: [],
    };

    try {
      const response = await fetch(`http://localhost:3001/forums/create-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      });

      console.log(response);

      if (response.ok) {
        const updatedForum = await response.json();
        setForum(updatedForum); // Update forum with the new post
        setNewPostContent(''); // Clear the input field
      }
    } catch (err) {
      console.error('Error adding post:', err);
    }
  };

  const handleAddReply = async (postId) => {
    const replyContent = newReplyContent[postId];
    if (!replyContent?.trim()) return;

    const newReply = {
      postId,
      userId: await localStorage.getItem('student_id'),
      content: replyContent,
    };

    try {
      const response = await fetch(`http://localhost:3001/forums/add-reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReply),
      });

      if (response.ok) {
        const updatedForum = await response.json();
        setForum(updatedForum); 
        setNewReplyContent((prev) => ({ ...prev, [postId]: '' })); 
      }
    } catch (err) {
      console.error('Error adding reply:', err);
    }
  };

  if (!forum) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{forum.topic}</h1>

      {/* Search Bar */}
      <div className="flex items-center mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search posts..."
          className="flex-1 border border-gray-300 py-2 px-4 rounded-l-lg focus:outline-none focus:ring focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white py-2 px-6 rounded-r-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Add Post Button */}
      <div className="mb-6">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Write a new post..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none"
        />
        <button
          onClick={handleAddPost}
          className="mt-4 bg-black text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
        >
          Add Post
        </button>
      </div>

      {/* Posts and Replies */}
      {forum.posts.map((post) => (
        <div key={post._id} className="bg-white p-6 mb-6 rounded-lg shadow-md">
          <div className="font-semibold text-gray-800">{post.content}</div>
          <div className="text-gray-500 text-sm">{new Date(post.timestamp).toLocaleString()}</div>

          {/* Replies */}
          {post.replies.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Replies:</h3>
              {post.replies.map((reply) => (
                <div key={reply._id} className="mt-2 bg-gray-100 p-4 rounded-lg">
                  <div>{reply.content}</div>
                  <div className="text-gray-500 text-sm">{new Date(reply.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}

          {/* Add Reply */}
          <div className="mt-4">
            <textarea
              value={newReplyContent[post._id] || ''}
              onChange={(e) => setNewReplyContent({ ...newReplyContent, [post._id]: e.target.value })}
              placeholder="Write a reply..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none"
            />
            <button
              onClick={() => handleAddReply(post._id)}
              className="mt-2 bg-black text-white py-2 px-6 rounded-full hover:bg-blue-700 transition-colors"
            >
              Add Reply
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}
