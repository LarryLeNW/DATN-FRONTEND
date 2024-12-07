import { notification } from "antd";
import { createComment, createReply, deleteComment, deleteReply, getCommentsByBlogId } from "apis/commentBlog.api";
import withBaseComponent from "hocs";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { changeLoading } from "store/slicers/common.slicer";
import img from "assets/images/AvatarDefault.jpg"
import Icons from "utils/icons";

const CommentBlog = ({ checkLoginBeforeAction }) => {
    const { blogId } = useParams();
    const userInfo = useSelector((state) => state.auth.userInfo.data);
    const dispatch = useDispatch();

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyContent, setReplyContent] = useState({});
    const [replyToReplyContent, setReplyToReplyContent] = useState({});
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [activeReplyDropdown, setActiveReplyDropdown] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedComment, setEditedComment] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);

    const toggleDropdown = (commentId) => {
        if (activeDropdown === commentId) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(commentId);
        }
    };

    const toggleReplyDropdown = (replyId) => {
        if (activeReplyDropdown === replyId) {
            setActiveReplyDropdown(null);
        } else {
            setActiveReplyDropdown(replyId);
        }
    };

    const fetchComments = async (blogId) => {
        try {
            const res = await getCommentsByBlogId(blogId);
            setComments(res);
        } catch (error) {
            console.log("Không thể lấy comment của blog đó: ", error);
        }
    };

    const handleCreateComment = async (blogId) => {
        if (newComment.length < 1) {
            return notification.warning({ message: "Vui lòng điền bình luận của bạn!", });
        }
        if (newComment.length > 500) {
            return notification.warning({ message: "Bình luận của bạn quá dài!" });
        }
        dispatch(changeLoading())
        try {
            await createComment({
                content: newComment,
                blogId: blogId,
                userId: userInfo.id,
            });
            setNewComment("");
            fetchComments(blogId);
            notification.success({ message: "Bình luận thành công!" });

        } catch (error) {
            console.log("Lỗi khi tạo comment: ", error);
        }
        dispatch(changeLoading())
    };

    const handleReply = async (parentCommentId) => {
        if (replyContent.length < 1) {
            return notification.warning({ message: "Vui lòng điền bình luận của bạn!", });
        }
        if (replyContent.length > 500) {
            return notification.warning({ message: "Bình luận của bạn quá dài!" });
        }
        dispatch(changeLoading())
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
        dispatch(changeLoading())

    };

    const handleReplyToReply = async (commentId, ReplyId) => {
        if (replyToReplyContent.length < 1) {
            return notification.warning({ message: "Vui lòng điền bình luận của bạn!", });
        }
        if (replyToReplyContent.length > 500) {
            return notification.warning({ message: "Bình luận của bạn quá dài!" });
        }
        dispatch(changeLoading())
        try {
            await createReply({
                content: replyToReplyContent[ReplyId],
                commentId: commentId,
                userId: userInfo.id,
                parentReplyId: ReplyId,
            });
            setReplyToReplyContent((prev) => ({ ...prev, [commentId]: "" }));
            setReplyToReplyContent("")
            notification.success({ message: "Bạn đã trả lời bình luận của!", ReplyId });
            fetchComments(blogId);
        } catch (error) {
            console.log("Lỗi khi trả lời comment: ", error);
        }
        dispatch(changeLoading())
    }

    const handleEditClick = async (commentId, content) => {

        setIsEditing(true);
        setEditingCommentId(commentId);
        setEditedComment(content);

    }

    const handleRemoveComment = async (commentId) => {
        dispatch(changeLoading())
        try {
            await deleteComment(commentId)
            fetchComments(blogId)
            notification.success({ message: "Xóa bình luận thành công!" });
        } catch (error) {
            console.log('Lỗi khi xóa bình luận: ', error);

        }
        dispatch(changeLoading())
    }
    const handleRemoveReplyComment = async (replyId) => {
        dispatch(changeLoading())
        try {
            await deleteReply(replyId)
            fetchComments(blogId)
            notification.success({ message: "Xóa bình luận thành công!" });
        } catch (error) {
            console.log('Lỗi khi xóa bình luận: ', error);

        }
        dispatch(changeLoading())
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
                                placeholder="Nhập bình luận..."
                                required
                            ></textarea>
                        </div>
                        <button
                            onClick={() => checkLoginBeforeAction(() => handleCreateComment(blogId))}
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            Bình luận
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
                                                    src={comment.avatar || img}
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
                                            <Icons.CiSettings size={25} />
                                            <span className="sr-only">Comment settings</span>
                                        </button>
                                        {activeDropdown === comment.commentId && userInfo && (
                                            <div
                                                className="z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                                            >
                                                <ul className=" py-1 text-sm text-gray-700 dark:text-gray-200">
                                                    {(comment.user_id === userInfo.id) && (
                                                        <>
                                                            <li>
                                                                <a  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                                                    onClick={() => handleEditClick(comment.commentId, comment.content)}

                                                                >
                                                                    Chỉnh sửa
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a onClick={() => handleRemoveComment(comment.commentId)} className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                    Xóa
                                                                </a>
                                                            </li>
                                                        </>
                                                    )}
                                                    <li>
                                                        <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                            Báo Cáo
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
                                            <Icons.FaReply />
                                            Trả lời
                                        </button>

                                    </div>  <br />
                                    {replyContent[comment.commentId] && (
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Nhập câu trả lời..."
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
                                                onClick={() => checkLoginBeforeAction(() => handleReply(comment.commentId))}
                                                className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                            >
                                                Trả lời
                                            </button>
                                        </div>

                                    )}
                                </article>
                                {comment.replyResponse.map((reply) => (
                                    <article key={reply.replyId} className="p-3 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900">
                                        <footer class="flex justify-between items-center mb-2">
                                            <div class="flex items-center">
                                                <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold"><img
                                                    class="mr-2 w-6 h-6 rounded-full"
                                                    src={reply.avatar || img}
                                                    alt="Jese Leos" />{reply.userName}</p>
                                                <p class="text-sm text-gray-600 dark:text-gray-400"> {moment(reply?.createdAt).format(
                                                    "HH:mm  DD/MM/YYYY"
                                                )}</p>
                                            </div>
                                            <button id="dropdownComment2Button" data-dropdown-toggle="dropdownComment2"
                                                onClick={() => toggleReplyDropdown(reply.replyId)}
                                                class="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-40 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                                type="button">
                                                <Icons.CiSettings />
                                                <span class="sr-only">Comment settings</span>
                                            </button>

                                            {activeReplyDropdown === reply.replyId && userInfo && (
                                                <div
                                                    className="z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                                                >
                                                    <ul className=" py-1 text-sm text-gray-700 dark:text-gray-200">
                                                        {(reply.user_id === userInfo.id) && (
                                                            <>
                                                                <li>
                                                                    <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                        Chỉnh sửa
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a onClick={() => handleRemoveReplyComment(reply.replyId)} className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                        Xóa
                                                                    </a>
                                                                </li>
                                                            </>
                                                        )}
                                                        <li>
                                                            <a href="#" className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                                Báo cáo
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </footer>
                                        <p className="text-gray-500 dark:text-gray-400"> <b className="underline text-blue-700">@{reply.parentReplyUserName || reply.userComment}</b> {reply.content}</p>
                                        <button
                                            onClick={() =>
                                                setReplyToReplyContent((prev) => ({
                                                    ...prev,
                                                    [reply.replyId]: !prev[reply.replyId],
                                                }))
                                            }
                                            className="flex items-center text-sm mt-2 text-gray-500 hover:underline dark:text-gray-400 font-medium"
                                        >
                                            <Icons.FaReply />  Trả lời
                                        </button>

                                        {/* Hiển thị form trả lời reply */}
                                        {replyToReplyContent[reply.replyId] && (
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Nhập câu trả lời..."
                                                    className="border rounded w-full p-2"
                                                    onChange={(e) =>
                                                        setReplyToReplyContent({
                                                            ...replyToReplyContent,
                                                            [reply.replyId]: e.target.value,
                                                        })
                                                    }
                                                />
                                                <button
                                                    onClick={() => checkLoginBeforeAction(() => handleReplyToReply(comment.commentId, reply.replyId))}
                                                    className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                                >
                                                    Trả lời
                                                </button>
                                            </div>
                                        )}
                                    </article>
                                ))}

                            </div>
                        ))}

                </div>
            </section>
        </div>
    );
};

export default withBaseComponent(CommentBlog);
