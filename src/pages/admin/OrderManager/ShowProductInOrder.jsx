import { useSelector } from "react-redux";
import AddProductToOrder from "./AddProductToOrder";
import { useEffect, useState } from "react";
import { Input } from "antd";

const ShowProductInOrder = () => {
    const { data: productList, meta, loading, error } = useSelector((state) => state.product.productList);
    const [keyword, setKeyword] = useState("");
    const [filteredData, setFilteredData] = useState(productList);

    useEffect(() => {
        if (Array.isArray(productList)) {
            const filtered = productList.filter((product) =>
                product.name.toLowerCase().includes(keyword.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData([]);
        }
    }, [productList, keyword]);

    return (
        <div>
            <div className="p-2 grid grid-cols-1 sm:grid-cols-2 bg-gray-100 lg:grid-cols-4 gap-8">
                <Input.Search
                    allowClear
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    enterButton
                    placeholder="Tìm kiếm theo từ khóa"
                />
                {Array.isArray(filteredData) && filteredData.length > 0 ? (
                    filteredData.map((product) => (
                        <AddProductToOrder key={product.id} data={product} />
                    ))
                ) : (
                    <div>Không tìm thấy sản phẩm nào</div>
                )}
            </div>
        </div>
    );
};

export default ShowProductInOrder;
