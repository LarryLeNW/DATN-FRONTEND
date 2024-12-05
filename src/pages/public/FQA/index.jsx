import { notification } from "antd";
import { getQuestions } from "apis/question.api";
import React, { useEffect, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";

import moment from "moment";
import "moment/locale/vi";
import Question from "./Question";
import { useSelector } from "react-redux";
moment.locale("vi");

function FAQ() {
    const [question, setQuestion] = useState();
    const [page, setPage] = useState(1);
    const [indexShowComment, setIndexShowComment] = useState();
    const [isLoading, setIsLoading] = useState(false);

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

    const productsRender = useMemo(
        () => (
            <div className="w-4/5 rounded pb-4 px-2">
                <div className="flex flex-col gap-4">
                    {question?.content?.map((el, index) => (
                        <Question
                            data={el}
                            index={index}
                            indexShowComment={indexShowComment}
                            setIndexShowComment={setIndexShowComment}
                        />
                    ))}
                </div>
            </div>
        ),
        [question, indexShowComment, setIndexShowComment]
    );

    return (
        <div className="flex flex-col">
            <div className="bg-gray-100 min-h-screen flex pt-10 px-2 gap-2 md:px-8">
                {topQuestionUserPanel}
                {productsRender}
            </div>
        </div>
    );
}

export default FAQ;
