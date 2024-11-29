import { notification } from "antd";
import { createComment, createReply, deleteComment, getCommentsByBlogId } from "apis/commentBlog.api";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const CommentBlog = () => {
    const { blogId } = useParams();
    const userInfo = useSelector((state) => state.auth.userInfo.data);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyContent, setReplyContent] = useState({});
    const [dataContentReplys, setDataContentReplys] = useState("")
    const [activeDropdown, setActiveDropdown] = useState(null);
    const fetchComments = async (blogId) => {
        try {
            const res = await getCommentsByBlogId(blogId);
            setComments(res);
        } catch (error) {
            console.log("Không thể lấy comment của blog đó: ", error);
        }
    };

    const handleCreateComment = async (blogId) => {
        try {
            await createComment({
                content: newComment,
                blogId: blogId,
                userId: userInfo.id,
            });
            setNewComment("");
            fetchComments(blogId);
        } catch (error) {
            console.log("Lỗi khi tạo comment: ", error);
        }
    };

    const handleReply = async (parentCommentId) => {
        try {
            console.log("thông tin: ", replyContent);

            await createReply({
                content: replyContent[parentCommentId],
                commentId: parentCommentId,
                userId: userInfo.id,
            });
            setReplyContent((prev) => ({ ...prev, [parentCommentId]: "" }));
            notification.success({ message: "Bạn đã trả lời bình luận của!", parentCommentId });
            fetchComments(blogId);
        } catch (error) {
            console.log("Lỗi khi trả lời comment: ", error);
        }
    };

    const toggleDropdown = (commentId) => {
        if (activeDropdown === commentId) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(commentId);
        }
    };

    const handleRemoveComment = async (commentId) => {
        try {
            await deleteComment(commentId)
            fetchComments(blogId)
            notification.success({ message: "Xóa bình luận thành công!" });
        } catch (error) {
            console.log('Lỗi khi xóa bình luận: ', error);

        }
    }
    useEffect(() => {
        fetchComments(blogId);
    }, [blogId]);

    useEffect(() => {
        console.log("Dữ liệu comment: ", comments);
    }, [comments]);

    return (
        <div>
            <section className="bg-white dark:bg-gray-900 py-8 lg:py-16 antialiased">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                            Discussion ({comments.length})
                        </h2>
                    </div>
                    <form className="mb-6">
                        <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <label htmlFor="comment" className="sr-only">
                                Your comment
                            </label>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                id="comment"
                                rows="6"
                                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                placeholder="Write a comment..."
                                required
                            ></textarea>
                        </div>
                        <button
                            onClick={() => handleCreateComment(blogId)}
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            Comment
                        </button>
                    </form>

                    {comments &&
                        comments.slice().reverse().map((comment) => (
                            <div>
                                <article
                                    key={comment.commentId}
                                    className="p-6 text-base bg-white rounded-lg dark:bg-gray-900"
                                >
                                    <footer className="flex justify-between items-center mb-2">
                                        <div className="flex items-center">
                                            <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                                                <img
                                                    className="mr-2 w-6 h-6 rounded-full"
                                                    src="https://flowbite.com/docs/images/people/profile-picture-2.jpg"
                                                    alt="Michael Gough"
                                                />
                                                {comment?.userName}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {moment(comment?.createdAt).format(
                                                    "HH:mm  DD/MM/YYYY"
                                                )}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => toggleDropdown(comment.commentId)}
                                            className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                            type="button"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 16 3"
                                            >
                                                <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                                            </svg>
                                            <span className="sr-only">Comment settings</span>
                                        </button>
                                        {activeDropdown === comment.commentId && (
                                            <div
                                                className="  z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                                            >
                                                <ul className=" py-1 text-sm text-gray-700 dark:text-gray-200">
                                                    {(comment.user_id === userInfo.id) && (
                                                        <>
                                                            <li>
                                                                <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                    Edit
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a onClick={() => handleRemoveComment(comment.commentId)} className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                    Remove
                                                                </a>
                                                            </li>
                                                        </>
                                                    )}
                                                    <li>
                                                        <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            Report
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        )}

                                    </footer>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {comment.content}
                                    </p>
                                    <div className="flex items-center mt-4 space-x-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setReplyContent((prev) => ({
                                                    ...prev,
                                                    [comment.commentId]: !prev[comment.commentId],
                                                }))
                                            }
                                            className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium"
                                        >
                                            <svg
                                                className="mr-1.5 w-3.5 h-3.5"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 20 18"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                                                />
                                            </svg>
                                            Reply
                                        </button>

                                    </div>  <br />
                                    {replyContent[comment.commentId] && (
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Write your reply..."
                                                className="border rounded w-full p-2"
                                                onChange={(e) =>
                                                    // setDataContentReplys(
                                                    //     e.target.value,
                                                    // )
                                                    setReplyContent({
                                                        ...replyContent,
                                                        [comment.commentId]: e.target.value,
                                                    })
                                                } 
                                                />
                                            <button
                                                onClick={() => handleReply(comment.commentId)}
                                                className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                            >
                                                Reply
                                            </button>
                                        </div>

                                    )}
                                </article>
                                {comment.replyResponse.map((reply) => (
                                    <article class="p-6 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900">
                                        <footer class="flex justify-between items-center mb-2">
                                            <div class="flex items-center">
                                                <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><img
                                                    class="mr-2 w-6 h-6 rounded-full"
                                                    src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                                    alt="Jese Leos" />Jese Leos</p>
                                                <p class="text-sm text-gray-600 dark:text-gray-400"><time pubdate datetime="2022-02-12"
                                                    title="February 12th, 2022">Feb. 12, 2022</time></p>
                                            </div>
                                            <button id="dropdownComment2Button" data-dropdown-toggle="dropdownComment2"
                                                class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-40 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                                type="button">
                                                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                                    <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                                                </svg>
                                                <span class="sr-only">Comment settings</span>
                                            </button>

                                            <div id="dropdownComment2"
                                                class="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                                <ul class="py-1 text-sm text-gray-700 dark:text-gray-200"
                                                    aria-labelledby="dropdownMenuIconHorizontalButton">
                                                    <li>
                                                        <a href="#"
                                                            class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</a>
                                                    </li>
                                                    <li>
                                                        <a href="#"
                                                            class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</a>
                                                    </li>
                                                    <li>
                                                        <a href="#"
                                                            class="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </footer>
                                        <p class="text-gray-500 dark:text-gray-400">{reply.content}</p>
                                        <div class="flex items-center mt-4 space-x-4">
                                            <button type="button"
                                                class="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400 font-medium">
                                                <svg class="mr-1.5 w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                                                </svg>
                                                Reply
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ))}

                </div>
            </section>
        </div>
    );
};

export default CommentBlog;
