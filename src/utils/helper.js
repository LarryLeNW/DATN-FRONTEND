export const formatMoney = (number) =>
    Number(number?.toFixed(1)).toLocaleString();

export const formatCurrency = (amount) => {
    if (!amount) return "0đ";
    if (amount >= 1000000000) {
        return amount / 1000000000 + " tỷ";
    } else if (amount >= 1000000) {
        return amount / 1000000 + " triệu";
    } else if (amount >= 1000) {
        return amount / 1000 + "k";
    } else {
        return amount.toString() + "đ";
    }
};

export const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export const convertBase64ToImage = (base64, filename, type) => {
    return fetch(base64)
        .then(function (res) {
            return res.arrayBuffer();
        })
        .then(function (buf) {
            return new File([buf], filename, { type: type });
        });
};

export function capitalizeWords(str) {
    return str
        ?.split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export const fillUniqueItems = (items, keyUnique) =>
    items.reduce(
        (acc, current) => {
            if (!acc.seen.has(current[keyUnique])) {
                acc.seen.add(current[keyUnique]);
                acc.result.push(current);
            }
            return acc;
        },
        { seen: new Set(), result: [] }
    ).result;

export const trunCateText = (text = "", maxLength = 0) => {
    return text?.length > maxLength
        ? text?.substring(0, maxLength) + "..."
        : text;
};

export const fillUniqueATTSkus = (skus, att) =>
    skus.reduce(
        (acc, current) => {
            if (
                !acc.seen.has(current?.attributes[att]) &&
                !!current.attributes[att]
            ) {
                acc.seen.add(current?.attributes[att]);
                acc.result.push(current);
            }
            return acc;
        },
        { seen: new Set(), result: [] }
    ).result;

export const fillUniqueATTsSkus = (skus, atts) => {
    return skus.reduce(
        (acc, current) => {
            const uniqueKey = atts
                .map((att) => current?.attributes[att])
                .join("-");

            if (
                !acc.seen.has(uniqueKey) &&
                atts.every((att) => !!current?.attributes[att])
            ) {
                acc.seen.add(uniqueKey);
                acc.result.push(current);
            }

            return acc;
        },
        { seen: new Set(), result: [] }
    ).result;
};

export const findSkuByMultipleAttributes = (skus, attributes) => {
    console.log("🚀 ~ findSkuByMultipleAttributes ~ attributes:", attributes);
    return skus.find((sku) =>
        attributes.every((attr) => {
            return sku.attributes[attr.key] === attr.value;
        })
    );
};

export const cleanEmptyDataObject = (data) => {
    return Object.keys(data).reduce((acc, key) => {
        if (data[key] !== "" && data[key] !== undefined) {
            acc[key] = data[key];
        }
        return acc;
    }, {});
};
