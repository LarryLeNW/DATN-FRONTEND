import { Select } from "antd";
import Icons from "utils/icons";

function Pagination({
    limitCurrent,
    listLimit,
    setLimit,
    totalPages,
    setPage,
    pageCurrent,
    totalElements,
}) {
    const start = (pageCurrent - 1) * limitCurrent + 1;
    const end = Math.min(pageCurrent * limitCurrent, totalElements);

    return (
        <div className="flex gap-2 justify-center items-center">
            <div className="flex justify-center items-center gap-2">
                Hàng trên mỗi trang
                <span class="font-bold text-lg ">{limitCurrent}</span>
            </div>
            <div>
                <Select
                    options={listLimit.map((e) => ({
                        value: e,
                        label: e,
                    }))}
                    onChange={(value) => {
                        setLimit(value);
                        setPage(1);
                    }}
                    value={limitCurrent}
                    className="w-16"
                />
            </div>
            <div>
                {start} - {end} of {totalElements}
            </div>
            <div className="flex gap-2 ">
                <div
                    className="cursor-pointer hover:text-blue-500"
                    onClick={() => {
                        if (pageCurrent > 1) setPage(--pageCurrent);
                        else setPage(totalPages);
                    }}
                >
                    <Icons.GrFormPrevious size={26} />
                </div>
                <div
                    className="cursor-pointer hover:text-blue-500"
                    onClick={() => {
                        if (pageCurrent < totalPages) setPage(++pageCurrent);
                        else setPage(1);
                    }}
                >
                    <Icons.MdNavigateNext size={26} />
                </div>
            </div>
        </div>
    );
}

export default Pagination;
