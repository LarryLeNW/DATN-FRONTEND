import { Input } from "antd";
import logo from "assets/images/logo.jpg";
import { useState } from "react";
import defaultImage from "assets/images/admin/defaultPreviewProduct.png";
import Button from "components/Button";
import Icons from "utils/icons";

function UrlFormModal({ onConfirm, indexStart }) {
    const [urlForm, setUrlForm] = useState([]);

    const ImagePreview = ({ src }) => {
        return (
            <img
                src={src}
                alt="Product"
                className="w-[120px] h-[80px] object-contain rounded-md cursor-pointer group relative"
            />
        );
    };

    const changeURL = (value, index) => {
        const updatedUrlForm = [...urlForm];
        if (index >= 0) updatedUrlForm[index] = value;
        else updatedUrlForm.push(value);
        setUrlForm(updatedUrlForm);
    };

    const handleConfirm = () => {
        onConfirm(urlForm, indexStart);
        setUrlForm([]);
    };

    const removeUrl = (index) => {
        const updatedUrlForm = [...urlForm];
        updatedUrlForm.splice(index, 1);
        setUrlForm(updatedUrlForm);
    };

    return (
        <div className="flex flex-col justify-center items-center  ">
            <div className="flex flex-col justify-center  w-full items-center ">
                <img src={logo} alt="logo" className="w-20 object-contain" />
                <h2 className="text-center border border-y-main w-full bg-light text-white">
                    Enter URL
                </h2>
                <div className="p-2 flex flex-col gap-2 w-full">
                    {urlForm.map((el, index) => (
                        <div
                            className="flex justify-between items-center border border-dotted rounded p-4 gap-4 w-full "
                            key={index}
                        >
                            {urlForm.length && (
                                <span
                                    className="text-white p-2 cursor-pointer"
                                    onClick={() => removeUrl(index)}
                                >
                                    <Icons.MdDeleteForever color={"red"} />
                                </span>
                            )}
                            <Input
                                placeholder="enter link your image..."
                                value={el}
                                onChange={(e) =>
                                    changeURL(e.target.value, index)
                                }
                            />
                            <ImagePreview src={el || defaultImage} />
                        </div>
                    ))}

                    {(!urlForm.length || urlForm[urlForm.length - 1]) && (
                        <div
                            className="flex justify-between items-center border border-dotted rounded p-4 gap-4 w-full"
                            data-aos={"fade"}
                            key={urlForm.length}
                        >
                            <Input
                                placeholder="enter link your image..."
                                onChange={(e) => changeURL(e.target.value, -1)}
                            />
                            <ImagePreview src={defaultImage} />
                        </div>
                    )}

                    <Button
                        name={"Confirm"}
                        fw
                        style={
                            "bg-green-700 px-4 py-2 cursor-pointer rounded text-white"
                        }
                        handleClick={handleConfirm}
                    />
                </div>
            </div>
        </div>
    );
}

export default UrlFormModal;
