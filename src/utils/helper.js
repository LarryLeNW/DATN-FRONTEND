export const formatMoney = (number) =>
    Number(number?.toFixed(1)).toLocaleString();

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

export const trunCateText = ({ text, maxLength }) => {
    if (!text) return "N/A";

    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
};

export const fillUniqueATTSkus = (skus, attributes) =>
    skus.reduce(
        (acc, current) => {
            if (!acc.seen.has(current?.attributes[attributes])) {
                acc.seen.add(current?.attributes[attributes]);
                acc.result.push(current);
            }
            return acc;
        },
        { seen: new Set(), result: [] }
    ).result;
