import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import braggyLogo from "../../assets/braggy-logo.png";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky-navbar">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <img
                src={braggyLogo}
                alt="Braggy Logo"
                className="w-8 h-8 rounded-lg shadow-lg"
              />
              <span className="text-xl font-bold text-text">Braggy</span>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-2 text-text-light hover:text-primary transition-colors"
            >
              <FaArrowLeft className="text-sm" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card">
          <h1 className="text-4xl font-bold text-text mb-8">Privacy Policy</h1>

          <div className="space-y-8 text-text-light leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-text mb-4">
                1. Information We Collect
              </h2>
              <p className="mb-4">
                Braggy (the “Company”, “we” or “us”) collects information you
                provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account information (name, email address)</li>
                <li>Notes and content you create</li>
                <li>Usage data and preferences</li>
                <li>Device and browser information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text mb-4">
                2. How We Use Your Information
              </h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and maintain our services</li>
                <li>Process your notes and content</li>
                <li>Send you important updates and notifications</li>
                <li>Improve our application and user experience</li>
                <li>Ensure security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text mb-4">
                3. Data Security
              </h2>
              <p>
                We implement industry-standard security measures to protect your
                data:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                <li>End-to-end encryption for all data transmission</li>
                <li>Secure authentication through Clerk</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and user isolation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text mb-4">
                4. Data Storage and Location
              </h2>
              <p>
                Your data is stored securely in MongoDB Atlas cloud database. We
                use Clerk for authentication, which provides enterprise-grade
                security for user management and authentication.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text mb-4">
                5. Third-Party Services
              </h2>
              <p className="mb-4">We use the following third-party services:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Clerk:</strong> For user authentication and management
                </li>
                <li>
                  <strong>MongoDB Atlas:</strong> For secure data storage
                </li>
                <li>
                  <strong>Vercel:</strong> For application hosting
                </li>
              </ul>
              <p className="mt-4">
                These services have their own privacy policies and security
                measures in place to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text mb-4">
                6. Your Rights
              </h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Update or correct your information</li>
                <li>Delete your account and data</li>
                <li>Export your notes and content</li>
                <li>Opt out of communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text mb-4">
                7. Data Retention
              </h2>
              <p>
                We retain your data for as long as your account is active. When
                you delete your account, we will permanently delete all your
                data within 30 days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text mb-4">
                8. Children's Privacy
              </h2>
              <p>
                BragJournl is not intended for children under 13 years of age.
                We do not knowingly collect personal information from children
                under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text mb-4">
                9. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last Updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-text mb-4">
                10. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at:
              </p>
              <div className="mt-4 p-4 bg-surface-light rounded-lg">
                <p className="text-text">Email: privacy@braggy.com</p>
              </div>
            </section>

            <div className="border-t border-border pt-8 mt-8">
              <p className="text-text-muted text-sm">
                <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
