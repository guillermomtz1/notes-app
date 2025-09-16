import React from "react";
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-surface border border-border shadow-lg",
            headerTitle: "text-text text-2xl font-semibold",
            headerSubtitle: "text-text-light",
            formButtonPrimary:
              "bg-primary hover:bg-primary-dark text-black font-medium",
            formFieldInput:
              "bg-surface border border-border text-text focus:border-primary",
            formFieldLabel: "text-text-light",
            footerActionLink: "text-primary hover:text-primary-light",
            dividerLine: "bg-border",
            dividerText: "text-text-light",
            socialButtonsBlockButton:
              "bg-surface border border-border text-text hover:bg-surface-light",
            formFieldInputShowPasswordButton:
              "text-text-muted hover:text-primary",
          },
        }}
      />
    </div>
  );
};

export default Login;
