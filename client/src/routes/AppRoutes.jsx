import { Routes, Route } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import ProblemPage from "../pages/ProblemsPage";
import ProblemDetailsPage from "../pages/ProblemDetailsPage";
import AddProblemPage from "../pages/AddProblemPage";
import EditProblemPage from "../pages/EditProblemPage";
import ProfilePage from "../pages/ProfilePage";
import LeaderboardPage from "../pages/LeaderboardPage";
import AuthCallbackPage from "../pages/AuthCallbackPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import DiscussionsPage from "../pages/DiscussionsPage";
import DiscussionDetailsPage from "../pages/DiscussionDetailsPage";
import StudyPlannerPage from "../pages/StudyPlannerPage";
import MockOAGeneratorPage from "../pages/MockOAGeneratorPage";
import MockOADetailsPage from "../pages/MockOADetailsPage";
import MockOAAttemptPage from "../pages/MockOAAttemptPage";
import MockOAResultPage from "../pages/MockOAResultPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/problems" element={<ProblemPage/>} />
      <Route path="/problems/:id" element={<ProblemDetailsPage/>} />
      <Route path="/problems/add" element={<AddProblemPage/>}/>
      <Route path="/problems/:id/edit" element={<EditProblemPage/>} />
      <Route path="/profile" element={<ProfilePage/>} />
      <Route path="/leaderboard" element={ <LeaderboardPage/>} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/discussions" element={<DiscussionsPage />} />
      <Route path="/discussions/:id" element={<DiscussionDetailsPage />} />
      <Route path="/study-planner" element={<StudyPlannerPage />} />
      <Route path="/mock-oa" element={<MockOAGeneratorPage />} />
      <Route path="/mock-oa/:oaId" element={<MockOADetailsPage />} />
      <Route path="/mock-oa/:oaId/attempt" element={<MockOAAttemptPage />} />
      <Route path="/mock-oa/:oaId/result" element={<MockOAResultPage />} />
    </Routes>
  );
}

export default AppRoutes;
