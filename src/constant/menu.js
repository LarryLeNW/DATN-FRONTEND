import ICONS from "utils/icons";
import paths from "./paths";

export const menuAdminSidebar = [
    {
        id: 1,
        text: "Trang chủ",
        path: paths.ADMIN.HOME,
        icon: <ICONS.AiFillDashboard />,
    },
    {
        id: 1,
        text: "Khuyến Mãi",
        path: paths.ADMIN.VOUCHER_MANAGEMENT,
        icon: <ICONS.BiSolidDiscount />,
    },
    {
        id: 2,
        text: "Quản lí người dùng",
        icon: <ICONS.FaUsersGear />,
        submenu: [
            {
                id: 1,
                text: "Danh sách",
                path: paths.ADMIN.USER_MANAGEMENT,
            },
            {
                id: 2,
                text: "Vai trò người dùng",
                path: paths.ADMIN.ROLE_MANAGEMENT,
            },
        ],
    },
    {
        id: 3,
        text: "Quản lí sản phẩm",
        icon: <ICONS.RiProductHuntLine />,
        submenu: [
            {
                id: 1,
                text: "Loại sản phẩm",
                path: paths.ADMIN.PRODUCT_CATEGORY_MANAGEMENT,
            },
            {
                id: 4,
                text: "Thương hiệu sản phẩm",
                path: paths.ADMIN.PRODUCT_BRAND_MANAGEMENT,
            },
            {
                id: 3,
                text: "Danh sách sản phẩm",
                path: paths.ADMIN.PRODUCT_MANAGEMENT,
            },
            {
                id: 2,
                text: "Tạo nhanh",
                path: paths.ADMIN.UPDATE_PRODUCT,
            },
        ],
    },
    {
        id: 4,
        text: "Quản lí bài viết",
        icon: <ICONS.FaBlog />,
        submenu: [
            {
                id: 1,
                text: "Loại bài viết",
                path: paths.ADMIN.BLOG_CATEGORY_MANAGEMENT,
            },
            {
                id: 2,
                text: "Danh sách bài viết",
                path: paths.ADMIN.BLOG_MANAGEMENT,
            },
            // {
            //     id: 2,
            //     text: "Create Quickly",
            //     path: paths.ADMIN.UPDATE_BLOG,
            // },
        ],
    },
    {
        id: 5,
        text: "Quản lí đơn hàng",
        icon: <ICONS.TbPackages />,
        submenu: [
            {
                id: 1,
                text: "Danh sách đơn hàng",
                path: paths.ADMIN.ORDER_MANAGEMENT,
            },
            {
                id: 2,
                text: "Tạo nhanh",
                path: paths.ADMIN.CREATE_ORDER,
            },
        ],
    },
    {
        id: 5,
        text: "Quản lí đơn thuê",
        icon: <ICONS.FaBusinessTime />,
        submenu: [
            {
                id: 1,
                text: "Danh sách đơn ",
                path: paths.ADMIN.RENTAL_MANAGEMENT,
            },
            {
                id: 1,
                text: "Tạo nhanh ",
                path: paths.ADMIN.UPDATE_RENTAL_MANAGEMENT,
            },
        ],
    },
    {
        id: 5,
        text: "Thống kê",
        icon: <ICONS.FaBusinessTime />,
        submenu: [
            {
                id: 1,
                text: "Đơn mua",
                path: paths.ADMIN.ORDER_STATISTIC_MANAGEMENT,
            },
            {
                id: 2,
                text: "Đơn thuê",
                path: paths.ADMIN.RENTAL_STATISTIC_MANAGEMENT,
            },
            {
                id: 3,
                text: "Người dùng",
                path: paths.ADMIN.USER_STATISTIC_MANAGEMENT,
            },
            {
                id: 4,
                text: "Doanh thu",
                path: paths.ADMIN.REVENUE_STATISTIC_MANAGEMENT,
            },
        ],
    },
];

export const menuProfileSidebar = [
    {
        id: 1,
        text: "Thông tin tài khoản",
        path: paths.MEMBER.EDIT_ACCOUNT,
        icon: <ICONS.FaUser />,
    },
    {
        id: 1,
        text: "Sổ địa chỉ",
        path: paths.MEMBER.ADDRESS_ACCOUNT,
        icon: <ICONS.GiPositionMarker />,
    },
    {
        id: 1,
        text: "Đơn mua",
        path: paths.MEMBER.ORDER_HISTORY,
        icon: <ICONS.FaBorderAll />,
    },
    {
        id: 1,
        text: "Đơn thuê",
        path: paths.MEMBER.RENTAL_HISTORY,
        icon: <ICONS.FaBusinessTime />,
    },
    {
        id: 1,
        text: "Đổi mật khẩu",
        path: paths.MEMBER.CHANGE_PASSWORD,
        icon: <ICONS.TbPasswordUser />,
    },
];
