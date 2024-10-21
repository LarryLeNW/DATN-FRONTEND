import React, { useEffect, useState } from "react";
import Img1 from "assets/images/4.jpg";
import Img2 from "assets/images/12.jpg";
import Img3 from "assets/images/11.jpg";
import Img4 from "assets/images/10.jpg";
import Img5 from "assets/images/banner6.webp";
import { FaStar } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { getProducts } from "apis/product.api";

const ProductsData = [
    {
        id: 1,
        img: Img1,
        title: "Women Ethnic",
        rating: 5.0,
        color: "white",
        aosDelay: "0",
    },
    {
        id: 2,
        img: Img2,
        title: "Women western",
        rating: 4.5,
        color: "Red",
        aosDelay: "200",
    },
    {
        id: 3,
        img: Img3,
        title: "Goggles",
        rating: 4.7,
        color: "brown",
        aosDelay: "400",
    },
    {
        id: 4,
        img: Img4,
        title: "Printed T-Shirt",
        rating: 4.4,
        color: "Yellow",
        aosDelay: "600",
    },
    {
        id: 5,
        img: Img2,
        title: "Fashin T-Shirt",
        rating: 4.5,
        color: "Pink",
        aosDelay: "800",
    },
];

const Products = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // const getData = async () => {
        //     const res = await getProducts();
        //     console.log("🚀 ~ getData ~ res:", res);
        // };
        // getData();
    }, []);

    return (
        <div className=" mb-12">
            <div className="container">
                {/* Header section */}
                <div className="text-center mb-10 max-w-[600px] mx-auto">
                    <p data-aos="fade-up" className="text-sm text-primary">
                        Top những sản phẩm được bán nhiều nhất
                    </p>
                    <h1 data-aos="fade-up" className="text-3xl font-bold">
                        Products New
                    </h1>
                    <p data-aos="fade-up" className="text-xs text-gray-400">
                        Chất lượng hàng đầu, Thiết kế độc đáo, Giá cả hợp lý
                    </p>
                </div>
                {/* Body section */}
                <div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5">
                        {/* card section */}
                        {ProductsData.map((data) => (
                            <div
                                data-aos="fade-up"
                                data-aos-delay={data.aosDelay}
                                key={data.id}
                                className="space-y-3 px-8 py-2  rounded"
                            >
                                <img
                                    src={data.img}
                                    alt=""
                                    className="h-[220px] w-[150px] object-cover rounded-md"
                                />
                                <div>
                                    <h3 className="font-semibold">
                                        {data.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {data.color}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <FaStar className="text-yellow-400" />
                                        <span>{data.rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* view all button */}
                    <div className="flex justify-center">
                        <button className="text-center mt-10 cursor-pointer bg-primary text-white py-1 px-5 rounded-md">
                            View All Button
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
