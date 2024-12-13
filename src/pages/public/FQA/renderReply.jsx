import ReplyItem from "./ReplyItem";

const renderReply = (data, questionData, replyTo) =>
    data
        .sort(
            (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
        )
        .map((reply) => (
            <ReplyItem
                data={reply}
                questionData={questionData}
                replyTo={replyTo}
            />
        ));

export default renderReply;
