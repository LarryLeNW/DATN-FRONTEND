import {Input, Tooltip} from "antd";
import {memo} from "react";
import Icons from "utils/icons";

function SkuTable({variants, setVariants, variantErrors}) {
    const handleVariantTableChange = async (index, field, value) => {
        setVariants((prevVariants) => {
            const updatedVariants = [...prevVariants];
            updatedVariants[index] = {
                ...updatedVariants[index],
                [field]: value,
            };
            return updatedVariants;
        });
    };

    return (
        <table
            data-aos="zoom-in"
            className="table-auto rounded p-2 bg-slate-50 mb-1 text-left w-full border-separate  transition-all duration-300 ease-in"
        >
            <thead className="font-bold bg-light text-white text-[13px] text-center border border-blue-300">
            <tr>
                {<th className="px-4 py-2">#</th>}
                <th className="px-4 py-2">Sku Code</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Discount</th>
            </tr>
            </thead>
            <tbody>
            {variants?.map((e, index) => (
                <Tooltip
                    title={
                        // e?.images?.length > 0 ? (
                        //     <div className="flex flex-col">
                        //         <div className="font-bold mx-auto ">
                        //             {e?.images?.length} images
                        //         </div>
                        //         <div className="flex gap-2  overflow-x-scroll">
                        //             {e?.images?.map((img) => (
                        //                 <img
                        //                     key={img}
                        //                     src={URL.createObjectURL(img)}
                        //                     alt={img}
                        //                     className="w-[50%]  object-cover"
                        //                 />
                        //             ))}
                        //         </div>
                        //     </div>
                        // ) : (
                        <span>No image available</span>
                        // )
                    }
                    placement="top"
                >
                    <tr key={e.id} className="relative">
                        <td className="px-2 py-1 border border-slate-500 text-center text-lg font-bold">
                            {index + 1}
                        </td>
                        <td className="px-2 py-1 border border-slate-500 ">
                            <Input
                                value={e?.code}
                                onChange={(e) =>
                                    handleVariantTableChange(
                                        index,
                                        "code",
                                        e.target.value
                                    )
                                }
                                className={` ${
                                    variantErrors[index]?.code
                                        ? "outline-red-400  placeholder:text-red-500 italic outline-dotted "
                                        : "text-lg font-bold"
                                } `}
                                placeholder={
                                    variantErrors[index]?.code
                                        ? "Required ..."
                                        : ""
                                }
                            />
                        </td>
                        <td className="px-2 py-1 border border-slate-500 text-lg font-bold">
                            <Input
                                value={e?.price}
                                onChange={(e) =>
                                    handleVariantTableChange(
                                        index,
                                        "price",
                                        e.target.value
                                    )
                                }
                                type="number"
                                className={` ${
                                    variantErrors[index]?.price
                                        ? "outline-red-400  placeholder:text-red-500 italic outline-dotted "
                                        : "text-lg font-bold"
                                } `}
                                placeholder={
                                    variantErrors[index]?.price
                                        ? "Required ..."
                                        : ""
                                }
                            />
                        </td>
                        <td className="px-2 py-1 border border-slate-500 text-lg font-bold">
                            <Input
                                value={e?.stock}
                                onChange={(e) =>
                                    handleVariantTableChange(
                                        index,
                                        "stock",
                                        e.target.value
                                    )
                                }
                                type="number"
                                className={` ${
                                    variantErrors[index]?.stock
                                        ? "outline-red-400  placeholder:text-red-500 italic outline-dotted "
                                        : "text-lg font-bold"
                                } `}
                                placeholder={
                                    variantErrors[index]?.stock
                                        ? "Required ..."
                                        : ""
                                }
                            />
                        </td>
                        <td className="px-2 py-1 border border-slate-500 text-lg font-bold text-center">
                            <Input
                                value={e?.discount}
                                onChange={(e) =>
                                    handleVariantTableChange(
                                        index,
                                        "discount",
                                        e.target.value
                                    )
                                }
                                type="number"
                                className={` ${
                                    variantErrors[index]?.discount
                                        ? "outline-red-400  placeholder:text-red-500 italic outline-dotted "
                                        : "text-lg font-bold"
                                } `}
                                placeholder={
                                    variantErrors[index]?.discount
                                        ? "Required ..."
                                        : ""
                                }
                            />
                        </td>

                    </tr>
                </Tooltip>
            ))}
            </tbody>
        </table>
    );
}

export default memo(SkuTable);
