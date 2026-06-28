import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function EmailVerificationBanner() {
  const { user } = useAuth();

  if (!user || user.provider === "google" || user.emailVerified) {
    return null;
  }

  return (
    <div className="email-verification-banner">
      <span>Verify your email to unlock submissions, AI features and discussions.</span>
      <Link to="/verify-email">Verify Email</Link>
    </div>
  );
}

export default EmailVerificationBanner;
