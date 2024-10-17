import { Select } from "antd";
import Icons from "utils/icons";

function Pagination({
    limitCurrent,
    listLimit,
    setLimit,
    totalPages,
    setPage,
}) {
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
                    onChange={(value) => setLimit(value)}
                    value={limitCurrent}
                    className="w-16"
                />
            </div>
            <div className="flex gap-2">
                <Icons.GrFormPrevious size={20} />
                <Icons.MdNavigateNext size={20} />
            </div>
        </div>
    );
}

export default Pagination;
