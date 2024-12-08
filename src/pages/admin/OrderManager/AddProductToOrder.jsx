
import { Checkbox, notification, Select, Tooltip } from "antd";
import withBaseComponent from "hocs";
import useDebounce from "hooks/useDebounce";
import Product from "pages/public/Products/Product";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCartRequest } from "store/slicers/cart.slicer";
import { deleteCartRequest } from "store/slicers/cart.slicer";
import { fillUniqueATTSkus, formatMoney, trunCateText } from "utils/helper";
import Icons from "utils/icons";
const Option = Select.Option;

const AddProductToOrder = () => {


    const { productList } = useSelector((state) => state.product);


    return (
        <div>
            <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {productList.data.map((product) => (
                    <Product data={product} />
                ))}
            </div>
        </div>
    )
}

export default AddProductToOrder;