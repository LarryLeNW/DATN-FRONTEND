import { createCategoryBlog, updateCategoryBlog } from "apis/categoryBlog.api";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import logo from "assets/images/logo.jpg";
import InputForm from "components/InputForm";
import MarkdownEditor from "components/MarkdownEditor";
import { useEffect, useState } from "react";
import { notification } from "antd";

function CategoryBlogForm({ closeModal, fetchData, categoryBlogCurrent }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm();

    const dispatch = useDispatch();
    const [description, setDescription] = useState("");

    useEffect(() => {
        const handleFillToForm = () => {
            if (categoryBlogCurrent) {
                setValue("name", categoryBlogCurrent.name);
                setDescription(categoryBlogCurrent.description || "");
            }
        };

        handleResetForm();
        if (categoryBlogCurrent?.categoryBlogId) handleFillToForm();
    }, [categoryBlogCurrent, setValue]);

    const handleResetForm = () => {
        reset();
    };
    const handleUpdate = async (data) => {
        dispatch(changeLoading());

        try {
            const categoryBlogData = { ...data, description };

            if (categoryBlogCurrent) {
                await updateCategoryBlog(
                    categoryBlogCurrent?.categoryBlogId,
                    categoryBlogData
                );
                notification.success({
                    message: "Cập nhật thành công",
                });
            } else {
                await createCategoryBlog(categoryBlogData);
                notification.success({
                    message: "Tạo thành công CategoryBlog",
                });
            }
            fetchData();
            closeModal();
        } catch (error) {
            console.error("lỗi categoryBlogData :", error);
        } finally {
            dispatch(changeLoading());
        }
    };

    return (
        <div className="flex flex-col justify-center items-center  ">
            <div className="flex flex-col justify-center  w-full items-center ">
                <img src={logo} alt="logo" className="w-20 object-contain" />
                <h2 className="text-center border border-y-main w-full bg-light text-white">
                    {categoryBlogCurrent
                        ? `Edit categoryBlog`
                        : "Create categoryBlog"}
                </h2>
            </div>

            <form
                onSubmit={handleSubmit(handleUpdate)}
                className="flex flex-col w-full gap-2 mt-2"
            >
                <InputForm
                    errors={errors}
                    id={"name"}
                    register={register}
                    fullWidth
                    validate={{
                        required: `Require this field`,
                    }}
                />
                <MarkdownEditor
                    height={200}
                    label={"Description : "}
                    name={"description"}
                    id={"description"}
                    value={description}
                    register={register}
                    validate={{}}
                    errors={errors}
                    setValue={setDescription}
                />
                <button
                    className="w-full p-2 bg-light text-lg text-white "
                    type="submit"
                >
                    {categoryBlogCurrent ? `Update` : "Create"}
                </button>
            </form>
        </div>
    );
}

export default CategoryBlogForm;
