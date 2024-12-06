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
    const { isLogged } = useSelector((state) => state.auth);
    const { upload } = useFileUpload();
    const [uploadProgress, setUploadProgress] = useState([]);
    const [loadingData, setLoadingData] = useState({
        comment: false,
    });
    const [uploadUrls, setUploadUrls] = useState([
        "https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/2341830/pexels-photo-2341830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/2341830/pexels-photo-2341830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ]);

    const handleComment = async () => {
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

            setData({ ...data, replies: [...data.replies, res.result] });
            setUploadProgress([]);
            setCommentText("");
            setUploadUrls([]);

            console.log("🚀 ~ handleComment ~ res:", res);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 1,
                placement: "top",
            });
        }

        setLoadingData((prev) => ({ ...prev, comment: false }));
    };

    useEffect(() => {
        if (data?.reactions?.length >= 1) {
            const filterReacts = {};
            data.reactions.forEach((react) => {
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

    const renderReply = (data, replyTo) =>
        data?.map((reply) => (
            <div
                className={`flex flex-col gap-4   p-2 ml-2 ${
                    replyTo
                        ? "border-l border-blue-400  border-dotted ml-4"
                        : "border border-blue-600 rounded"
                }`}
            >
                <div className="flex gap-4 items-center">
                    <div>
                        <img
                            src={reply?.postBy?.avatar || faker.image.avatar()}
                            className={` rounded-full ${
                                replyTo ? "w-5 h-5" : "w-8 h-8"
                            } `}
                            alt={reply?.postBy?.username}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div
                            className={`font-bold ${
                                replyTo ? "text-sm" : "text-lg"
                            }`}
                        >
                            {reply?.postBy?.username}
                        </div>
                        <div className="text-gray-500">
                            {moment(reply?.createdAt).fromNow()}
                        </div>
                    </div>
                </div>
                <div>
                    {replyTo && (
                        <span className="font-bold ">@{replyTo.username} </span>
                    )}
                    <span>{reply?.replyText}</span>
                </div>
                {reply?.images?.length > 0 && (
                    <div className="flex gap-2 px-2">
                        {reply?.images?.split(",").map((img, index) => (
                            <div key={index} className="border p-2 rounded">
                                <img
                                    src={img}
                                    alt={img}
                                    className="object-cover w-12 h-12 rounded-md"
                                />
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex justify-end font-bold text-blue-700 cursor-pointer">
                    Trả lời
                </div>

                {reply?.childReplies &&
                    renderReply(reply?.childReplies, reply?.postBy)}
            </div>
        ));

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
                </div>
                <div className="flex-1 overflow-auto border-l border-b p-2 max-h-96 flex flex-col gap-2">
                    {data.replies?.length > 0 ? (
                        renderReply(data.replies)
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
                <div className="flex gap-6 px-4 py-2 text-gray-600">
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
                        <button className="flex items-center gap-1 hover:text-blue-500">
                            <span>👍</span>
                            <span>{reactions["LIKE"]?.length || 0}</span>
                        </button>
                    </Tooltip>

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
                        <button className="flex items-center gap-1 hover:text-red-500">
                            <span>👎</span>
                            <span>{reactions["DISLIKE"]?.length || 0}</span>
                        </button>
                    </Tooltip>

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
                        <button className="flex items-center gap-1 hover:text-yellow-500">
                            <span>❤️</span>
                            <span>{reactions["LOVE"]?.length || 0}</span>
                        </button>
                    </Tooltip>

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
                        <button className="flex items-center gap-1 hover:text-yellow-500">
                            <span>😢</span>
                            <span>{reactions["SAD"]?.length || 0}</span>
                        </button>
                    </Tooltip>

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
                        <button className="flex items-center gap-1 hover:text-yellow-500">
                            <span>😠</span>
                            <span>{reactions["ANGRY"]?.length || 0}</span>
                        </button>
                    </Tooltip>
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
