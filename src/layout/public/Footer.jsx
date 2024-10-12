import React from "react";
import footerLogo from "assets/logo.png";
import {
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaLocationArrow,
    FaMobileAlt,
} from "react-icons/fa";

const BannerImg = {
    background: "#243642",
    backgroundPosition: "bottom",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100%",
    width: "100%",
};

const FooterLinks = [
    {
        title: "Home",
        link: "/#",
    },
    {
        title: "About",
        link: "/#about",
    },
    {
        title: "Contact",
        link: "/#contact",
    },
    {
        title: "Blog",
        link: "/#blog",
    },
];

const Footer = () => {
    return (
        <div style={BannerImg} className="text-white">
            <div className="container">
                <div
                    data-aos="zoom-in"
                    className="grid md:grid-cols-3 pb-10 pt-2"
                >
                    {/* company details */}
                    <div className="py-8 px-4">
                        <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3">
                            <img
                                src={footerLogo}
                                alt=""
                                className="max-w-[50px]"
                            />
                            Fashion Shop
                        </h1>
                        <p>
                        Chào mừng đến với Fashion Shop - điểm đến lý tưởng cho những tín đồ
                         yêu thích thời trang! Tại đây, chúng tôi cung cấp một bộ sưu tập đa dạng các sản phẩm thời 
                        trang từ trang phục, giày dép đến phụ kiện, phù hợp với mọi phong cách và dịp.
                        </p>
                    </div>

                    {/* Footer Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
                        <div>
                            <div className="py-8 px-4">
                                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                                    Mục Lục
                                </h1>
                                <ul className="flex flex-col gap-3">
                                    {FooterLinks.map((link) => (
                                        <li
                                            className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
                                            key={link.title}
                                        >
                                            <span>{link.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div>
                            {/* <div className="py-8 px-4">
                                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                                    Liên Hệ
                                </h1>
                                <ul className="flex flex-col gap-3">
                                   <li>Facebook</li>
                                   <li>Instagram</li>
                                   <li></li>
                                </ul>
                            </div> */}
                        </div>

                        {/* social links */}

                        <div>
                            <div className="flex items-center gap-3 mt-6">
                                <a href="#">
                                    <FaInstagram className="text-3xl" />
                                </a>
                                <a href="#">
                                    <FaFacebook className="text-3xl" />
                                </a>
                                <a href="#">
                                    <FaLinkedin className="text-3xl" />
                                </a>
                            </div>
                            <div className="mt-6">
                                <div className="flex items-center gap-3">
                                    <FaLocationArrow />
                                    <p>Liên chiểu, TP Đà Nẵng</p>
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <FaMobileAlt />
                                    <p>+84345204733</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
