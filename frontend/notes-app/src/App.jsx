import React, { useEffect } from "react";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Modal from "react-modal";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUpPage from "./pages/SignUp/SignUp";
import Landing from "./pages/Landing/Landing";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const App = () => {
  useEffect(() => {
    // Set the app element for react-modal accessibility
    Modal.setAppElement("#root");
  }, []);
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <>
                <SignedIn>
                  <Home />
                </SignedIn>
                <SignedOut>
                  <Landing />
                </SignedOut>
              </>
            }
          />
          <Route path="/login" exact element={<Login />} />
          <Route path="/signup" exact element={<SignUpPage />} />
          <Route path="/signUp" exact element={<SignUpPage />} />
          <Route path="/landing" exact element={<Landing />} />
          <Route path="/privacy-policy" exact element={<PrivacyPolicy />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
};

export default App;
