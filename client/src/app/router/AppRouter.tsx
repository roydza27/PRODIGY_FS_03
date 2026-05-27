import { BrowserRouter, Route, Routes } from "react-router-dom";

import PublicLayout from "@/shared/layouts/PublicLayout";
import AuthLayout from "@/shared/layouts/AuthLayout";
import AdminLayout from "@/shared/layouts/AdminLayout";
import SellerLayout from "@/shared/layouts/SellerLayout";

import ProtectedRoute from "@/app/router/ProtectedRoute"; // Unified Guard
import PublicOnlyRoute from "@/app/router/PublicOnlyRoute";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/features/auth/pages/ResetPasswordPage";

import AccountHomePage from "@/features/account/pages/AccountHomePage";
import AccountOrdersPage from "@/features/account/pages/AccountOrdersPage";
import AccountWishlistPage from "@/features/account/pages/AccountWishlistPage";
import AccountReviewsPage from "@/features/account/pages/AccountReviewsPage";
import AccountSettingsPage from "@/features/account/pages/AccountSettingsPage";
import AccountInvoicesPage from "@/features/account/pages/AccountInvoicesPage";
import AccountHistoryPage from "@/features/account/pages/AccountHistoryPage";
import AccountSavedPage from "@/features/account/pages/AccountSavedPage";
import SupportPage from "@/features/account/pages/SupportPage";
import SearchPage from "@/features/account/pages/SearchPage";
import AccountOrderDetailsPage from "@/features/account/pages/AccountOrderDetailsPage";
import AccountBecomeSellerPage from "@/features/account/pages/AccountBecomeSellerPage";
import AccountBillingPage from "@/features/account/pages/AccountBillingPage";

import AdminDashboardPage from "@/features/admin/pages/AdminDashboardPage";
import AdminProductsPage from "@/features/admin/pages/AdminProductsPage";
import AdminOrdersPage from "@/features/admin/pages/AdminOrdersPage";
import AdminCustomersPage from "@/features/admin/pages/AdminCustomersPage";
import AdminAnalyticsPage from "@/features/admin/pages/AdminAnalyticsPage";
import AdminInventoryPage from "@/features/admin/pages/AdminInventoryPage";
import AdminReportsPage from "@/features/admin/pages/AdminReportsPage";
import AdminShipmentsPage from "@/features/admin/pages/AdminShipmentsPage";
import AdminSettingsPage from "@/features/admin/pages/AdminSettingsPage";
import AdminStaffPage from "@/features/admin/pages/AdminStaffPage";
import AdminSupportPage from "@/features/admin/pages/AdminSupportPage";
import AdminSellerApplicationsPage from "@/features/admin/pages/AdminSellerApplicationsPage";
import AdminProductsFormPage from "@/features/admin/pages/AdminProductsFormPage"; // Kept consistent with file name

import { ProductsPage, ProductDetailsPage } from "@/features/products";
import { CheckoutPage } from "@/features/checkout";
import { CartPage } from "@/features/cart";
import HomePage from "@/features/home/pages/HomePage";

import SellerDashboardPage from "@/features/seller/pages/SellerDashboardPage";
import SellerProductsPage from "@/features/seller/pages/SellerProductsPage";
import SellerProductFormPage from "@/features/seller/pages/SellerProductFormPage";
import SellerOrdersPage from "@/features/seller/pages/SellerOrdersPage";
import SellerAnalyticsPage from "@/features/seller/pages/SellerAnalyticsPage";
import SellerInventoryPage from "@/features/seller/pages/SellerInventoryPage";
import SellerEarningsPage from "@/features/seller/pages/SellerEarningsPage";
import SellerShipmentsPage from "@/features/seller/pages/SellerShipmentsPage";
import SellerSettingsPage from "@/features/seller/pages/SellerSettingsPage";
import SellerSupportPage from "@/features/seller/pages/SellerSupportPage";
import SellerApplicationPage from "@/features/seller/pages/SellerApplicationPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* PUBLIC ROUTES (No Auth Required) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
        </Route>

        {/* AUTH ONLY ROUTES (Login/Register) */}
        <Route element={<PublicOnlyRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Route>

        {/* BASIC PROTECTED ROUTES (Any logged-in user, seller, or admin can buy/browse) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<PublicLayout />}>
            <Route path="/account" element={<AccountHomePage />} />
            <Route path="/account/orders" element={<AccountOrdersPage />} />
            <Route path="/account/orders/:id" element={<AccountOrderDetailsPage />} />
            <Route path="/account/wishlist" element={<AccountWishlistPage />} />
            <Route path="/account/reviews" element={<AccountReviewsPage />} />
            <Route path="/account/settings" element={<AccountSettingsPage />} />
            <Route path="/account/invoices" element={<AccountInvoicesPage />} />
            <Route path="/account/history" element={<AccountHistoryPage />} />
            <Route path="/account/saved" element={<AccountSavedPage />} />
            <Route path="/account/become-seller" element={<AccountBecomeSellerPage />} />
            <Route path="/account/billing" element={<AccountBillingPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/seller/apply" element={<SellerApplicationPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Route>
        </Route>

        {/* SELLER ONLY ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
          <Route element={<SellerLayout />}>
            <Route path="/seller" element={<SellerDashboardPage />} />
            <Route path="/seller/products" element={<SellerProductsPage />} />
            <Route path="/seller/products/create" element={<SellerProductFormPage />} />
            <Route path="/seller/products/:id/edit" element={<SellerProductFormPage />} />
            <Route path="/seller/orders" element={<SellerOrdersPage />} />
            <Route path="/seller/analytics" element={<SellerAnalyticsPage />} />
            <Route path="/seller/inventory" element={<SellerInventoryPage />} />
            <Route path="/seller/earnings" element={<SellerEarningsPage />} />
            <Route path="/seller/shipments" element={<SellerShipmentsPage />} />
            <Route path="/seller/settings" element={<SellerSettingsPage />} />
            <Route path="/seller/support" element={<SellerSupportPage />} />
          </Route>
        </Route>

        {/* ADMIN ONLY ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/products/create" element={<AdminProductsFormPage />} />
            {/* CORRECTION: Fixed both component name reference and normalized param key to :id */}
            <Route path="/admin/products/:id/edit" element={<AdminProductsFormPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/customers" element={<AdminCustomersPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/inventory" element={<AdminInventoryPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/admin/shipments" element={<AdminShipmentsPage />} />
            <Route path="/admin/seller-applications" element={<AdminSellerApplicationsPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
            <Route path="/admin/staff" element={<AdminStaffPage />} />
            <Route path="/admin/support" element={<AdminSupportPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;