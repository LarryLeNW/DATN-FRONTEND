import paths from "constant/paths";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router-dom";
import { fillUniqueATTSkus, formatCurrency, trunCateText } from "utils/helper";

const RelatedProducts = (props) => {
  const navigate = useNavigate();
  const category = props.category;
  const dispatch = useDispatch();

  const { data: products, loading, error } = useSelector((state) => state.product.productList);

  const filteredProducts = products.filter((product) => product.category?.id === category.id);

  return (
    <div className="mt-4 bg-white p-5 mx-auto lg:max-w-7xl sm:max-w-full">
      <div className="p-4 bg-gray-50 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Sản phẩm tương tự</h2>
        </div>
        <div className="bg-white mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-100 p-2 cursor-pointer hover:-translate-y-2 transition-all flex flex-col"
                onClick={() =>
                  navigate(generatePath(paths.DETAIL_PRODUCT, { id: product.id }), {
                    state: { productData: product },
                  })
                }
              >
                <div className="w-5/6 h-[110px] overflow-hidden mx-auto aspect-w-16 aspect-h-8 mb-4">
                  <img
                    src={product.skus[0]?.images.split(",")[0]}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="flex-grow flex flex-col justify-between">
                  <h3 className="text-xs font-normal text-gray-800">{trunCateText(product.name, 50)}</h3>
                  <p className="text-sm text-red-600 font-bold mt-4">
                    Giá: {formatCurrency(product.skus[0]?.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && <p className="text-center text-gray-500">Không có sản phẩm tương tự nào !</p>}
        </div>
      </div>
    </div>
  );
};


export default RelatedProducts;
