import ICONS from "utils/icons";
import paths from "./paths";

export const menuAdminSidebar = [
    {
        id: 1,
        text: "Dashboard",
        path: paths.ADMIN.HOME,
        icon: <ICONS.AiFillDashboard />,
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
                path: paths.ADMIN.UPDATE_ORDER,
            },
        ],
    },
];
