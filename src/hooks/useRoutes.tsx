import Products from "components/Products/Products";
import paths from "constant/paths";
import AdminLayout from "layout/admin";
import PublicLayout from "layout/public";
import {
    BlogManagerPage,
    DashboardPage,
    OrderManagerPage,
    ProductManagerPage,
    UserManagerPage,
    VariantProductMangerPage,
} from "pages/admin";
import {
    BlogsPage,
    ConfirmRegisterPage,
    DetailBlogPage,
    DetailProductPage,
    FAQPage,
    HomePage,
    IntroducePage,
    LoginPage,
    OutServicePage,
    ProductsPage,
} from "pages/public";

import { useRoutes } from "react-router-dom";

function useRouter() {
    const element = useRoutes([
        {
            path: "/",
            element: <PublicLayout />,
            children: [
                {
                    index: true,
                    element: <HomePage />,
                },
                {
                    path: paths.LOGIN,
                    element: <LoginPage />,
                },
                {
                    path: paths.CONFIRM_REGISTER,
                    element: <ConfirmRegisterPage />,
                },
                {
                    path: paths.INTRODUCE,
                    element: <IntroducePage />,
                },
                {
                    path: paths.BLOGS,
                    element: <BlogsPage />,
                },
                {
                    path: paths.DETAIL_BLOG,
                    element: <DetailBlogPage />,
                },
                {
                    path: paths.FAQ,
                    element: <FAQPage />,
                },
                {
                    path: paths.OUR_SERVICES,
                    element: <OutServicePage />,
                },
                {
                    path: paths.PRODUCTS,
                    element: <ProductsPage />,
                },
                {
                    path: paths.DETAIL_PRODUCT,
                    element: <DetailProductPage />,
                },
            ],
        },
        {
            element: <AdminLayout />,
            children: [
                {
                    path: paths.ADMIN.HOME,
                    element: <DashboardPage />,
                },
                {
                    path: paths.ADMIN.USER_MANAGEMENT,
                    element: <UserManagerPage />,
                },
                {
                    path: paths.ADMIN.BLOG_MANAGEMENT,
                    element: <BlogManagerPage />,
                },
                {
                    path: paths.ADMIN.ORDER_MANAGEMENT,
                    element: <OrderManagerPage />,
                },
                {
                    path: paths.ADMIN.PRODUCT_MANAGEMENT,
                    element: <ProductManagerPage />,
                },
                {
                    path: paths.ADMIN.VARIANT_PRODUCT_MANAGEMENT,
                    element: <VariantProductMangerPage />,
                },
            ],
        },
    ]);

    return element;
}

export default useRouter;
