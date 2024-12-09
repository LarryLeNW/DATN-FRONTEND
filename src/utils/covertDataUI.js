export const convertStatusOrder = (status) => {
    if (status === "PENDING")
        return { text: "Đang xử lí", textColor: "text-orange-500" };
    if (status === "UNPAID")
        return {
            text: "Đang chờ thanh toán",
            textColor: "text-yellow-500",
        };
    if (status === "SHIPPED")
        return { text: "Đang vận chuyển", textColor: "text-purple-500" };
    if (status === "CANCELLED")
        return { text: "Đã hủy", textColor: "text-red-500" };
    if (status === "DELIVERED")
        return { text: "Đã giao", textColor: "text-green-500" };
};
