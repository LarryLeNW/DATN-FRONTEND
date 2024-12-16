export const convertStatusOrder = (status) => {
    if (status === "PENDING")
        return { text: "Đang xử lí", textColor: "text-yellow-500" };
    if (status === "UNPAID")
        return {
            text: "Đã hủy thanh toán",
            textColor: "text-orange-500",
        };
    if (status === "SHIPPED")
        return { text: "Đang vận chuyển", textColor: "text-purple-500" };
    if (status === "CANCELLED")
        return { text: "Đã hủy", textColor: "text-red-500" };
    if (status === "DELIVERED")
        return { text: "Đã giao", textColor: "text-green-500" };
};

const languageData = {
    PENDING: "Đang xử lí",
    RENTED: "Đang thuê",
    RETURNED: "Đã trả hàng",
    CANCELLED: "Đã hủy",
    EXPIRED: "Hết hạn",
    UNPAID: "Chưa thanh toán",
    SHIPPED: "Đang giao",
};

export const convertVI = (text) => {
    return languageData[text?.toUpperCase()] || text;
};
