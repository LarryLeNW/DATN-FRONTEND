import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pagination } from "antd";
import { getBlog } from "apis/blog.api";
import DOMPurify from "dompurify";
import moment from "moment";
import paths from "constant/paths";
import { trunCateText } from "utils/helper";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const navigate = useNavigate();

    const fetchBlog = async () => {
        const params = { limit, page };
        const res = await getBlog(params);
        setBlogs(res?.result?.content);
        setTotalPages(res?.result?.totalPages);
        setTotalElements(res?.result?.totalElements);
    };

    const handleViewDetail = (blogId) => {
        navigate(`/blogs/${blogId}`);
    };

    useEffect(() => {
        fetchBlog();
    }, [page, limit]);

    return (
        <div className="bg-gray-100 md:px-10 px-4 py-12 font-[sans-serif]">
            <div className="max-w-5xl max-lg:max-w-3xl max-sm:max-w-sm mx-auto">
                <h2 className="text-3xl text-gray-800 mb-8">
                    Tin tức hot về sản phẩm
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-sm:gap-8">
                    {blogs.map((post) => {
                        const imageArray = post.image
                            ? post.image.split(",")
                            : [];
                        const FirstImage =
                            imageArray.length > 0 ? imageArray[0] : "";
                        return (
                            <div
                                key={post.id}
                                className="bg-white rounded overflow-hidden"
                            >
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
                                            __html: DOMPurify.sanitize(
                                                post?.content
                                            ),
                                        }}
                                    ></span>
                                    <p className="text-orange-500 text-[13px] font-semibold mt-4">
                                        {post?.createdAt ? (
                                            <span>
                                                {moment(post?.updatedAt).format(
                                                    "DD/MM/YYYY"
                                                )}
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
    );
};

export default Blogs;
