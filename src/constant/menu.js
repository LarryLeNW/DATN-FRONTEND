import ICONS from "utils/icons";
import paths from "./paths";

export const menuAdminSidebar = [
    {
        id: 1,
        type: "SINGLE",
        text: "Dashboard",
        path: paths.ADMIN.HOME,
        icon: <ICONS.AiFillDashboard />,
    },
    {
        id: 2,
        type: "SINGLE",
        text: "User Management",
        path: paths.ADMIN.USER_MANAGEMENT,
        icon: <ICONS.FaUsersGear />,
    },
    {
        id: 3,
        type: "PARENT",
        text: "Product Management",
        icon: <ICONS.RiProductHuntLine />,
        submenu: [
            {
                id: 1,
                text: "Categories",
                path: paths.ADMIN.PRODUCT_CATEGORY_MANAGEMENT,
            },
            {
                id: 4,
                text: "Brands",
                path: paths.ADMIN.PRODUCT_BRAND_MANAGEMENT,
            },
            {
                id: 3,
                text: "List Product",
                path: paths.ADMIN.PRODUCT_MANAGEMENT,
            },
            {
                id: 2,
                text: "Create Quickly",
                path: paths.ADMIN.UPDATE_PRODUCT,
            },
        ],
    },
    {
        id: 4,
        type: "PARENT",
        text: "Blog Management",
        icon: <ICONS.FaBlog />,
        submenu: [
            {
                id: 1,
                text: "Categories",
                path: paths.ADMIN.BLOG_CATEGORY_MANAGEMENT,
            },
            {
                id: 2,
                text: "List",
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
        type: "PARENT",
        text: "Order Manager",
        icon: <ICONS.TbPackages />,
        submenu: [
            {
                id: 1,
                text: "List",
                path: paths.ADMIN.ORDER_MANAGEMENT,
            },
            {
                id: 2,
                text: "Create Quickly",
                path: paths.ADMIN.UPDATE_ORDER,
            },
        ],
    },
];
