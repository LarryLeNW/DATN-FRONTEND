import paths from 'constant/paths';
import React from 'react';
import { Link } from 'react-router-dom';

const cartItems = [
    {
        id: 1,
        name: 'Velvet Sneaker',
        price: 20.0,
        image: 'https://readymadeui.com/images/product14.webp',
        size: 'XL',
        quantity: 1,
    },
    {
        id: 2,
        name: 'Smart Watch Timex',
        price: 120.0,
        image: 'https://readymadeui.com/images/watch5.webp',
        size: 'XL',
        quantity: 1,
    },
    {
        id: 3,
        name: 'Sun Glass',
        price: 50.0,
        image: 'https://readymadeui.com/images/sunglass1.webp',
        size: 'XL',
        quantity: 1,
    },
    {
        id: 3,
        name: 'Sun Glass',
        price: 50.0,
        image: 'https://readymadeui.com/images/sunglass1.webp',
        size: 'XL',
        quantity: 1,
    },
    {
        id: 3,
        name: 'Sun Glass',
        price: 50.0,
        image: 'https://readymadeui.com/images/sunglass1.webp',
        size: 'XL',
        quantity: 1,
    },
    {
        id: 3,
        name: 'Sun Glass',
        price: 50.0,
        image: 'https://readymadeui.com/images/sunglass1.webp',
        size: 'XL',
        quantity: 1,
    },
    {
        id: 3,
        name: 'Sun Glass',
        price: 50.0,
        image: 'https://readymadeui.com/images/sunglass1.webp',
        size: 'XL',
        quantity: 1,
    },
];

function DetailCart() {
    return (
        <div className="font-sans mx-auto bg-white py-4 mt-28">
            <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-gray-100 p-4 rounded-md">
                    <h2 className="text-2xl font-bold text-gray-800">Cart</h2>
                    <hr className="border-gray-300 mt-4 mb-8" />
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="grid grid-cols-3 items-center gap-4">
                                <div className="col-span-2 flex items-center gap-4">
                                    <div className="w-24 h-24 shrink-0 bg-white p-2 rounded-md">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>

                                    <div>
                                        <h3 className="text-base font-bold text-gray-800">{item.name}</h3>


                                        <div className="flex gap-4 mt-4">
                                            <div className="relative group">
                                                <button
                                                    type="button"
                                                    className="flex items-center px-2.5 py-1.5 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
                                                >
                                                    {item.size}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-2.5 fill-gray-500 inline ml-2.5"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>

                                                <ul className='group-hover:block hidden absolute rounded-md min-w-[80px] shadow-lg bg-white z-[1000]'>
                                                    <li className='py-2 px-4 hover:bg-gray-100 text-gray-800 text-xs cursor-pointer'>SM</li>
                                                    <li className='py-2 px-4 hover:bg-gray-100 text-gray-800 text-xs cursor-pointer'>MD</li>
                                                    <li className='py-2 px-4 hover:bg-gray-100 text-gray-800 text-xs cursor-pointer'>XL</li>
                                                    <li className='py-2 px-4 hover:bg-gray-100 text-gray-800 text-xs cursor-pointer'>XXL</li>
                                                </ul>
                                            </div>

                                            <div>
                                                <button
                                                    type="button"
                                                    className="flex items-center px-2.5 py-1.5 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-2.5 fill-current"
                                                        viewBox="0 0 124 124"
                                                    >
                                                        <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" />
                                                    </svg>
                                                    <span className="mx-2.5">{item.quantity}</span>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-2.5 fill-current"
                                                        viewBox="0 0 42 42"
                                                    >
                                                        <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-auto">

                                    <div className='flex gap-1'>
                                        <button className='bg-red-600 p-1 rounded-md text-white'>Remove</button>
                                    </div>
                                    <h4 className="text-base font-bold text-gray-800">${item.price.toFixed(2)}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-100 rounded-md p-4 md:sticky top-0">
                    <div className="flex border border-blue-600 overflow-hidden rounded-md">
                        <input
                            type="text"
                            placeholder="Promo code"
                            className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-2.5"
                        />
                        <button
                            type="button"
                            className="flex items-center justify-center font-semibold tracking-wide bg-blue-600 hover:bg-blue-700 px-4 text-sm text-white"
                        >
                            Apply
                        </button>
                    </div>

                    <ul className="text-gray-800 mt-8 space-y-4">
                        <li className="flex flex-wrap gap-4 text-base">
                            Discount <span className="ml-auto font-bold">$0.00</span>
                        </li>
                        <li className="flex flex-wrap gap-4 text-base">
                            Shipping <span className="ml-auto font-bold">$2.00</span>
                        </li>
                        <li className="flex flex-wrap gap-4 text-base">
                            Tax <span className="ml-auto font-bold">$4.00</span>
                        </li>
                        <li className="flex flex-wrap gap-4 text-base font-bold">
                            Total <span className="ml-auto">$52.00</span>
                        </li>
                    </ul>

                    <div className="mt-8 space-y-2">
                      
                      <Link to={paths.CHECKOUT}>
                       <button
                            type="button"
                            className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        >
                            Checkout
                        </button>
                        </Link>
                        <button
                            type="button"
                            className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent text-gray-800 border border-gray-300 rounded-md"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailCart;