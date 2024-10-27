import defaultImage from "assets/images/admin/defaultPreviewProduct.png";
import { Modal, Progress, Tooltip } from "antd";
import { memo, useState } from "react";
import useFileUpload from "hooks/useUpload";
import Icons from "utils/icons";
import UrlFormModal from "./UrlFormModal";

function ImageProductCtrl({
    images,
    setImages,
    widthItems = "120px",
    heightItems = "120px",
    isWarning = true,
    title,
}) {
    const { upload } = useFileUpload();
    const [progress, setProgress] = useState([]);
    const [isShowModalInputURL, setIsShowModalInputURL] = useState(false);
    const [indexStart, setIndexStart] = useState(null);

    const ImagePreview = ({ src }) => {
        return (
            <img
                src={src}
                alt="Product"
                style={{
                    width: widthItems,
                    height: heightItems,
                }}
                className={` object-contain rounded-md cursor-pointer`}
            />
        );
    };

    const handleUpload = async (e, index) => {
        const filesReceived = e.target.files;

        const uploadProgress = (percent, fileIndex) => {
            setProgress((prevProgress) => {
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
        handleSetImages(urls, index);
        setProgress([]);
    };

    const handleSetImages = (urls, indexStart) => {
        const newImgs = [...images];
        urls.forEach((url, i) => {
            if (indexStart + i <= 7) newImgs[indexStart + i] = url;
        });
        setImages(newImgs);
        setIsShowModalInputURL(false);
    };

    const removeImage = (index) => {
        const imageUpdated = [...images];
        imageUpdated.splice(index, 1);
        setImages(imageUpdated);
    };

    return (
        <div className="p-2 flex-1 flex flex-col gap-4">
            <Modal
                width={800}
                open={isShowModalInputURL}
                onCancel={() => setIsShowModalInputURL(false)}
                footer={false}
            >
                <UrlFormModal
                    onConfirm={handleSetImages}
                    indexStart={indexStart}
                />
            </Modal>
            {title && <div>👉 {title}</div>}
            <div className="flex flex-wrap gap-2 w-full mt-2 h-full px-2 py-1">
                {Array.from({ length: 8 }).map((_, index) => (
                    <Tooltip
                        key={index}
                        color="white"
                        title={
                            <>
                                <div className="flex flex-col gap-2 items-center justify-center text-black">
                                    <span className="text-lg font-bold">
                                        Upload
                                    </span>
                                    <div className="flex gap-4">
                                        <label
                                            htmlFor={`file-input-${index}`}
                                            className="cursor-pointer border p-2 flex gap-1 items-center"
                                        >
                                            <Icons.RiComputerLine />
                                            <span> File Local</span>
                                        </label>
                                        <input
                                            id={`file-input-${index}`}
                                            className="hidden"
                                            onChange={(e) =>
                                                handleUpload(e, index)
                                            }
                                            multiple
                                            type="file"
                                            accept={"image/*"}
                                        />
                                        <div
                                            className="cursor-pointer border p-2 flex gap-1 items-center"
                                            onClick={() => {
                                                setIsShowModalInputURL(true);
                                                setIndexStart(index);
                                            }}
                                        >
                                            <Icons.FaLink />
                                            <span>Enter url</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    >
                        <div
                            className={`relative border-2 mx-auto rounded-md ${
                                !images[index] && "border-dotted"
                            } group`}
                        >
                            <ImagePreview src={images[index] || defaultImage} />
                            {progress[index] !== undefined &&
                                progress[index] > 0 && (
                                    <div
                                        className={
                                            "absolute top-0 left-0 right-0 bottom-0 bg-slate-200 bg-opacity-70 flex items-center justify-center transition-opacity duration-300"
                                        }
                                    >
                                        <span
                                            className="text-white p-2 cursor-pointer"
                                            onClick={() =>
                                                setImages([null], index)
                                            }
                                        >
                                            <Progress
                                                type="circle"
                                                percent={progress[index]}
                                                size={32}
                                            />
                                        </span>
                                    </div>
                                )}
                            {images[index] && (
                                <div
                                    className={
                                        "absolute top-0 left-0 right-0 bottom-0 bg-slate-200 bg-opacity-70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
                                    }
                                >
                                    <span
                                        className="text-white p-2 cursor-pointer"
                                        onClick={() => removeImage(index)}
                                    >
                                        <Icons.MdDeleteForever color={"red"} />
                                    </span>
                                </div>
                            )}
                        </div>
                    </Tooltip>
                ))}
            </div>
            {isWarning && (
                <div className="text-sm text-gray-600">
                    <span>⚠️</span> Repeated images - Upload different images
                    that feature the product.
                </div>
            )}
        </div>
    );
}

export default memo(ImageProductCtrl);
