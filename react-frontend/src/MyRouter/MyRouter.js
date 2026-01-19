import React from "react";
import { Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import ProtectedRoute from "./ProtectedRoute";
import NoMatch from "./NoMatch";
import ProjectSideBarLayout from "../components/Layouts/ProjectSideBarLayout";
import LoginPage from "../components/LoginPage/LoginPage";
import SignUpPage from "../components/LoginPage/signUp/SignUpPage";
import ResetPage from "../components/LoginPage/ResetPage";
import MaintenancePage from "../components/common/MaintenancePage";
import LoginFaqPage from "../components/LoginPage/LoginFaqPage";
import DashboardAdminControl from "../components/Dashboard/DashboardAdminControl";
import DashboardCompanyData from "../components/Dashboard/DashboardCompanyData";
import DashboardDataManagement from "../components/Dashboard/DashboardDataManagement";
import DashboardErrors from "../components/Dashboard/DashboardErrors";
import DashboardMessaging from "../components/Dashboard/DashboardMessaging";
import DashboardUserManagement from "../components/Dashboard/DashboardUserManagement";
import DashboardGenAi from "../components/Dashboard/DashboardGenAi";
import DashboardHRControls from "../components/Dashboard/DashboardHRControls";
import DashboardWelcome from "../components/Dashboard/DashboardWelcome";
import MigrationPage from "../components/mongodb_component/MigrationPage";
import Account from "../components/cb_components/Account/Account";
import CBRouter from "./CBRouter";
import AppRouter from "./AppRouter";
import ErrorLogProjectLayoutPage from "../components/cb_components/ErrorLogsPage/ErrorLogProjectLayoutPage";

//  ~cb-add-import~

const MyRouter = (props) => {
  return (
    <Routes>
      <Route
        path="/"
        exact
        element={
          props.isLoggedIn ? (
            <div className="flex min-h-[calc(100vh-5rem)] bg-white mt-20">
              <ProjectSideBarLayout>
                {" "}
                <DashboardWelcome />{" "}
              </ProjectSideBarLayout>{" "}
            </div>
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/login"
        exact
        element={
          props.isLoggedIn ? (
            <div className="flex min-h-[calc(100vh-5rem)] bg-white mt-20">
              <ProjectSideBarLayout>
                {" "}
                <DashboardWelcome />{" "}
              </ProjectSideBarLayout>{" "}
            </div>
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/reset/:singleChangeForgotPasswordId"
        exact
        element={<ResetPage />}
      />
      <Route path="/signup" exact element={<SignUpPage />} />
      <Route path="/maintenance" exact element={<MaintenancePage />} />
      <Route path="/login-faq" exact element={<LoginFaqPage />} />

      <Route element={<ProtectedRoute redirectPath={"/login"} />}>
        <Route path="/project" exact element={<DashboardWelcome />} />
        {/* user details */}
        <Route path="/account" exact element={<Account />} />
        <Route
          path="/DashboardAdminControl"
          exact
          element={<DashboardAdminControl />}
        />
        <Route
          path="/DashboardCompanyData"
          exact
          element={<DashboardCompanyData />}
        />
        <Route
          path="/DashboardDataManagement"
          exact
          element={<DashboardDataManagement />}
        />
        <Route path="/DashboardErrors" exact element={<DashboardErrors />} />
        <Route path="/DashboardGenAi" exact element={<DashboardGenAi />} />
        <Route
          path="/DashboardHRControls"
          exact
          element={<DashboardHRControls />}
        />
        <Route
          path="/DashboardMessaging"
          exact
          element={<DashboardMessaging />}
        />
        <Route
          path="/DashboardUserManagement"
          exact
          element={<DashboardUserManagement />}
        />
        <Route path="/migration" exact element={<MigrationPage />} />
        <Route
          path="/errorLogs"
          exact
          element={<ErrorLogProjectLayoutPage />}
        />

        <Route path="/*" exact element={<CBRouter />} />
        <Route path="/*" exact element={<AppRouter />} />
      </Route>
      {/* ~cb-add-route~ */}
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
};

const mapState = (state) => {
  const { isLoggedIn } = state.auth;
  return { isLoggedIn };
};
const mapDispatch = (dispatch) => ({
  alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(MyRouter);
