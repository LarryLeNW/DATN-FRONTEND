import { notification, Select } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import logo from "assets/images/logo.jpg";
import InputForm from "components/InputForm";
import { convertBase64ToImage, convertImageToBase64 } from "utils/helper";
import MarkdownEditor from "components/MarkdownEditor";
import { changeLoading } from "store/slicers/common.slicer";
import { createBlog, updateBlog } from "apis/blog.api";
import { useDispatch, useSelector } from "react-redux";
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
    const [previewImg, setPreviewImg] = useState(null);
    const [imgUpload, setImageUpload] = useState(null);
    const [categoryBlog, setCategoryBlog] = useState([]);
    const [selectedCategoryBlog, setSelectedCategoryBlog] = useState(null);
    const [content, setContent] = useState("");
    const userInfo = useSelector((state) => state.auth.userInfo.data);

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

            if (blogCurrent?.image) {
                setPreviewImg(blogCurrent?.image);
                console.log(blogCurrent?.image);
                let file = await convertBase64ToImage(blogCurrent?.image);
                setImageUpload(file);
            }
        };
        fetchCategoryBlog();
        handleResetForm();
        if (blogCurrent?.blogId) handleFillToForm();
    }, [blogCurrent]);

    const handleResetForm = () => {
        reset();
        setImageUpload(null);
        setPreviewImg(null);
    };

    const handleUpdate = async (data) => {

        if (content) data = { ...data, content };
        if (!imgUpload) {
            notification.error({ message: "Please upload an image" });
            return;
        }
        data = { ...data, categoryBlogId: selectedCategoryBlog, userId: userInfo.id };

        const formData = new FormData();

        formData.append("image", imgUpload);
        formData.append("blogData", JSON.stringify(data));

        try {
            dispatch(changeLoading());
            if (blogCurrent?.blogId) {
                await updateBlog(blogCurrent?.blogId, formData);
                notification.success({ message: "Cập nhật thành công" });
            } else {
                await createBlog(formData);
                notification.success({ message: "Tạo thành công" });
            }
            await fetchData();
            closeModal();
        } catch (error) {
            notification.error({
                message: `${blogCurrent?.blogId ? "Cập nhật" : "Tạo"
                    } không thành công: ${error.message}`,
            });
        } finally {
            dispatch(changeLoading());
        }
    };

    const handleOnchangeThumb = async (file) => {
        if (file.type !== "image/png" && file.type !== "image/jpeg") {
            notification.error({ message: "File not supported..." });
            return;
        }
        let base64 = await convertImageToBase64(file);
        setPreviewImg(base64);
        setImageUpload(file);
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
                    <span className="font-bold">Thumb nail </span>
                    <label
                        className="h-[160px] w-[160px] border-2 border-main p-2 flex justify-center items-center"
                        htmlFor="thumbnail"
                    >
                        {previewImg ? (
                            <img
                                src={previewImg}
                                alt=""
                                className="object-contain w-full h-full"
                            />
                        ) : (
                            <h1 className="font-bold text-blue-600 ">
                                Chọn hình ảnh
                            </h1>
                        )}
                    </label>
                </div>
                <input
                    type="file"
                    id="thumbnail"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => handleOnchangeThumb(e.target.files[0])}
                    className="hidden"
                />
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
                        className={`w-full text-lg font-bold ${errors["category"]
                            ? "shadow-md shadow-red-500 rounded-lg text-red-500"
                            : ""
                            }`}
                        value={selectedCategoryBlog || (categoryBlog?.[0]?.categoryBlogId ?? null)}
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
                    height={600}
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
