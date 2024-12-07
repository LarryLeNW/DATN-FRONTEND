import { faker } from "@faker-js/faker";
import { notification, Progress, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import useFileUpload from "hooks/useUpload";
import defaultPreviewImage from "assets/images/admin/defaultPreviewProduct.png";
import moment, { duration } from "moment";
import "moment/locale/vi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Icons from "utils/icons";
import { replyQuestion } from "apis/replyQuestion.api";
import {
    createReactQuestion,
    updateReactQuestion,
} from "apis/reactQuestion.api";
import ReplyItem from "./ReplyItem";
import renderReply from "./renderReply";
moment.locale("vi");

function Question({
    data,
    indexShowComment,
    index,
    setIndexShowComment,
    setData,
}) {
    const [reactions, setReactions] = useState({});
    const [commentText, setCommentText] = useState("");
    const { isLogged, userInfo } = useSelector((state) => state.auth);
    const { upload } = useFileUpload();
    const [uploadProgress, setUploadProgress] = useState([]);
    const [loadingData, setLoadingData] = useState({
        comment: false,
        reaction: null,
    });
    const [userReacted, setUserReacted] = useState(null);
    const [uploadUrls, setUploadUrls] = useState([]);

    const handleComment = async () => {
        if (!commentText && uploadUrls.length === 0) {
            notification.warning({
                message: "Vui lòng nhập hoặc tải ảnh cho bình luận",
                duration: 1,
                placement: "top",
            });
            return;
        }

        setLoadingData((prev) => ({ ...prev, comment: true }));
        try {
            const res = await replyQuestion({
                replyText: commentText,
                images: uploadUrls.join(","),
                questionId: data.id,
            });
            notification.success({
                message: "Cảm ơn góp ý của bạn",
                duration: 1,
                placement: "top",
            });

            if (Array.isArray(data.replies))
                setData({ ...data, replies: [...data.replies, res.result] });
            else {
                setData({
                    ...data,
                    replies: [res.result],
                });
            }

            setUploadProgress([]);
            setCommentText("");
            setUploadUrls([]);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 1,
                placement: "top",
            });
        }

        setLoadingData((prev) => ({ ...prev, comment: false }));
    };

    const handleReactQuestion = async (reactionType) => {
        if (
            loadingData["reaction"] === reactionType ||
            userReacted?.reactionType === reactionType
        )
            return;

        if (!isLogged) {
            notification.warning({
                message: "Vui lòng đăng nhập để thả cảm xúc...",
                duration: 1,
                placement: "top",
            });
            return;
        }

        setLoadingData((prev) => ({ ...prev, reaction: reactionType }));
        try {
            let res = null;

            if (!!userReacted && userReacted?.reactionType !== reactionType) {
                res = await updateReactQuestion(userReacted?.id, {
                    reactionType,
                    questionId: data.id,
                });

                setData({
                    ...data,
                    reactions: data.reactions.map((el) =>
                        el.id === res.result.id ? res.result : el
                    ),
                });
            } else {
                res = await createReactQuestion({
                    reactionType,
                    questionId: data.id,
                });
                setData({
                    ...data,
                    reactions: [...data.reactions, res.result],
                });
            }

            notification.success({
                message: "Cảm ơn tương tác của bạn",
                duration: 1,
                placement: "top",
            });
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 1,
                placement: "top",
            });
        }

        setLoadingData((prev) => ({ ...prev, reaction: null }));
    };

    useEffect(() => {
        if (data?.reactions?.length >= 1) {
            const filterReacts = {};
            data.reactions.forEach((react) => {
                if (react?.postBy?.id === userInfo.data?.id)
                    setUserReacted(react);

                if (filterReacts[react.reactionType]) {
                    filterReacts[react.reactionType] = [
                        ...filterReacts[react.reactionType],
                        react,
                    ];
                } else {
                    filterReacts[react.reactionType] = [react];
                }
            });
            setReactions(filterReacts);
        }
    }, [data]);

    const ImageUploadPreview = ({ src, index }) => {
        return (
            <div className="relative">
                <div
                    className="top-0 right-0 absolute cursor-pointer  p-1 bg-white"
                    onClick={() =>
                        setUploadUrls((prev) => prev.filter((el) => el != src))
                    }
                >
                    <Icons.MdDeleteForever color="red" />
                </div>
                <img
                    src={src || defaultPreviewImage}
                    alt={src}
                    className="w-24 h-20 object-cover"
                />
                {uploadProgress[index] !== undefined &&
                    uploadProgress[index] > 0 && (
                        <div
                            className={
                                "absolute top-0 left-0 right-0 bottom-0 bg-slate-200 bg-opacity-70 flex items-center justify-center transition-opacity duration-300"
                            }
                        >
                            <span className="text-white p-2 cursor-pointer">
                                <Progress
                                    type="circle"
                                    percent={uploadProgress[index]}
                                    size={32}
                                />
                            </span>
                        </div>
                    )}
            </div>
        );
    };

    const handleUpload = async (e) => {
        const filesReceived = e.target.files;

        if (filesReceived.length > 7) {
            notification.error({
                message: "Chỉ chọn tối đa 7 ảnh!",
            });
            return;
        }

        setUploadUrls(new Array(filesReceived.length).fill(null));

        const uploadProgress = (percent, fileIndex) => {
            setUploadProgress((prevProgress) => {
                const newProgress = [...prevProgress];
                newProgress[fileIndex] = percent;
                return newProgress;
            });
        };

        const uploadPromises = [];

        for (
            let i = 0, j = index;
            i < filesReceived.length && j <= 7;
            i++, j++
        ) {
            uploadPromises.push(upload(filesReceived[i], uploadProgress, j));
        }

        const urls = await Promise.all(uploadPromises);

        setUploadUrls(urls);
        setUploadProgress([]);
    };

    return (
        <div key={data?.id} className="bg-white rounded pb-2">
            <div className="flex gap-4 items-center bg-blue-100 px-4 rounded py-2">
                <div>
                    <img
                        src={data?.postBy?.avatar || faker.image.avatar()}
                        className="w-12 h-12 rounded-full"
                        alt={data?.postBy?.username}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div className="font-bold text-lg">
                        {data?.postBy?.username}
                    </div>
                    <div className="text-gray-500">
                        {moment(data?.createdAt).fromNow()}
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <div className="flex-1">
                    <div className="px-2 py-4 text-lg">
                        {data?.questionText}
                    </div>

                    {data?.images.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 px-2">
                            {data?.images?.split(",").map((img, index) => (
                                <div
                                    key={index}
                                    className="flex justify-center items-center"
                                >
                                    <img
                                        src={img}
                                        alt={img}
                                        className="object-cover w-full h-40 rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex-1 overflow-auto border-l border-b p-2 max-h-96 flex flex-col gap-2">
                    {data.replies?.length > 0 ? (
                        renderReply(data.replies, data)
                    ) : (
                        <div className="flex justify-center items-center">
                            <div className="text-gray-500 text-lg">
                                Chưa có bình luận nào
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center px-4">
                <div className="flex gap-6 px-4 py-2 text-gray-600 items-center">
                    {loadingData["reaction"] === "LIKE" ? (
                        <Icons.AiOutlineLoading3Quarters
                            color="blue"
                            className="animate-spin"
                        />
                    ) : (
                        <Tooltip
                            placement="top"
                            title={
                                <>
                                    {reactions["LIKE"]?.length > 0 ? (
                                        <div className="flex gap-2 flex-wrap">
                                            {reactions["LIKE"]?.map((el) => (
                                                <Tooltip
                                                    title={el.postBy?.username}
                                                >
                                                    <img
                                                        src={
                                                            el.postBy?.avatar ||
                                                            faker.image.avatar()
                                                        }
                                                        className="w-8 h-8 rounded-full"
                                                        alt="not found"
                                                    />
                                                </Tooltip>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>Bạn muốn bày tỏ cảm xúc này ?</div>
                                    )}
                                </>
                            }
                        >
                            <button
                                className="flex items-center gap-1 hover:text-blue-500"
                                onClick={() => handleReactQuestion("LIKE")}
                            >
                                <span className="transition-transform transform hover:scale-150 hover:rotate-6">
                                    👍
                                </span>
                                <span
                                    className={`${
                                        userReacted?.reactionType === "LIKE" &&
                                        "font-bold text-blue-600"
                                    }`}
                                >
                                    {reactions["LIKE"]?.length || 0}
                                </span>
                            </button>
                        </Tooltip>
                    )}

                    {loadingData["reaction"] === "DISLIKE" ? (
                        <Icons.AiOutlineLoading3Quarters
                            color="blue"
                            className="animate-spin"
                        />
                    ) : (
                        <Tooltip
                            placement="top"
                            title={
                                <>
                                    {reactions["DISLIKE"]?.length > 0 ? (
                                        <div className="flex gap-2 flex-wrap">
                                            {reactions["DISLIKE"]?.map((el) => (
                                                <Tooltip
                                                    title={el.postBy?.username}
                                                >
                                                    <img
                                                        src={
                                                            el.postBy?.avatar ||
                                                            faker.image.avatar()
                                                        }
                                                        className="w-8 h-8 rounded-full"
                                                        alt="not found"
                                                    />
                                                </Tooltip>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>Bạn muốn bày tỏ cảm xúc này ?</div>
                                    )}
                                </>
                            }
                        >
                            <button
                                className="flex items-center gap-1 hover:text-red-500"
                                onClick={() => handleReactQuestion("DISLIKE")}
                            >
                                <span className="transition-transform transform hover:scale-150 hover:rotate-6">
                                    👎
                                </span>
                                <span
                                    className={`${
                                        userReacted?.reactionType ===
                                            "DISLIKE" &&
                                        "font-bold text-blue-600"
                                    }`}
                                >
                                    {reactions["DISLIKE"]?.length || 0}
                                </span>
                            </button>
                        </Tooltip>
                    )}

                    {loadingData["reaction"] === "LOVE" ? (
                        <Icons.AiOutlineLoading3Quarters
                            color="blue"
                            className="animate-spin"
                        />
                    ) : (
                        <Tooltip
                            placement="top"
                            title={
                                <>
                                    {reactions["LOVE"]?.length > 0 ? (
                                        <div className="flex gap-2 flex-wrap">
                                            {reactions["LOVE"]?.map((el) => (
                                                <Tooltip
                                                    title={el.postBy?.username}
                                                >
                                                    <img
                                                        src={
                                                            el.postBy?.avatar ||
                                                            faker.image.avatar()
                                                        }
                                                        className="w-8 h-8 rounded-full"
                                                        alt="not found"
                                                    />
                                                </Tooltip>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>Bạn muốn bày tỏ cảm xúc này ?</div>
                                    )}
                                </>
                            }
                        >
                            <button
                                className="flex items-center gap-1 hover:text-yellow-500"
                                onClick={() => handleReactQuestion("LOVE")}
                            >
                                <span className="transition-transform transform hover:scale-150 hover:rotate-6">
                                    ❤️
                                </span>
                                <span
                                    className={`${
                                        userReacted?.reactionType === "LOVE" &&
                                        "font-bold text-blue-600"
                                    }`}
                                >
                                    {reactions["LOVE"]?.length || 0}
                                </span>
                            </button>
                        </Tooltip>
                    )}

                    {loadingData["reaction"] === "SAD" ? (
                        <Icons.AiOutlineLoading3Quarters
                            color="blue"
                            className="animate-spin"
                        />
                    ) : (
                        <Tooltip
                            placement="top"
                            title={
                                <>
                                    {reactions["SAD"]?.length > 0 ? (
                                        <div className="flex gap-2 flex-wrap">
                                            {reactions["SAD"]?.map((el) => (
                                                <Tooltip
                                                    title={el.postBy?.username}
                                                >
                                                    <img
                                                        src={
                                                            el.postBy?.avatar ||
                                                            faker.image.avatar()
                                                        }
                                                        className="w-8 h-8 rounded-full"
                                                        alt="not found"
                                                    />
                                                </Tooltip>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>Bạn muốn bày tỏ cảm xúc này ?</div>
                                    )}
                                </>
                            }
                        >
                            <button
                                className="flex items-center gap-1 hover:text-yellow-500"
                                onClick={() => handleReactQuestion("SAD")}
                            >
                                <span className="transition-transform transform hover:scale-150 hover:rotate-6">
                                    😢
                                </span>
                                <span
                                    className={`${
                                        userReacted?.reactionType === "SAD" &&
                                        "font-bold text-blue-600"
                                    }`}
                                >
                                    {reactions["SAD"]?.length || 0}
                                </span>
                            </button>
                        </Tooltip>
                    )}

                    {loadingData["reaction"] === "ANGRY" ? (
                        <Icons.AiOutlineLoading3Quarters
                            color="blue"
                            className="animate-spin"
                        />
                    ) : (
                        <Tooltip
                            placement="top"
                            title={
                                <>
                                    {reactions["ANGRY"]?.length > 0 ? (
                                        <div className="flex gap-2 flex-wrap">
                                            {reactions["ANGRY"]?.map((el) => (
                                                <Tooltip
                                                    title={el.postBy?.username}
                                                >
                                                    <img
                                                        src={
                                                            el.postBy?.avatar ||
                                                            faker.image.avatar()
                                                        }
                                                        className="w-8 h-8 rounded-full"
                                                        alt="not found"
                                                    />
                                                </Tooltip>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>Bạn muốn bày tỏ cảm xúc này ?</div>
                                    )}
                                </>
                            }
                        >
                            <button
                                className="flex items-center gap-1 hover:text-yellow-500"
                                onClick={() => handleReactQuestion("ANGRY")}
                            >
                                <span className="transition-transform transform hover:scale-150 hover:rotate-6">
                                    😠
                                </span>
                                <span
                                    className={`${
                                        userReacted?.reactionType === "ANGRY" &&
                                        "font-bold text-blue-600"
                                    }`}
                                >
                                    {reactions["ANGRY"]?.length || 0}
                                </span>
                            </button>
                        </Tooltip>
                    )}
                </div>
                <div
                    className={`font-bold text-lg flex items-center gap-2 cursor-pointer ${
                        index === indexShowComment
                            ? "text-blue-600"
                            : "text-gray-600 "
                    }`}
                    onClick={() => {
                        if (!isLogged) {
                            notification.warning({
                                message:
                                    "Vui lòng đăng nhập để tham bình luận...",
                                duration: 3,
                                placement: "top",
                            });
                            return;
                        }
                        if (index === indexShowComment) setIndexShowComment(-1);
                        else setIndexShowComment(index);
                    }}
                >
                    {index === indexShowComment ? (
                        <Icons.FaChevronDown />
                    ) : (
                        <Icons.FaArrowLeft />
                    )}
                    <div>Bình luận </div>
                </div>
            </div>

            {indexShowComment == index && (
                <div className="px-4 py-4 border-t mt-2 relative">
                    {uploadUrls.length > 0 && (
                        <div className="flex gap-4 bg-gray-400 absolute top-[-40px] z-30 right-[10%] border rounded p-2">
                            {uploadUrls.map((link, index) => (
                                <div className="relative bg-white p-1 rounded">
                                    <ImageUploadPreview
                                        src={link}
                                        index={index}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="font-semibold text-sm mb-2 w-full">
                        Bình luận:
                    </div>
                    <div className="flex flex-col gap-2">
                        {data?.comments?.map((comment, index) => (
                            <div key={index} className="flex gap-4">
                                <div>
                                    <img
                                        src={
                                            comment?.user?.avatar ||
                                            faker.image.avatar()
                                        }
                                        className="w-8 h-8 rounded-full"
                                        alt={comment?.user?.username}
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="font-bold text-sm">
                                        {comment?.user?.username}
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        {comment?.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 ">
                        <TextArea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                            placeholder="Thêm bình luận..."
                        />
                        <div className="flex justify-between mt-2 items-center">
                            <div className="p-2">
                                <input
                                    id={`file-input`}
                                    className="hidden"
                                    onChange={(e) => handleUpload(e)}
                                    multiple
                                    type="file"
                                    accept={"image/*"}
                                />
                                <label htmlFor={`file-input`}>
                                    <Tooltip title={"Tải ảnh lên"}>
                                        <Icons.FaCameraRetro
                                            color="blue"
                                            size={24}
                                            className="cursor-pointer "
                                        />
                                    </Tooltip>
                                </label>
                            </div>
                            <button
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md "
                                onClick={() => {
                                    if (loadingData.comment) return;
                                    handleComment();
                                }}
                            >
                                {loadingData.comment ? (
                                    <Icons.AiOutlineLoading3Quarters className="animate-spin" />
                                ) : (
                                    <span>Gửi bình luận</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Question;
