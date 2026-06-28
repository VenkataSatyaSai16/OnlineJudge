import { Link } from "react-router-dom";
import { ArrowRight, Bot, Brain, Code2, MessageSquare } from "lucide-react";
import useAuth from "../hooks/useAuth";

function HomePage() {
  const { isAuthenticated, user } = useAuth();

  const actions = [
    {
      title: "Practice Problems",
      description: "Solve curated coding problems with the Monaco editor and judge feedback.",
      to: "/problems",
      icon: Code2,
    },
    {
      title: "Mock OA",
      description: "Generate and take company-inspired assessments in a timed environment.",
      to: "/mock-oa",
      icon: Bot,
    },
    {
      title: "Study Planner",
      description: "Build a structured AI roadmap for interview preparation.",
      to: "/study-planner",
      icon: Brain,
    },
    {
      title: "Discussions",
      description: "Ask questions, discuss approaches, and learn from others.",
      to: "/discussions",
      icon: MessageSquare,
    },
  ];

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Online Judge for focused interview practice.</h1>
          <p>
            Solve problems, take timed Mock OAs, plan your study path, and discuss solutions
            without leaving your coding workspace.
          </p>
          <div className="hero-actions">
            <Link className="hero-primary" to="/problems">
              Start Solving <ArrowRight size={18} />
            </Link>
            <Link className="hero-secondary" to={isAuthenticated ? "/mock-oa" : "/login"}>
              {isAuthenticated ? "Take Mock OA" : "Login to Continue"}
            </Link>
          </div>
          {isAuthenticated && <div className="hero-welcome">Welcome back, <strong>{user?.username}</strong>.</div>}
        </div>
      </section>

      <section className="quick-action-grid">
        {actions.map((action) => (
          <Link className="quick-action-card" to={action.to} key={action.title}>
            <div className="quick-action-icon">
              <action.icon size={22} />
            </div>
            <div>
              <h2>{action.title}</h2>
              <p>{action.description}</p>
            </div>
            <ArrowRight size={18} className="quick-action-arrow" />
          </Link>
        ))}
      </section>
    </main>
  );
}

export default HomePage;
