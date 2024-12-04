import paths from "constant/paths";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router-dom";
import { fillUniqueATTSkus, formatCurrency, trunCateText } from "utils/helper";

const RelatedProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: products, meta, loading, error } = useSelector((state) => state.product.productList);

  return (
    <div className=" mt-4 bg-white p-5 mx-auto lg:max-w-7xl sm:max-w-full">

      <div className="p-4 bg-gray-50 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Sản phẩm tương tự</h2>
        </div>
        <div className="bg-white lg:max-w-7xl sm:max-w-full mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products &&
              products.map((product) => (
                <div
                  key={product?.id}
                  className="bg-gray-100  p-2 cursor-pointer hover:-translate-y-2 transition-all relative flex flex-col"
                  onClick={() =>
                    navigate(
                      generatePath(paths.DETAIL_PRODUCT, { id: product?.id }),
                      { state: { productData: product } }
                    )
                  }
                >
                  <div className="w-5/6 h-[110px] overflow-hidden mx-auto aspect-w-16 aspect-h-8 md:mb-2 mb-4">
                    <img
                      src={product.skus[0]?.images.split(",")[0]}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-normal text-gray-800">
                        {trunCateText(product.name, 50)}
                      </h3>
                      <div className="flex gap-2 mt-2">
                        {fillUniqueATTSkus(product?.skus, "color").length > 2 && (
                          <div className="px-2 bg-gray-100 rounded text-xs">
                            {fillUniqueATTSkus(product?.skus, "color").length} Màu
                          </div>
                        )}
                        {fillUniqueATTSkus(product?.skus, "size").length > 2 && (
                          <div className="px-2 bg-gray-100 rounded text-xs">
                            {fillUniqueATTSkus(product?.skus, "size").length} Size
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Đoạn này đảm bảo giá luôn ở dưới cùng */}
                    <p className="text-sm text-red-600 font-bold mt-4">
                      Giá: {formatCurrency(product.skus[0]?.price)}
                    </p>
                  </div>
                </div>

              ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
