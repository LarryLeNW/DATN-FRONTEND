import React from "react";
import paths from "constant/paths";
import AdminLayout from "layout/admin";
import PublicLayout from "layout/public";
import {
    BlogCateManagerPage,
    BlogManagerPage,
    CreateVoucherPage,
    DashboardPage,
    OrderDetailManagerPage,
    OrderManagerPage,
    ProductBrandManagerPage,
    ProductCategoryManagerPage,
    ProductManagerPage,
    RoleManagerPage,
    UpdateProductPage,
    UpdateVoucherPage,
    UserManagerPage,
    VoucherManagerPage,
} from "pages/admin";
import {
    BlogsPage,
    CheckoutPage,
    ConfirmRegisterPage,
    ContactPage,
    CouponPage,
    DetailBlogPage,
    DetailProductPage,
    HomePage,
    IntroducePage,
    LoginPage,
    OutServicePage,
    ProductsPage,
} from "pages/public";

import { useRoutes } from "react-router-dom";
import DetailCart from "pages/public/DetailCart";
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
                    path: paths.CONTACT,
                    element: <ContactPage />,
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
                {
                    path: paths.DETAIL_CART,
                    element: <DetailCart />,
                },
                {
                    path: paths.COUPONS,
                    element: <CouponPage />,
                },
                {
                    path: paths.PROFILE,
                    element: <Profile />,
                },
                {
                    path: paths.CHECKOUT,
                    element: <CheckoutPage />,
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
                    path: paths.ADMIN.VOUCHER_MANAGEMENT,
                    element: <VoucherManagerPage />,
                },
                {
                    path: paths.ADMIN.CREATE_VOUCHER,
                    element: <CreateVoucherPage />,
                },
                {
                    path: paths.ADMIN.UPDATE_VOUCHER,
                    element: <UpdateVoucherPage />,
                },
                {
                    path: paths.ADMIN.USER_MANAGEMENT,
                    element: <UserManagerPage />,
                },
                {
                    path: paths.ADMIN.ROLE_MANAGEMENT,
                    element: <RoleManagerPage />,
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
                    path: paths.ADMIN.ORDER_DETAIL_MANAGEMENT,
                    element: <OrderDetailManagerPage />,
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
