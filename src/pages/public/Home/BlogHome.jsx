import React, { useEffect, useState } from "react";
import Img1 from "assets/images/4.jpg";
import Img2 from "assets/images/12.jpg";
import Img3 from "assets/images/11.jpg";
import Img4 from "assets/images/10.jpg";
import Img5 from "assets/images/banner6.webp";
import { getBlog } from "apis/blog.api";
import { Link } from "react-router-dom";
import { trunCateText } from "utils/helper";
import DOMPurify from "dompurify";
import moment from "moment";

const BlogHome = () => {
    const [data, setData] = useState([]);
    const fetchBlog = async () => {
        const params = { limit: 6, page: 1 };
        const res = await getBlog(params);
        setData(res?.result?.content);
    };

    useEffect(() => {
        fetchBlog();
    }, []);

    return (
        <div className=" mb-12">
            <div className="container">
                {/* Header section */}
                <div className="text-center mb-10 max-w-[600px] mx-auto">
                    <p data-aos="fade-up" className="text-sm text-primary">
                        Bài viết bạn có thể thích
                    </p>
                    <p data-aos="fade-up" className="text-xs text-gray-400">
                        Tin tức thời trang mua sắm và nhiều loại khác đang chờ
                        bạn đọc
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-sm:gap-8">
                    {data.map((post) => {
                        const imageArray = post.image
                            ? post.image.split(",")
                            : [];
                        const FirstImage =
                            imageArray.length > 0 ? imageArray[0] : "";
                        return (
                            <Link to={`/blogs/${post.blogId}`}>
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
                                                    {moment(
                                                        post?.updatedAt
                                                    ).format("DD/MM/YYYY")}
                                                </span>
                                            ) : (
                                                <span>N/A</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BlogHome;
