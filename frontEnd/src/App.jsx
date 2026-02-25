import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axiosInstance from "./utils/axios";

import AuthPage from "./components/Auth";
import LandingPage from "./components/LandingPage";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import { store } from "./store";
import { Provider } from "react-redux";
import { setUser, logout } from "./ReduxSlices/userSlice";
import Home from "./components/Home";
import Footer from "./components/Footer";
import ForgotPassword from "./components/ForgotPassword";
import Admin from "./components/Admin";
import AssessmentList from "./components/AssessmentList";
import CreateAssessment from "./components/CreateAssessment";
import EditAssessment from "./components/EditAssessment";
import ManageQuestions from "./components/ManageQuestions";
import TakeAssessment from "./components/TakeAssessment";
import UserAssessments from "./components/UserAssessments";
import MyResults from "./components/MyResults";

function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axiosInstance.get("/users/profile");
        console.log("User authenticated:", data);
        dispatch(setUser(data));
      } catch (error) {
        console.log("Not logged in or session expired");
        dispatch(logout());
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#150030]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  const location = useLocation();
  const hideHeaderOrFooter =
    location.pathname === "/" ||
    location.pathname === "/auth" ||
    location.pathname === "/forgot-password";

  return (
    <>
      {!hideHeaderOrFooter && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assessments"
          element={
            <ProtectedRoute>
              <AssessmentList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create"
          element={
            <ProtectedRoute>
              <CreateAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assessment/edit/:id"
          element={
            <ProtectedRoute>
              <EditAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/assessment/:id/questions"
          element={
            <ProtectedRoute>
              <ManageQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessment/:id"
          element={
            <ProtectedRoute>
              <TakeAssessment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessments"
          element={
            <ProtectedRoute>
              <UserAssessments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-results"
          element={
            <ProtectedRoute>
              <MyResults />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!hideHeaderOrFooter && <Footer />}
    </>
  );
}

export default AppWrapper;
