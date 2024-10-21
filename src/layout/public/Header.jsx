import React, { useState, useEffect } from "react";
import Logo from "assets/images/DevTeam.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping, FaUser } from "react-icons/fa6";
import DarkMode from "./DarkMode";
import { Link } from "react-router-dom";
import paths from "constant/paths";

const Menu = [
    { id: 1, name: "Trang chủ", link: paths.HOME },
    { id: 2, name: "Sản phẩm", link: paths.PRODUCTS },
    { id: 3, name: "Bài viết", link: paths.BLOGS },
    { id: 4, name: "Dịch vụ", link: paths.OUR_SERVICES },
    { id: 5, name: "Hỏi đáp", link: paths.FAQ },
    { id: 6, name: "Giới thiệu", link: paths.INTRODUCE },
];

const Header = () => {
    const [showHeader, setShowHeader] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const controlHeader = () => {
        if (window.scrollY > lastScrollY) {
            setShowHeader(false); // Ẩn header khi cuộn xuống
        } else {
            setShowHeader(true); // Hiển thị header khi cuộn lên
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        window.addEventListener("scroll", controlHeader);
        return () => {
            window.removeEventListener("scroll", controlHeader);
        };
    }, [lastScrollY]);

    return (
        <>
            <div
                className={`bg-light text-white dark:bg-darkBg dark:text-white duration-500 fixed top-0 left-0 w-full z-50 shadow-md transition-transform ${
                    showHeader ? "translate-y-0" : "-translate-y-full"
                } h-16`}
            >
                {/* upper Navbar */}
                <div>
                    <div className="container flex justify-between items-center ">
                        <div>
                            <a href="#" className="flex gap-2 items-center">
                                <img src={Logo} alt="Logo" className="w-16 " />
                            </a>
                        </div>
                        <div>
                            <marquee className="text-sm font-medium">
                                Chào mừng bạn đến với WebFashion Shop
                            </marquee>
                        </div>

                        {/* search bar */}
                        <div className="flex items-center gap-3">
                            <div className="relative group hidden sm:block">
                                <input
                                    type="text"
                                    placeholder="search"
                                    className="w-[150px] sm:w-[200px] group-hover:w-[250px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-primary dark:border-gray-500 dark:bg-gray-800"
                                />
                                <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3" />
                            </div>
                            <Link to={paths.PROFILE}>
                                <button className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-3 rounded-full flex items-center gap-2 group">
                                    <span className="group-hover:block hidden transition-all duration-200 text-sm">
                                        Profile
                                    </span>
                                    <FaUser className="text-lg text-white drop-shadow-sm cursor-pointer" />
                                </button>
                            </Link>

                            {/* order button */}
                            <Link to={paths.DETAIL_CART}>
                                <button className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-3 rounded-full flex items-center gap-2 group">
                                    <span className="group-hover:block hidden transition-all duration-200 text-sm">
                                        Order
                                    </span>
                                    <FaCartShopping className="text-lg text-white drop-shadow-sm cursor-pointer" />
                                </button>
                            </Link>

                            {/* Darkmode Switch */}
                            <div>
                                <DarkMode />
                            </div>
                            <Link to={paths.LOGIN} className="text-sm">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
                {/* lower Navbar */}
                <div
                    data-aos="zoom-in"
                    className=" flex justify-center  shadow-sm shadow-amber-200 text-blue-400 bg-white dark:text-white dark:bg-light"
                >
                    <ul className="sm:flex hidden items-center gap-3 p-2  ">
                        {Menu.map((data) => (
                            <li key={data.id}>
                                <Link
                                    to={data.link}
                                    className="inline-block px-2  duration-200 text-lg font-bold"
                                >
                                    {data.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="mt-[110px]"></div>
        </>
    );
};

export default Header;
