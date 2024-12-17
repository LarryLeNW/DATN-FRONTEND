import { Input, notification } from "antd";
import { getProducts } from "apis/product.api";
import useDebounce from "hooks/useDebounce";
import Pagination from "pages/admin/components/Pagination";
import Product from "pages/public/Products/Product";
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

function SearchModal({ closeModal }) {
    const [keyword, setKeyword] = useState("");
    const keyDebounce = useDebounce(keyword, 600);
    const [productData, setProductData] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const params = {
                limit,
                page,
                keyword: keyDebounce,
            };
            const res = await getProducts(params);
            setProductData(res?.result?.content);
            setTotalPages(res?.result?.totalPages);
            setTotalElements(res?.result?.totalElements);
        } catch (error) {
            notification.warning({ message: error.message, duration: 2 });
        }
        setIsLoading(false);
    };
    useEffect(() => {
        setPage(1);
        fetchProducts();
    }, [keyDebounce, limit]);

    useEffect(() => {
        fetchProducts();
    }, [page]);
    return (
        <div className="flex gap-2 flex-col min-h-[70vh] px-4">
            <div className="flex border rounded">
                <h1 className="bg-gradient-to-r from-primary to-secondary w-fit rounded-l  text-nowrap  px-2 text-white text-2xl ">
                    Tìm kiếm
                </h1>
                <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="outline-none border-none text-2xl "
                    placeholder="tìm kiếm sản phẩm của bạn trong 1 giây..."
                ></Input>
            </div>
            <div class="flex w-full justify-between  items-center">
                <div className="text-primary font-bold ">
                    Đã tìm thấy {totalElements} sản phẩm
                </div>
                {productData.length > 1 && (
                    <Pagination
                        listLimit={[10, 25, 40, 100]}
                        limitCurrent={limit}
                        setLimit={setLimit}
                        totalPages={totalPages}
                        setPage={setPage}
                        pageCurrent={page}
                        totalElements={totalElements}
                    />
                )}
            </div>
            <div className="max-h-[70vh] overflow-auto flex flex-col">
                <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
                    {productData?.map((product) => (
                        <div onClick={() => closeModal()}>
                            <Product data={product} />
                        </div>
                    ))}
                </div>
                {isLoading && (
                    <HashLoader
                        size={100}
                        color="#b683df"
                        className="mx-auto mt-20"
                    />
                )}
                {!isLoading && page != totalPages && productData.length > 1 && (
                    <div
                        className="mx-auto cursor-pointer"
                        onClick={() => setLimit((limit) => (limit += limit))}
                    >
                        Xem thêm
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchModal;
