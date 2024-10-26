import defaultImage from "assets/images/admin/defaultPreviewProduct.png";
import {Tooltip} from "antd";
import Icons from "../../../utils/icons";
import {MdDeleteForever} from "react-icons/md";
import {memo} from "react";
import useFileUpload from "../../../hooks/useUpload";

function ImageProductCtrl({images = [], setImages}) {

    const {uploadMultiple}  = useFileUpload()




    const ImagePreview = ({src}) => {
        return <img src={src} alt="Product" className="w-[120px] h-[80px] object-contain rounded-md cursor-pointer"/>;
    };

    const checkURLImage = (value) =>
        typeof value === "string" && value?.includes("http")
            ? value
            : URL.createObjectURL(value);

    return (
        <div className="p-2 flex-1 flex flex-col gap-4">
            <div>👉 Product Image</div>
            <div className="flex flex-wrap gap-2 w-full mt-2 h-full px-2 py-1">
                {Array.from({length: 8}).map((_, index) => (
                    <Tooltip
                        key={index}
                        title={
                            <div>
                                <div>
                                    <label htmlFor={`file-input-${index}`} className="cursor-pointer">
                                        {images[index] ? "Change" : "Upload"}
                                    </label>
                                    <input
                                        id={`file-input-${index}`}
                                        className="hidden"
                                        onChange={(e) =>
                                            setImages(Array.from(e.target.files), index)
                                        }
                                        multiple
                                        type="file"
                                        accept={"image/*"}
                                    />
                                </div>
                            </div>
                        }
                    >
                        <div
                            className={`relative border-2 mx-auto rounded-md ${!images[index] && "border-dotted"} group`}
                        >
                            <ImagePreview src={images[index] ? checkURLImage(images[index]) : defaultImage}/>
                            {
                                // images[index] &&
                                <div
                                    className={"absolute top-0 left-0 right-0 bottom-0 bg-slate-200 bg-opacity-70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"}>
                                <span className="text-white p-2 cursor-pointer" onClick={() =>
                                    setImages([null], index)
                                }>
                                    <Icons.MdDeleteForever color={"red"}/>
                                </span>
                                </div>
                            }
                        </div>
                    </Tooltip>
                ))}
            </div>
            <div className=" text-sm text-gray-600">
                <span>
                    ⚠️
                </span>
                Repeated images - Upload different images that feature the product.
            </div>
        </div>
    );
}

export default memo(ImageProductCtrl);
