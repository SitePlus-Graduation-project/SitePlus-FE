import ForgotPassPage from "@/lib/auth/pages/ForgotPassPage";
import LoginPage from "@/lib/auth/pages/LoginPage";
import RegisterPage from "@/lib/auth/pages/RegisterPage";
import { SnackbarProvider } from "notistack";
import * as React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import AdminPage from "./lib/admin/pages/AdminPage";
import AdminUserPage from "./lib/admin/pages/AdminUserPage";
import { ThemeProvider } from "./lib/all-site/ThemeProvider";
import OTP_Page from "./lib/auth/pages/OTP_Page";
import ResetPassPage from "./lib/auth/pages/ResetPassPage";
import ContactPage from "./lib/cilent/contact-page/pages/ContactPage";
import RatingRequestsPage from "./lib/cilent/homepage/components/survey-form/pages/RatingRequestsPage";
import SurveyRequestsPage from "./lib/cilent/homepage/components/survey-form/pages/SurveyRequestsPage";
import HomePage from "./lib/cilent/homepage/pages/HomePage";
import InfoPage from "./lib/cilent/infopage/pages/InfoPage";
import ManagerPage from "./lib/manager/pages/ManagerPage";
import AreaManagerPage from "./lib/area-manager/pages/AreaManagerPage";
import { AuthProvider } from "./services/AuthContext";
import ProtectedRoute from "./services/ProtectedRoute";
import ManagerRequest from "./lib/manager/pages/ManagerRequest";
import ManagerTask from "./lib/manager/pages/ManagerTask";
import ManagerSurvey from "./lib/manager/pages/ManagerSurvey";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      autoHideDuration={3000}
    >
      {" "}
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              {/* Redirect root to /home-page */}

              <Route
                path="/"
                element={
                  <ProtectedRoute element={<HomePage />} allowGuest={true} />
                }
              />
              <Route
                path="/customer-page"
                element={
                  <ProtectedRoute
                    element={<HomePage />}
                    roles={["Customer"]}
                    allowGuest={true}
                  />
                }
              />
              <Route
                path="/admin-page"
                element={
                  <ProtectedRoute element={<AdminPage />} roles={["Admin"]} />
                }
              />
              <Route
                path="/admin-users"
                element={
                  <ProtectedRoute
                    element={<AdminUserPage />}
                    roles={["Admin"]}
                  />
                }
              />
              <Route
                path="/rating-requests-page"
                element={
                  <ProtectedRoute
                    element={<RatingRequestsPage />}
                    roles={["Customer"]}
                  />
                }
              />
              <Route
                path="/survey-requests-page"
                element={
                  <ProtectedRoute
                    element={<SurveyRequestsPage />}
                    roles={["Customer"]}
                  />
                }
              />
              <Route path="/sign-up" element={<RegisterPage />} />
              <Route path="/sign-in" element={<LoginPage />} />
              <Route path="/contact-page" element={<ContactPage />} />
              <Route path="/forgot-password" element={<ForgotPassPage />} />
              <Route path="/OTP-page" element={<OTP_Page />} />
              <Route path="/reset-page" element={<ResetPassPage />} />
              <Route path="/info-page" element={<InfoPage />} />
              <Route path="/manager-page" element={<ProtectedRoute element={<ManagerPage />} roles={["Manager"]} />} />
              <Route path="/manager-request" element={<ProtectedRoute element={<ManagerRequest />} roles={["Manager"]} />} />
              <Route path="/manager-task" element={<ProtectedRoute element={<ManagerTask />} roles={["Manager"]} />} />
              <Route path="/manager-survey" element={<ProtectedRoute element={<ManagerSurvey />} roles={["Manager"]} />} />
              <Route path="/area-manager-page" element={<ProtectedRoute element={<AreaManagerPage />} roles={["Area-Manager"]} />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </SnackbarProvider>
  </StrictMode>
);
