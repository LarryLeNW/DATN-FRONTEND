import { notification, Progress, Tooltip } from "antd";
import { createQuestion, getQuestions } from "apis/question.api";
import React, { useEffect, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
import defaultPreviewImage from "assets/images/admin/defaultPreviewProduct.png";

import moment from "moment";
import "moment/locale/vi";
import Question from "./Question";
import { useSelector } from "react-redux";
import Icons from "utils/icons";
import useFileUpload from "hooks/useUpload";
moment.locale("vi");

function FAQ() {
    const [question, setQuestion] = useState();
    const [page, setPage] = useState(1);
    const [indexShowComment, setIndexShowComment] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [uploadUrls, setUploadUrls] = useState([]);
    const { upload } = useFileUpload();
    const [uploadProgress, setUploadProgress] = useState([]);
    const [questionText, setQuestionText] = useState("");

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

    const handleUploadImageQuestion = async (e) => {
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

    const fetchQuestions = async () => {
        try {
            const res = await getQuestions();
            setQuestion(res.result);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 2,
            });
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [page]);

    const topQuestionUserPanel = useMemo(
        () => (
            <div className="relative flex-1">
                <aside className="sticky top-20 w-full bg-white px-4 py-6 rounded-lg shadow-md min-h-[85vh]">
                    <h2 className="text-sm font-semibold mb-4 text-gray-600 ">
                        Top đóng góp câu hỏi
                    </h2>
                </aside>
            </div>
        ),
        []
    );

    const handleCreateQuestion = async () => {
        if (!questionText && uploadUrls.length === 0) {
            notification.warning({
                message: "Vui lòng nhập hoặc tải ảnh cho bình luận",
                duration: 1,
                placement: "top",
            });
            return;
        }
        try {
            const res = await createQuestion({
                questionText,
                images: uploadUrls.join(","),
            });

            setQuestion((prev) => ({
                ...prev,
                content: [...prev?.content, res.result],
            }));

            notification.success({
                message: "Cảm ơn góp ý của bạn",
                duration: 1,
                placement: "top",
            });

            setUploadProgress([]);
            setQuestionText("");
            setUploadUrls([]);
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 1,
                placement: "top",
            });
        }
    };

    const questionRender = useMemo(
        () => (
            <div className="w-4/5 rounded pb-4 px-2">
                <div className="flex gap-2 bg-slate-400 rounded p-2 my-2">
                    <img
                        src={faker.image.avatar()}
                        className="rounded-full w-7 h-7 border"
                        alt={faker.name.firstName()}
                    />
                    <div className="rounded-md bg-gray-500 flex-1 flex flex-col">
                        {uploadUrls.length > 0 && (
                            <div className="flex gap-4  z-30   rounded p-2">
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
                        <textarea
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            type="text"
                            placeholder="Bạn đang thắc mắc điều gì, đăng câu hỏi ngay..."
                            className="bg-gray-500 text-white px-2 outline-none py-2 rounded-md"
                        />
                        <div className="flex justify-between items-center p-2">
                            <input
                                id={`file-input-question`}
                                className="hidden"
                                multiple
                                type="file"
                                onChange={(e) => handleUploadImageQuestion(e)}
                                accept={"image/*"}
                            />
                            <label htmlFor={`file-input-question`}>
                                <Tooltip title={"Tải ảnh lên"}>
                                    <Icons.FaCameraRetro
                                        size={20}
                                        className="cursor-pointer text-slate-200"
                                    />
                                </Tooltip>
                            </label>

                            <Icons.IoMdSend
                                onClick={() => handleCreateQuestion()}
                                size={28}
                                className="cursor-pointer text-blue-500"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    {question?.content
                        ?.sort(
                            (a, b) =>
                                new Date(b.updatedAt).getTime() -
                                new Date(a.updatedAt).getTime()
                        )
                        .map((el, index) => (
                            <Question
                                data={el}
                                index={index}
                                indexShowComment={indexShowComment}
                                setIndexShowComment={setIndexShowComment}
                                setData={(data) => {
                                    setQuestion((prevData) => {
                                        const updatedContent = [
                                            ...prevData.content,
                                        ];
                                        updatedContent[index] = data;
                                        return {
                                            ...prevData,
                                            content: updatedContent,
                                        };
                                    });
                                }}
                            />
                        ))}
                </div>
            </div>
        ),
        [
            question,
            indexShowComment,
            setIndexShowComment,
            questionText,
            uploadUrls,
        ]
    );

    return (
        <div className="flex flex-col">
            <div className="bg-gray-100 min-h-screen flex pt-10 px-2 gap-2 md:px-8">
                {topQuestionUserPanel}
                {questionRender}
            </div>
        </div>
    );
}

export default FAQ;
