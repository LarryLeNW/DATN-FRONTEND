import { useEffect, useState } from "react";
import { fillUniqueATTSkus } from "utils/helper";

function ItemSku({ data, skus }) {
    const [selectedATT, setSelectedATT] = useState({});
    const [selectedSku, setSelectedSKU] = useState(null);

    useEffect(() => {
        skus.forEach((sku, index) => {
            const isMatch = Object.entries(selectedATT).every(
                ([key, value]) => {
                    return sku?.attributes[key] === value;
                }
            );

            if (isMatch) {
                console.log("🚀 ~ skus.forEach ~ sku:", sku);
            }
        });
    }, [selectedATT]);

    return (
        <div
            className={`px-2 flex gap-2 bg-slate-100 rounded cursor-pointer p-2  ${"shadow-md shadow-blue-700"} `}
        >
            <div>
                <img
                    src={data.images.split(",")[0]}
                    alt=""
                    className="w-16 h-16 rounded border object-contain"
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 flex-wrap items-center">
                    <h1 className="text-primary ">Kính thước : </h1>
                    <div className="flex gap-2">
                        {fillUniqueATTSkus(skus, "size").map((el) => (
                            <div className="py-1 border rounded px-2 bg-white">
                                {el.attributes.size}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                    <h1 className="text-primary ">Chất liệu : </h1>
                    <div className="flex gap-2">
                        {fillUniqueATTSkus(skus, "material").map((el) => (
                            <div className="py-1 border rounded px-2 bg-white">
                                {el.attributes.material}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemSku;
