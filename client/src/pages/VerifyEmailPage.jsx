import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendVerificationOtp, verifyEmailOtp } from "../api/authApi";
import useAuth from "../hooks/useAuth";
import ErrorState from "../components/ErrorState";

function VerifyEmailPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [expiresIn, setExpiresIn] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCooldown((c) => (c > 0 ? c - 1 : 0));
      setExpiresIn((e) => (e > 0 ? e - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const sendOtp = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await sendVerificationOtp();
      setMessage(response.data.message);
      setDevOtp(response.data.devOtp || "");
      setCooldown(300);
      setExpiresIn(600); // 10 minutes expiry
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send OTP");
      setCooldown(err.response?.data?.retryAfterSeconds || 0);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      await verifyEmailOtp(otp);
      login({ ...user, emailVerified: true });
      setShowSuccessDialog(true);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <main className="page-container"><ErrorState message="Please login to verify your email." /></main>;
  }

  if (user.emailVerified || user.provider === "google") {
    return <main className="page-container"><div className="state-box">Your email is already verified.</div></main>;
  }

  return (
    <main className="page-container">
      <form className="form-container" onSubmit={verifyOtp}>
        <h1>Verify Email</h1>
        <p className="muted">Send an OTP to {user.email}, then enter it below.</p>
        
        <ErrorState message={error} />
        
        {message && <div className="state-box state-success">{message}</div>}
        {devOtp && <div className="state-box">Dev OTP: <strong>{devOtp}</strong></div>}
        
        {expiresIn > 0 && (
          <p className="muted" style={{ textAlign: "center", marginBottom: "8px", fontWeight: "500" }}>
            OTP Expires in: {Math.floor(expiresIn / 60)}:{(expiresIn % 60).toString().padStart(2, "0")}
          </p>
        )}

        <button type="button" className="btn-primary" onClick={sendOtp} disabled={loading || cooldown > 0}>
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Send OTP"}
        </button>
        
        <input
          className="form-input"
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
          placeholder="Enter OTP"
        />
        
        <button className="btn-primary" disabled={loading || !otp || expiresIn === 0}>
          Verify OTP
        </button>
      </form>

      {showSuccessDialog && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", 
          justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div className="form-container" style={{ margin: 0, maxWidth: "400px", padding: "32px" }}>
            <h2 style={{ textAlign: "center", marginBottom: "8px", fontSize: "22px" }}>🎉 Welcome to Online Judge</h2>
            <p style={{ textAlign: "center", marginBottom: "24px", color: "var(--text-secondary)" }}>
              Your email has been verified!
            </p>
            <div style={{ marginBottom: "32px", padding: "0 16px" }}>
              <h4 style={{ margin: "0 0 16px 0", color: "var(--text-primary)" }}>Features Accessible :</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px", color: "var(--text-secondary)" }}>
                <li>✅ AI Study Planner</li>
                <li>✅ AI Mock OA</li>
                <li>✅ Discussions</li>
              </ul>
            </div>
            <button className="btn-primary" onClick={() => navigate("/profile")}>
              Continue
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default VerifyEmailPage;
