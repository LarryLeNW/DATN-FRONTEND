import React from "react";
import paths from "constant/paths";
import AdminLayout from "layout/admin";
import PublicLayout from "layout/public";
import {
    BlogCateManagerPage,
    BlogManagerPage,
    DashboardPage,
    OrderManagerPage,
    ProductBrandManagerPage,
    ProductCategoryManagerPage,
    ProductManagerPage,
    UpdateProductPage,
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
                    element: <DetailProduct />,
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
                {
                    path: paths.CHECKOUT,
                    element: <CheckOut />,
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
                    path: paths.ADMIN.BLOG_CATEGORY_MANAGEMENT,
                    element: <BlogCateManagerPage />,
                },
                {
                    path: paths.ADMIN.ORDER_MANAGEMENT,
                    element: <OrderManagerPage />,
                },
                {
                    path: paths.ADMIN.PRODUCT_CATEGORY_MANAGEMENT,
                    element: <ProductCategoryManagerPage />,
                },
                {
                    path: paths.ADMIN.PRODUCT_BRAND_MANAGEMENT,
                    element: <ProductBrandManagerPage />,
                },
                {
                    path: paths.ADMIN.PRODUCT_MANAGEMENT,
                    element: <ProductManagerPage />,
                },
                {
                    path: paths.ADMIN.UPDATE_PRODUCT,
                    element: <UpdateProductPage />,
                },
            ],
        },
    ]);

    return element;
}

export default useRouter;
