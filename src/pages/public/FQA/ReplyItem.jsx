import { faker } from "@faker-js/faker";
import moment from "moment";
import renderReply from "./renderReply";
import { useState } from "react";
import { notification, Progress, Tooltip } from "antd";
import Icons from "utils/icons";
import Button from "components/Button";
import useFileUpload from "hooks/useUpload";
import defaultPreviewImage from "assets/images/admin/defaultPreviewProduct.png";
import { replyQuestion } from "apis/replyQuestion.api";
import { useSelector } from "react-redux";

function ReplyItem({ data, questionData, replyTo }) {
    const { isLogged, userInfo } = useSelector((state) => state.auth);
    const [isShowCommentPanel, setIsShowCommentPanel] = useState(false);
    const [uploadProgress, setUploadProgress] = useState([]);
    const { upload } = useFileUpload();
    const [uploadUrls, setUploadUrls] = useState([]);
    const [replyText, setReplyText] = useState("");
    const [isReplyLoading, setIsReplyLoading] = useState(false);

    const handleReply = async () => {
        if (!replyText && uploadUrls.length === 0) {
            notification.warning({
                message: "Vui lòng nhập hoặc tải ảnh cho bình luận",
                duration: 1,
                placement: "top",
            });
            return;
        }

        setIsReplyLoading(true);
        try {
            const res = await replyQuestion({
                replyText,
                images: uploadUrls.join(","),
                questionId: questionData.id,
                parentId: data.id,
            });

            if (Array.isArray(data.childReplies))
                data.childReplies = [...data.childReplies, res.result];
            else {
                data.childReplies = [res.result];
            }

            notification.success({
                message: "Cảm ơn góp ý của bạn",
                duration: 1,
                placement: "top",
            });

            setUploadProgress([]);
            setReplyText("");
            setUploadUrls([]);
            setIsShowCommentPanel(false);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 1,
                placement: "top",
            });
        }

        setTimeout(() => {
            setIsReplyLoading(true);
        }, 1000);
    };

    const ImageUploadPreview = ({ src, index }) => {
        return (
            <div className="relative bg-slate-300">
                <div
                    className="top-0 right-0 absolute cursor-pointer  p-1 bg-white text-sm rounded-l rounded-b"
                    onClick={() =>
                        setUploadUrls((prev) => prev.filter((el) => el != src))
                    }
                >
                    <Icons.MdDeleteForever color="red" />
                </div>
                <img
                    src={src || defaultPreviewImage}
                    alt={src}
                    className="w-20 h-20 object-cover"
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

        for (let i = 0; i < filesReceived.length && i <= 7; i++) {
            uploadPromises.push(upload(filesReceived[i], uploadProgress, i));
        }

        const urls = await Promise.all(uploadPromises);

        setUploadUrls(urls);
        setUploadProgress([]);
    };

    return (
        <div
            className={`flex flex-col gap-4  p-2 ml-2 ${
                replyTo
                    ? "border-l border-blue-400  border-dotted ml-4"
                    : "border border-blue-600 rounded"
            }`}
        >
            <div className="flex gap-4 items-center">
                <div>
                    <img
                        src={data?.postBy?.avatar || faker.image.avatar()}
                        className={` rounded-full ${
                            replyTo ? "w-5 h-5" : "w-8 h-8"
                        } `}
                        alt={data?.postBy?.username}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <div
                        className={`font-bold ${
                            replyTo ? "text-sm" : "text-lg"
                        }`}
                    >
                        {userInfo?.data?.id === data?.postBy?.id
                            ? "You"
                            : data?.postBy?.username}
                    </div>
                    <div className="text-gray-500">
                        {moment(data?.createdAt).fromNow()}
                    </div>
                </div>
            </div>
            <div>
                {replyTo && userInfo.data.id !== data?.postBy?.id && (
                    <span className="font-bold ">
                        @{replyTo.postBy.username}{" "}
                    </span>
                )}
                <span>{data?.replyText}</span>
            </div>
            {data?.images?.length > 0 && (
                <div className="flex gap-2 px-2">
                    {data?.images?.split(",").map((img, index) => (
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
            <div
                className="flex justify-end font-bold text-blue-700 cursor-pointer"
                onClick={() => {
                    if (!isLogged) {
                        notification.warning({
                            message: "Vui lòng đăng nhập để trả lời",
                            duration: 1,
                            placement: "top",
                        });
                        return;
                    }
                    setIsShowCommentPanel(!isShowCommentPanel);
                    setUploadUrls([]);
                    setReplyText("");
                }}
            >
                {isShowCommentPanel ? (
                    <Icons.IoIosCloseCircleOutline size={24} color="red" />
                ) : (
                    <span>Trả lời</span>
                )}
            </div>
            {isShowCommentPanel && (
                <>
                    <div className="ml-4 flex gap-2 ">
                        <img
                            src={faker.image.avatar()}
                            className="rounded-full w-7 h-7 border"
                            alt={faker.name.firstName()}
                        />
                        <div className="rounded-md bg-gray-500 flex-1 flex flex-col">
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                type="text "
                                className="bg-gray-500 text-white px-2 outline-none py-2 rounded-md"
                            />
                            <div className="flex justify-between items-center p-2">
                                <input
                                    id={`file-input-reply-${data.id}`}
                                    className="hidden"
                                    onChange={(e) => handleUpload(e)}
                                    multiple
                                    type="file"
                                    accept={"image/*"}
                                />
                                <label htmlFor={`file-input-reply-${data.id}`}>
                                    <Tooltip title={"Tải ảnh lên"}>
                                        <Icons.FaCameraRetro
                                            size={20}
                                            className="cursor-pointer text-slate-200"
                                        />
                                    </Tooltip>
                                </label>

                                <Icons.IoMdSend
                                    onClick={() => handleReply()}
                                    size={28}
                                    className="cursor-pointer text-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto ml-8">
                        {uploadUrls.map((link, index) => (
                            <div className="relative bg-white p-1 rounded">
                                <ImageUploadPreview src={link} index={index} />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {data?.childReplies &&
                renderReply(data?.childReplies, questionData, data)}
        </div>
    );
}

export default ReplyItem;
