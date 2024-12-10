import Icons from "utils/icons";

function RentalPackage({ data, openEdit, handleDelete }) {
    return (
        <div className="py-2 px-8 flex flex-col gap-2 border border-green-400 rounded relative">
            <div
                className="text-primary absolute top-2 right-2 cursor-pointer"
                onClick={() => openEdit()}
            >
                <Icons.FaEdit />
            </div>
            <div className="flex gap-4 text-green-700">
                <p className="text-slate-500">Tên gói:</p>
                <p className="font-bold">{data.name}</p>
            </div>
            <div className="flex gap-4">
                <p className="text-slate-500">Thời hạn:</p>
                <p className="font-bold text-orange-600">
                    {data.durationDays} ngày
                </p>
            </div>
            <div className="flex gap-4">
                <p className="text-slate-500">Phần trăm giá gốc sản phẩm :</p>
                <p className="font-bold text-orange-600">{data.price} %</p>
            </div>
            <div className="flex gap-4">
                <p className="text-slate-500">Phần trăm gốc :</p>
                <p className="font-bold text-orange-600">
                    {data.discountPercentage} %
                </p>
            </div>
            <div
                className="text-red-600 absolute bottom-2 right-2 cursor-pointer"
                onClick={() => handleDelete()}
            >
                <Icons.MdDeleteForever />
            </div>
        </div>
    );
}

export default RentalPackage;
