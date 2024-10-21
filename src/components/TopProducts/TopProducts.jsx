import React from "react";
import Img1 from "assets/shirt/shirt.png";
import Img2 from "assets/shirt/shirt2.png";
import Img3 from "assets/shirt/shirt3.png";

import { FaStar } from "react-icons/fa";

const ProductsData = [
    {
        id: 1,
        img: Img1,
        title: "Casual Wear",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 2,
        img: Img2,
        title: "Printed shirt",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 3,
        img: Img3,
        title: "Women shirt",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 3,
        img: Img3,
        title: "Women shirt",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 3,
        img: Img3,
        title: "Women shirt",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 3,
        img: Img3,
        title: "Women shirt",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 3,
        img: Img3,
        title: "Women shirt",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 3,
        img: Img3,
        title: "Women shirt",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 3,
        img: Img3,
        title: "Women shirt",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 3,
        img: Img3,
        title: "Women shirt",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 3,
        img: Img3,
        title: "Women shirt",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
        id: 3,
        img: Img3,
        title: "Women shirt",
        description:
            "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },

];

const categories = ["áo quần", "trang sức", "giày", "dép", "quần tây","hihihi"];

const TopProducts = () => {
    return (
        <div>
            <div className="container grid grid-cols-5 gap-x-4 ">
                <div className="">
                    <div className=" bg-light p-4 rounded-lg shadow-md w-55">
                        <h2 className="text-xl font-semibold mb-4">Danh mục</h2>
                        <div className="space-y-3">
                            {categories.map((item) => (
                                <div
                                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition"
                                >
                                    <span className="text-gray-800">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Header section */}
                <div className="col-span-4 ">
                    <div className=" mb-24 flex items-center justify-end gap-4">
                        <div><input
                            type="text"
                            placeholder="Tìm kiếm"
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300"
                        /></div>

                    </div>

                    {/* Body section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20 md:gap-5 place-items-center" data-aos="fade-up" >

                        {ProductsData.map((data) => (
                            <div
                                key={data.id}
                                // data-aos="zoom-in"
                                data-aos="fade-up"
                                className="rounded-2xl bg-white dark:bg-gray-800 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[300px]"
                            >
                                <br />
                                <br />
                                <br />
                                {/* image section */}
                                <div className="h-[100px]">
                                    <img
                                        src={data.img}
                                        alt=""
                                        className="max-w-[140px] block mx-auto transform -translate-y-20 group-hover:scale-105 duration-300 drop-shadow-md"
                                    />
                                </div>
                                {/* details section */}
                                <div className="p-4 text-center">
                                    {/* star rating */}
                                    <div className="w-full flex items-center justify-center gap-1">
                                        <FaStar className="text-yellow-500" />
                                        <FaStar className="text-yellow-500" />
                                        <FaStar className="text-yellow-500" />
                                        <FaStar className="text-yellow-500" />
                                    </div>
                                    <h1 className="text-xl font-bold">
                                        {data.title}
                                    </h1>
                                    <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
                                        {data.description}
                                    </p>
                                    <button className="bg-primary hover:scale-105 duration-300 text-white py-1 px-4 rounded-full mt-4 group-hover:bg-white group-hover:text-primary">
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TopProducts;
