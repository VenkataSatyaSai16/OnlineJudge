import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import EmailVerificationBanner from "./components/EmailVerificationBanner";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <EmailVerificationBanner />
      <AppRoutes />
    </>
  );
}

export default App;
