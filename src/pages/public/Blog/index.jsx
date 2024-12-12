import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import { getBlog } from "apis/blog.api";
import DOMPurify from "dompurify";
import moment from "moment";
import paths from "constant/paths";
import { trunCateText } from "utils/helper";
import { getCategoryBlog } from "apis/categoryBlog.api";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [cateBlog, setCateBlog] = useState([]);

    const navigate = useNavigate();

    const fetchBlog = async () => {
        const params = { limit, page };
        const res = await getBlog(params);
        setBlogs(res?.result?.content);
        setTotalPages(res?.result?.totalPages);
        setTotalElements(res?.result?.totalElements);
    };
    const fetchCateBlog = async () => {
        try {
            const res = await getCategoryBlog();
            console.log("Dữ liệu cateBlog:", res?.result);
            setCateBlog(res?.result?.content || []); // Gán dữ liệu hoặc mảng rỗng
        } catch (error) {
            console.error("Lỗi khi lấy danh mục blog:", error);
        }
    };

    const handleViewDetail = (blogId) => {
        navigate(`/blogs/${blogId}`);
    };

    useEffect(() => {
        fetchBlog();
        fetchCateBlog();
    }, [page, limit]);

  
    return (
        
        <div className="bg-gray-100 md:px-10 px-4 py-12 font-[sans-serif] flex justify-center items-start gap-6">
        <div className="flex-1 max-w-5xl">
            <h2 className="text-3xl text-gray-800 mb-8 text-center">
                Tin tức hot về sản phẩm
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-sm:gap-8">
                {blogs && blogs.map((post) => {
                    const imageArray = post.image ? post.image.split(",") : [];
                    const FirstImage = imageArray.length > 0 ? imageArray[0] : "";
                    return (
                        <div key={post.id} className="bg-white rounded overflow-hidden shadow-md">
                            <img
                                src={FirstImage}
                                alt={post.title}
                                className="w-full h-52 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-3">
                                    {trunCateText(post.title, 80)}
                                </h3>
                                <span
                                    className="line-clamp-4"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(post?.content),
                                    }}
                                ></span>
                                <p className="text-orange-500 text-[13px] font-semibold mt-4">
                                    {post?.createdAt ? (
                                        <span>
                                            {moment(post?.updatedAt).format("DD/MM/YYYY")}
                                        </span>
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </p>
                                <Link
                                    to={`/blogs/${post.blogId}`}
                                    className="mt-4 inline-block px-4 py-2 rounded tracking-wider bg-orange-500 hover:bg-orange-600 text-white text-[13px]"
                                >
                                    Read More
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex mt-10 w-full justify-center p-2">
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
    
        <aside className="w-full lg:w-64 lg:sticky top-4 lg:self-start h-auto lg:h-[calc(100vh-4rem)] overflow-y-auto bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Các mục nổi bật
            </h3>
            <div className="space-y-4">
                {cateBlog && cateBlog.map((cateBlog, index) => (
                    <li
                        key={index}
                        className="flex items-center gap-4 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer transition-shadow duration-300 ease-in-out shadow-md"
                    >
                        <span className="text-gray-800 text-lg font-medium">
                            {cateBlog?.name}
                        </span>
                    </li>
                ))}
            </div>
        </aside>
    </div>
    
        
    );
};

export default Blogs;
