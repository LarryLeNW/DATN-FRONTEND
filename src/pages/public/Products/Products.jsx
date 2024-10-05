import React, { useState } from "react";
import Img1 from "assets/images/2.jpg";
import Img2 from "assets/images/3.jpg";
import Img3 from "assets/images/4.jpg";
import Img4 from "assets/images/5.jpg";
import Img5 from "assets/images/5.jpg";
import Img6 from "assets/images/6.jpg";
import Img7 from "assets/images/banner2.webp";
import Icons from "utils/icons";

const products = [
  { id: 1, name: "Product Name 1", price: 99.99, image: Img1, category: "Electronics" },
  { id: 2, name: "Product Name 2", price: 79.99, image: Img2, category: "Clothing" },
  { id: 3, name: "Product Name 3", price: 59.99, image: Img3, category: "Accessories" },
  { id: 4, name: "Product Name 4", price: 89.99, image: Img4, category: "Electronics" },
  { id: 5, name: "Product Name 5", price: 49.99, image: Img5, category: "Clothing" },
  { id: 6, name: "Product Name 6", price: 69.99, image: Img6, category: "Accessories" },
  { id: 7, name: "Product Name 7", price: 69.99, image: Img6, category: "Electronics" },
  { id: 8, name: "Product Name 8", price: 69.99, image: Img6, category: "Accessories" },
  { id: 10, name: "Product Name 9", price: 69.99, image: Img6, category: "Electronics" },
  { id: 9, name: "Product Name 9", price: 69.99, image: Img6, category: "Electronics" },
  { id: 11, name: "Product Name 9", price: 69.99, image: Img6, category: "Electronics" },
  { id: 12, name: "Product Name 9", price: 69.99, image: Img6, category: "Electronics" },
  { id: 13, name: "Product Name 9", price: 69.99, image: Img6, category: "Electronics" },
];

const categories = ["All", "Electronics", "Clothing", "Accessories"];

function Products() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const itemsPerPage = 16;

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products.slice(0, itemsPerPage)
      : products.filter((product) => product.category === selectedCategory).slice(0, itemsPerPage);

  return (
    <>
      <div className="relative">
        <img
          src={Img7}
          alt="Banner"
          className="w-full h-[500px] object-cover pt-[122px]"
        />
      </div>

      {/* filter */}
      <div className="bg-gray-100 min-h-screen flex pt-10 px-4 md:px-8">
        <aside className="w-1/4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>
          <div className="mb-4">
            <h3 className="mb-2">Category</h3>
            <ul>
              {categories.map((category) => (
                <li key={category}>
                  <button
                    className={`block w-full text-left py-2 px-4 mb-2 rounded-lg transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-800 hover:bg-blue-100"
                    }`}
                    onClick={() => handleFilterChange(category)}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
            <div>
              <h3>Name</h3>
              <input type="text" className="border border-gray-300 rounded-lg px-4 py-2 w-full" placeholder="Tìm theo tên SP" />
            </div>
          </div>
        </aside>

        {/* product */}
        <div className="w-3/4 p-6">
          <header className="mb-8">
            <h1 className="text-center text-2xl font-bold text-gray-800">Products</h1>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-56 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    ${product.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-4">
                    <button>
                      <Icons.FaShoppingCart size={24} />
                    </button>
                    <span className="text-blue-700 hover:underline text-sm">
                      Xem chi tiết sản phẩm
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;