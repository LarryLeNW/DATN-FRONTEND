import { Modal, notification, Pagination } from "antd";
import { deleteCategoryBlog, getCategoryBlog } from "apis/categoryBlog";
import Button from "components/Button";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { changeLoading } from "store/slicers/common.slicer";
import Icons from "utils/icons";
import CategoryBlogForm from "./CategoryBlogForm";
import { data } from "autoprefixer";

function CategoryBlogManager() {

    const dispatch = useDispatch();

    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [categoryBlog, setCategoryBlog] = useState([]);
    const [editCategoryBlog, setEditCategoryBlog] = useState(null);
    const [isShowModal, setIsShowModal] = useState(false);

    const fetchCategoryBlog = async () => {
        dispatch(changeLoading());
        try {
            const params = {
                limit,
                page,
            };
            const res = await getCategoryBlog(params);
            setCategoryBlog(res?.result?.content)
            setTotalPages(res?.result?.totalPages);
            setTotalElements(res?.result?.totalElements);
        } catch (message) {
            notification.error({ message, duration: 2 });
        }
        dispatch(changeLoading());
    };
    useEffect(() => {
        fetchCategoryBlog();
    }, [page, limit])

    const openFormUpdate = (item) => {
        setEditCategoryBlog(item)
        setIsShowModal(true)
    }
    const handleDelete = async (id) => {
        dispatch(changeLoading());
        try {
            await deleteCategoryBlog(id);
            notification.success({ message: "Delete Successfully" });
            fetchCategoryBlog();
        } catch (error) {
            const message =
                error.code == 1009
                    ? "Sản phẩm ko tồn tại trong loại này"
                    : "Lỗi vui lòng thử lại...";

            notification.error({
                message,
                duration: 2,
            });
        }
        dispatch(changeLoading());
    };

    return <div className="w-full p-4 flex flex-col  overflow-auto min-h-full">
        <Modal
            width={800}
            open={isShowModal}
            onCancel={() => setIsShowModal(false)}
            footer={false}
        >
            <CategoryBlogForm
                closeModal={() => setIsShowModal(false)}
                fetchData={fetchCategoryBlog}
                categoryBlogCurrent={editCategoryBlog}
            />
        </Modal>
        <div className="h-[75px] flex gap-2 items-center justify-between p-2 border-b border-blue-300">
            <div className="text-2xl font-bold flex justify-between items-center w-full ">
                <div className="items-center">CategoryBlog Manager</div>
                <Button
                    iconBefore={<Icons.FaPlus />}
                    name="Create"
                    handleClick={() => openFormUpdate()}
                    style={
                        "border rounded bg-green-600 cursor-pointer px-4 py-2 text-white text-sm"
                    }
                />
            </div>

        </div>
        <div className="flex flex-col border justify-between">
            <table className="table-auto rounded p-2 bg-slate-50 mb-1 text-left w-full border-separate  transition-all duration-300 ease-in " >
                <thead className="font-bold bg-light text-white text-[13px] text-center border border-blue-300">
                    <tr>
                        <th className="px-2 py-2">STT</th>
                        <th className="px-2 py-2">Name</th>
                        <th className="px-2 py-2">Description</th>
                        <th className="px-2 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categoryBlog.map((item, index) => (
                        <tr key={item.id} className="relative ">
                            <td className="px-2 py-1 border border-slate-500 text-center text-lg font-bold">
                                {index + 1}
                            </td>
                            <td className="px-2 py-1 border border-slate-500  text-lg font-bold">
                                <span>{item?.name}</span>
                            </td>
                            <td className="px-2 py-1 border border-slate-500  text-lg font-bold">
                                <span>{item?.description}</span>
                            </td>
                            <td className="px-1 py-2 h-full flex  gap-4 items-center justify-center border border-slate-500">
                                <Button
                                    name={"Edit"}
                                    handleClick={() =>
                                        openFormUpdate(item)
                                    }
                                    style={
                                        "border rounded bg-blue-600 cursor-pointer px-4 py-2 text-white text-sm"
                                    }
                                    iconBefore={<Icons.FaEdit />}
                                />
                                <Button
                                    name={"Delete"}
                                    style={
                                        "border rounded bg-red-600 cursor-pointer px-4 py-2 text-white text-sm"
                                    }
                                    handleClick={() =>
                                        handleDelete(item?.categoryBlogId)
                                    }
                                    iconBefore={
                                        <Icons.MdDeleteForever />
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div class="flex w-full justify-end p-2 ">
                <Pagination
                    listLimit={[10, 25, 40, 100]}
                    limitCurrent={limit}
                    setLimit={setLimit}
                    totalPages={totalPages}
                    setPage={setPage}
                    pageCurrent={page}
                    totalElements={totalElements}
                />
            </div>
        </div>
    </div>;
}

export default CategoryBlogManager;
