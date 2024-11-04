import React from "react";
import img1 from "assets/images/2.jpg";
import img2 from "assets/images/10.jpg";
import img3 from "assets/images/13.jpg";
import img4 from "assets/images/1.jpg";
import img5 from "assets/images/3.jpg";
import img6 from "assets/images/4.jpg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


const TopDealProduct = () => {

    const categories = [
        { icon: img1, title: 'TOP DEAL' },
        { icon: img2, title: 'Siêu Sale Tháng 10' },
        { icon: img3, title: 'Vòng Quay Tri Ân' },
        { icon: img1, title: 'Tiki Nhìn lại 14 năm' },
        { icon: img1, title: 'Tiki Trading' },
        { icon: img1, title: 'Cùng mẹ chăm bé' },
        { icon: img1, title: 'Một sách Tiki' },
        { icon: img1, title: 'Thế giới công nghệ' },
        { icon: img1, title: 'Yêu bếp nghiện nhà' },
    ];

    const productData = [
        {
            title: 'Kem chống nắng dạng gel dưỡng sáng...',
            image: img2,
            price: '429.300',
            oldPrice: '575.000',
            rating: 4,
            extraBadge: 'FREESHIP XTRA',
            extraInfo: 'Made in Japan',
        },
        {
            title: 'Apple AirPods 3 2022 sạc Lightning - MPNY3',
            image: img2,
            price: '3.960.000',
            oldPrice: '5.390.000',
            rating: 5,
            extraBadge: 'CHÍNH HÃNG',
        },
        {
            title: 'Apple iPhone 13',
            image: img2,
            price: '13.490.000',
            oldPrice: '25.990.000',
            rating: 5,
        },
        {
            title: 'Nghệ Thuật Tinh Tế Của Việc Đếch Quan Tâm',
            image: img1,
            price: '96.000',
            oldPrice: '128.000',
            rating: 4,
        },
    ];
    const contentStyle = {
        margin: 0,
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
    };
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
    };
    var setting = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div>
            <Slider {...setting}>
                <div>
                    <img src={img4} alt="" />
                </div>
                <div>
                    <img src={img1} alt="" />
                </div>
                <div>
                    <img src={img5} alt="" />
                </div>
                <div>
                    <img src={img6} alt="" />
                </div>

            </Slider>

            <div>
                <div className="bg-white shadow-md rounded-lg p-4 flex space-x-4 overflow-x-auto">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center w-20 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                        >
                            <img
                                src={category.icon}
                                alt={category.title}
                                className="w-12 h-12 mb-2"
                            />
                            <span className="text-sm font-medium">{category.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-red-500">TOP DEAL • SIÊU RẺ</h2>
                    <a href="#" className="text-blue-500 text-sm font-bold hover:underline">
                        Xem tất cả
                    </a>
                </div>
                {/* Danh sách sản phẩm */}


                <Slider {...settings}>
                    {productData.map((product, index) => (
                        <div key={index} className="border rounded-lg p-4 shadow-md bg-white w-60 min-h-[350px] flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-2">
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">TOP DEAL</span>
                                {product.extraBadge && (
                                    <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">{product.extraBadge}</span>
                                )}
                            </div>
                            <img src={product.image} alt={product.title} className="w-full h-32 object-cover mb-3" />
                            <h3 className="text-sm font-medium mb-2 line-clamp-2">{product.title}</h3>
                            <div className="flex items-center text-yellow-500 mb-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i} className={i < product.rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                                ))}
                            </div>
                            <div className="text-red-500 text-lg font-bold">{product.price}đ</div>
                            <div className="text-gray-500 text-sm line-through">{product.oldPrice}đ</div>
                            <div className="text-gray-600 text-xs">{product.extraInfo}</div>
                        </div>
                    ))}
                </Slider>

            </div>

        </div>
        
    );
}

export default TopDealProduct;
