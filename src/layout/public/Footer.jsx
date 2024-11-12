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
    { title: "Home", link: "/#" },
    { title: "About", link: "/#about" },
    { title: "Contact", link: "/#contact" },
    { title: "Blog", link: "/#blog" },
];

const Footer = () => {
    return (
        <div style={BannerImg} className="text-white ">
            <div>
                <div
                    data-aos="zoom-in"
                    className="grid md:grid-cols-3 pb-6 pt-4"
                >
                    {/* company details */}
                    <div className="py-4 px-4">
                        <h1 className="sm:text-2xl text-lg font-bold sm:text-left text-justify mb-2 flex items-center gap-3">
                            <img
                                src={footerLogo}
                                alt=""
                                className="max-w-[40px]"
                            />
                            Fashion Shop
                        </h1>
                        <p className="text-sm">
                            Chào mừng đến với Fashion Shop - điểm đến lý tưởng
                            cho những tín đồ yêu thích thời trang! Tại đây,
                            chúng tôi cung cấp một bộ sưu tập đa dạng các sản
                            phẩm thời trang từ trang phục, giày dép đến phụ
                            kiện, phù hợp với mọi phong cách và dịp.
                        </p>
                    </div>

                    {/* Footer Links */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-6">
                        <div>
                            <div className="py-4 px-4">
                                <h1 className="sm:text-lg text-md font-bold sm:text-left text-justify mb-2">
                                    Mục Lục
                                </h1>
                                <ul className="flex flex-col gap-2">
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

                        {/* social links */}
                        <div className="flex flex-col justify-center items-start mt-4 px-4">
                            <div className="flex items-center gap-2">
                                <a href="#">
                                    <FaInstagram className="text-2xl" />
                                </a>
                                <a href="#">
                                    <FaFacebook className="text-2xl" />
                                </a>
                                <a href="#">
                                    <FaLinkedin className="text-2xl" />
                                </a>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center gap-2">
                                    <FaLocationArrow />
                                    <p className="text-sm">
                                        Liên chiểu, TP Đà Nẵng
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <FaMobileAlt />
                                    <p className="text-sm">+84345204733</p>
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
