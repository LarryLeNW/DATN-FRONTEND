import React from "react";
import paths from "constant/paths";
import AdminLayout from "layout/admin";
import PublicLayout from "layout/public";
import ProfileLayout from "layout/profile";

import {
    BlogCateManagerPage,
    BlogManagerPage,
    CreateVoucherPage,
    DashboardPage,
    DuplicateProductPage,
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
    ConfirmRegisterPage,
    ContactPage,
    CouponPage,
    DetailBlogPage,
    DetailProductPage,
    FQAPage,
    HomePage,
    IntroducePage,
    LoginPage,
    OutServicePage,
    ProductsPage,
} from "pages/public";

import { useRoutes } from "react-router-dom";

import {
    AddressAccountPage,
    ChangePasswordPage,
    CreateAddressPage,
    DetailOrderPage,
    EditAccountPage,
    OrderHistoryPage,
    UpdateAddressPage,
} from "pages/profile";
import {
    DetailCartPage,
    RentalPaymentPage,
    SalePaymentPage,
    SuccessPaymentPage,
} from "pages/checkout";
import SuccessRentalPayment from "pages/checkout/SuccessRentalPayment";

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
                    element: <ProfileLayout />,
                    children: [
                        {
                            path: paths.MEMBER.EDIT_ACCOUNT,
                            element: <EditAccountPage />,
                        },
                        {
                            path: paths.MEMBER.ADDRESS_ACCOUNT,
                            element: <AddressAccountPage />,
                        },
                        {
                            path: paths.MEMBER.CREATE_ADDRESS_ACCOUNT,
                            element: <CreateAddressPage />,
                        },
                        {
                            path: paths.MEMBER.UPDATE_ADDRESS_ACCOUNT,
                            element: <UpdateAddressPage />,
                        },
                        {
                            path: paths.MEMBER.CHANGE_PASSWORD,
                            element: <ChangePasswordPage />,
                        },
                        {
                            path: paths.MEMBER.ORDER_HISTORY,
                            element: <OrderHistoryPage />,
                        },
                        {
                            path: paths.MEMBER.DETAIL_ORDER,
                            element: <DetailOrderPage />,
                        },
                    ],
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
                    path: paths.FQA,
                    element: <FQAPage />,
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
                    path: paths.CHECKOUT.CART,
                    element: <DetailCartPage />,
                },
                {
                    path: paths.COUPONS,
                    element: <CouponPage />,
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
            path: paths.CHECKOUT.PAYMENT,
            element: <SalePaymentPage />,
        },
        {
            path: paths.CHECKOUT.RENTAL_PAYMENT,
            element: <RentalPaymentPage />,
        },
        {
            path: paths.CHECKOUT.SUCCESS_PAYMENT,
            element: <SuccessPaymentPage />,
        },
        {
            path: paths.CHECKOUT.SUCCESS_RENTAL_PAYMENT,
            element: <SuccessRentalPayment />,
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
                {
                    path: paths.ADMIN.DUPLICATE_PRODUCT,
                    element: <DuplicateProductPage />,
                },
            ],
        },
    ]);

    return element;
}

export default useRouter;
