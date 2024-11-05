import { notification, Select } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import logo from "assets/images/logo.jpg";
import InputForm from "components/InputForm";
import { convertImageToBase64 } from "utils/helper";
import MarkdownEditor from "components/MarkdownEditor";
import { changeLoading } from "store/slicers/common.slicer";
import { createBlog, updateBlog } from "apis/blog.api";
import { useDispatch } from "react-redux";
import { getCategoryBlog } from "apis/categoryBlog.api";

function BlogForm({ closeModal, fetchData, blogCurrent }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm();

    const dispatch = useDispatch();
    const [imgUploads, setImgUploads] = useState([]); // File ảnh được upload
    const [previewImgs, setPreviewImgs] = useState([]); // URL preview ảnh
    const [categoryBlog, setCategoryBlog] = useState([]);
    const [selectedCategoryBlog, setSelectedCategoryBlog] = useState(null);
    const [content, setContent] = useState("");

    const fetchCategoryBlog = async () => {
        const params = { limit: 30 };
        const res = await getCategoryBlog(params);
        setCategoryBlog(res?.result?.content);
        setSelectedCategoryBlog(blogCurrent?.categoryBlogName);
    };

    useEffect(() => {
        const handleFillToForm = async () => {
            setValue("title", blogCurrent["title"]);
            setContent(blogCurrent?.content);

            if (blogCurrent?.images) {
                const images = blogCurrent.images.split(","); // Chuyển chuỗi ảnh thành mảng
                setPreviewImgs(images);
            }
        };

        fetchCategoryBlog();
        handleResetForm();
        if (blogCurrent) handleFillToForm();
    }, [blogCurrent]);

    const handleResetForm = () => {
        reset();
        setImgUploads([]);
        setPreviewImgs([]);
    };

    const handleUpdate = async (data) => {
        if (content) data = { ...data, content };

        if (imgUploads.length === 0) {
            notification.error({ message: "Please upload at least one image" });
            return;
        }

        data = { ...data, categoryBlogId: selectedCategoryBlog, userId: 123 };

        const formData = new FormData();
        imgUploads.forEach((file) => formData.append("images", file));
        formData.append("blogData", JSON.stringify(data));

        try {
            dispatch(changeLoading());
            if (blogCurrent?.id) {
                await updateBlog(blogCurrent.id, formData);
                notification.success({ message: "Cập nhật thành công" });
            } else {
                await createBlog(formData);
                notification.success({ message: "Tạo thành công" });
            }
            await fetchData();
            closeModal();
        } catch (error) {
            notification.error({
                message: `${
                    blogCurrent?.id ? "Cập nhật" : "Tạo"
                } không thành công: ${error.message}`,
            });
        } finally {
            dispatch(changeLoading());
        }
    };

    const handleOnChangeThumb = async (files) => {
        const selectedFiles = Array.from(files);
        const previews = await Promise.all(
            selectedFiles.map((file) => convertImageToBase64(file))
        );
        setPreviewImgs((prev) => [...prev, ...previews]); // Thêm ảnh mới
        setImgUploads((prev) => [...prev, ...selectedFiles]); // Cập nhật file ảnh
    };

    const handleRemoveImage = (index) => {
        setPreviewImgs((prev) => prev.filter((_, i) => i !== index));
        setImgUploads((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-col justify-center w-full items-center">
                <img src={logo} alt="logo" className="w-20 object-contain" />
                <h2 className="text-center border border-y-main w-full bg-light text-white">
                    {blogCurrent ? `Edit Blog` : "Create Blog"}
                </h2>
            </div>

            <form
                onSubmit={handleSubmit(handleUpdate)}
                className="flex flex-col w-full gap-2 mt-2"
            >
                <div className="flex items-center gap-8 justify-center">
                    <span className="font-bold">Thumb nails</span>
                    <label
                        className="h-[160px] w-[160px] border-2 border-main p-2 flex justify-center items-center cursor-pointer"
                        htmlFor="thumbnail"
                    >
                        <h1 className="font-bold text-blue-600">
                            Chọn hình ảnh
                        </h1>
                    </label>
                </div>

                <input
                    type="file"
                    id="thumbnail"
                    accept=".jpg, .jpeg, .png"
                    multiple
                    onChange={(e) => handleOnChangeThumb(e.target.files)}
                    className="hidden"
                />

                <div className="grid grid-cols-3 gap-4 mt-4">
                    {previewImgs.map((img, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={img}
                                alt={`Preview ${index}`}
                                className="object-cover w-full h-[100px] rounded"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                                Xóa
                            </button>
                        </div>
                    ))}
                </div>
                <br />
                <div className="flex gap-4 px-2 py-4 border rounded border-black">
                    <label
                        htmlFor="category"
                        className="text-lg font-bold text-nowrap text-black"
                    >
                        CategoryBlog:
                    </label>
                    <Select
                        showSearch
                        id="categoryBlog"
                        title="categoryBlog"
                        allowClear
                        placeholder={
                            errors?.categoryBlog
                                ? "Required a category"
                                : "Select a category"
                        }
                        className={`w-full text-lg font-bold ${
                            errors["category"]
                                ? "shadow-md shadow-red-500 rounded-lg text-red-500"
                                : ""
                        }`}
                        value={selectedCategoryBlog}
                        optionFilterProp="label"
                        options={categoryBlog?.map((el) => ({
                            label: el?.name,
                            value: el?.categoryBlogId,
                        }))}
                        onChange={(value) => setSelectedCategoryBlog(value)}
                    />
                </div>
                <br />

                <InputForm
                    errors={errors}
                    id={"title"}
                    register={register}
                    fullWidth
                    validate={{ required: `Require this field` }}
                />

                <MarkdownEditor
                    height={200}
                    label={"Content :"}
                    name={"content"}
                    id={"content"}
                    value={content}
                    register={register}
                    validate={{}}
                    errors={errors}
                    setValue={setContent}
                />

                <button
                    className="w-full p-2 bg-light text-lg text-white"
                    type="submit"
                >
                    {blogCurrent ? `Update` : "Create"}
                </button>
            </form>
        </div>
    );
}

export default BlogForm;
