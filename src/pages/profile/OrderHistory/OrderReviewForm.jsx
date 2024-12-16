import { Button, Input, notification, Progress } from "antd";
import TextArea from "antd/es/input/TextArea";
import logo from "assets/logo.png";
import useFileUpload from "hooks/useUpload";
import { useState } from "react";
import ReactStars from "react-stars";
import Icons from "utils/icons";
import defaultPreviewImage from "assets/images/admin/defaultPreviewProduct.png";
import { createReview } from "apis/review.api";

function OrderReviewForm({ data, closeModal, fetchData }) {
    const [stars, setStars] = useState(5);
    const [review_text, setReviewText] = useState("");
    const { upload } = useFileUpload();
    const [uploadProgress, setUploadProgress] = useState([]);
    const [uploadUrls, setUploadUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const convertStarDesc = (stars) => {
        if (stars === 5) return "Tuyệt vời";
        if (stars === 4) return "Hài lòng";
        if (stars === 3) return "Bình thường";
        if (stars === 2) return "Không hài lòng";
        if (stars === 1) return "Tệ";
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

    const handleSubmitReview = async () => {
        setIsLoading(true);
        try {
            await createReview({
                detailOrderId: data.id,
                productId: data.productId,
                review_text,
                rating: stars,
                ...(uploadUrls.length > 0 && { images: uploadUrls.join(",") }),
            });
            notification.success({
                message: "Cảm ơn đánh giá của bạn.",
                duration: 2,
                placement: "top",
            });
            closeModal();
            fetchData();
        } catch (error) {
            notification.warning({
                message: error.message,
                duration: 2,
                placement: "top",
            });
        }

        setIsLoading(false);
    };

    return (
        <div className="px-4 py-2 ">
            <div className="bg-slate-100 p-2">
                <div className="bg-gradient-to-r from-primary to-secondary p-2 text-lg rounded text-white flex gap-2 items-center">
                    <img src={logo} alt="Logo" className="h-8 w-8" />
                    <span>
                        Chúng tôi cần đánh giá của bạn để cải thiện chất lượng
                        dịch vụ
                    </span>
                </div>
                <div className="flex gap-2 mt-2">
                    <div className="flex gap-4">
                        <img
                            src={data?.sku?.images?.split(",")[0]}
                            alt={data?.sku?.images?.split(",")[0]}
                            className="w-32 h-32 object-cover rounded border border-primary"
                        />
                        <div className="flex flex-col gap-2">
                            <div className="text-xl font-bold">
                                {data?.productName}
                            </div>
                            <div className="flex gap-2">
                                <p className="text-gray-600 text-lg">
                                    Phân loại hàng
                                    {Object.values(data?.sku?.attributes).map(
                                        (el) => " | " + el
                                    )}{" "}
                                </p>
                            </div>

                            <div className="flex gap-4 items-center text-2xl mt-auto ">
                                <div>Chất lượng sản phẩm</div>
                                <ReactStars
                                    size={36}
                                    half={false}
                                    value={stars}
                                    onChange={(value) => setStars(value)}
                                />
                                <div className="italic text-primary ">
                                    {convertStarDesc(stars)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-2 rounded p-2 bg-white ">
                    <TextArea
                        cols={5}
                        value={review_text}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với những người mua khác nhé."
                        className="text-lg"
                    />
                    <div className="flex justify-between mt-4 ">
                        {uploadUrls.length > 0 && (
                            <div className="flex gap-4 bg-gray-400 border rounded p-2 flex-wrap">
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
                        <Button className="ml-auto flex">
                            <label
                                htmlFor={`file-input`}
                                className="flex items-center gap-2"
                            >
                                <Icons.FaCameraRetro />
                                <span>Thêm hình ảnh</span>
                            </label>
                        </Button>
                    </div>
                    <input
                        id={`file-input`}
                        className="hidden"
                        onChange={(e) => handleUpload(e)}
                        multiple
                        type="file"
                        accept={"image/*"}
                    />
                    <div className="mt-2 flex gap-2 ">
                        <Button
                            className="text-lg border-yellow-400 text-yellow-500 px-8"
                            onClick={() => closeModal()}
                        >
                            Trở lại
                        </Button>
                        <Button
                            className="flex-1 text-lg bg-primary text-white"
                            disabled={isLoading}
                            onClick={() => handleSubmitReview()}
                        >
                            <span>
                                {isLoading ? "Loading..." : "Hoàn thành"}
                            </span>
                            {isLoading && (
                                <Icons.AiOutlineLoading3Quarters className="text-blue-600 font-bold animate-spin" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderReviewForm;
