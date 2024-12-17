import { useSelector } from "react-redux";
import AddProductToOrder from "./AddProductToOrder";
import { useEffect, useState } from "react";
import { Input, Pagination } from "antd";

const ShowProductInOrder = () => {
    const { data: productList, meta, loading, error } = useSelector((state) => state.product.productList);
    const [keyword, setKeyword] = useState("");
    const [filteredData, setFilteredData] = useState(productList);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8); 

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

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = Array.isArray(filteredData) ? filteredData.slice(startIndex, endIndex) : [];

    return (
        <div>
            <div className="p-2">
                <Input.Search
                    allowClear
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    enterButton
                    placeholder="Tìm kiếm theo từ khóa"
                />
            </div>
            <div className="p-2 grid grid-cols-1 sm:grid-cols-2 bg-gray-100 lg:grid-cols-4 gap-8">
                {paginatedData.length > 0 ? (
                    paginatedData.map((product) => (
                        <AddProductToOrder key={product.id} data={product} />
                    ))
                ) : (
                    <div>Không tìm thấy sản phẩm nào</div>
                )}
            </div>
            <div className="p-2 flex justify-center">
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredData.length}
                    onChange={(page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    }}
                    showSizeChanger
                />
            </div>
        </div>
    );
};

export default ShowProductInOrder;
