import React from "react";
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
import DetailCart from "pages/public/Cart";
import Profile from "pages/public/Profile";
import DetailProduct from "pages/public/DetailProduct";

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
                    element: <DetailProduct/>
                },
                {
                    path: paths.DETAIL_PRODUCT,
                    element: <DetailProductPage />,
                },
                {
                    path: paths.DETAIL_CART,
                    element: <DetailCart />,
                },
                {
                    path: paths.PROFILE,
                    element: <Profile />,
                },

            ],
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
