import { useState, useEffect } from "react";
import { generateStudyPlan } from "../api/aiApi";
import { getStudyPlans, saveStudyPlan, toggleDayCompletion, deleteStudyPlan } from "../api/studyPlanApi";
import StudyPlannerDayCard from "../components/StudyPlannerDayCard";
import ErrorState from "../components/ErrorState";
import { Trash2 } from "lucide-react";

function StudyPlannerPage() {
  const [form, setForm] = useState({ goal: "", hoursPerDay: "", duration: "" });
  const [plans, setPlans] = useState([]);
  const [activePlanId, setActivePlanId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadPlans() {
      try {
        const res = await getStudyPlans();
        setPlans(res.data);
        if (res.data.length > 0) {
          setActivePlanId(res.data[0]._id);
        }
      } catch (err) {
        console.error("Failed to load study plans", err);
      }
    }
    loadPlans();
  }, []);

  const plan = plans.find(p => p._id === activePlanId);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await generateStudyPlan(form);
      
      const savedRes = await saveStudyPlan({
        goal: form.goal,
        hoursPerDay: Number(form.hoursPerDay),
        duration: form.duration,
        weeks: response.data.data.weeks,
      });

      setPlans([savedRes.data, ...plans]);
      setActivePlanId(savedRes.data._id);
      setCurrentPage(1);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to generate study plan");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompletion = async (weekIndex, dayIndex, currentStatus) => {
    if (!activePlanId) return;
    try {
      const newPlans = [...plans];
      const planIndex = newPlans.findIndex(p => p._id === activePlanId);
      if (planIndex === -1) return;
      
      const updatedPlan = { ...newPlans[planIndex] };
      updatedPlan.weeks[weekIndex].days[dayIndex].completed = !currentStatus;
      newPlans[planIndex] = updatedPlan;
      setPlans(newPlans);

      await toggleDayCompletion(activePlanId, weekIndex, dayIndex, !currentStatus);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm("Are you sure you want to delete this study plan?")) return;
    try {
      await deleteStudyPlan(id);
      const remaining = plans.filter((p) => p._id !== id);
      setPlans(remaining);
      if (activePlanId === id) {
        setActivePlanId(remaining.length > 0 ? remaining[0]._id : null);
        setCurrentPage(1);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete study plan");
    }
  };

  return (
    <main className="page-container">
      <h1 className="page-title">AI Study Planner</h1>
      <form className="inline-form" onSubmit={submit}>
        <label className="field-label">
          <span>Goal</span>
          <input className="form-input" placeholder="Example: Crack FAANG DSA interviews" value={form.goal} onChange={(event) => setForm({ ...form, goal: event.target.value })} />
        </label>
        <label className="field-label">
          <span>Hours per day</span>
          <input className="form-input" type="number" min="1" max="12" placeholder="Example: 2" value={form.hoursPerDay} onChange={(event) => setForm({ ...form, hoursPerDay: event.target.value })} />
        </label>
        <label className="field-label">
          <span>Duration</span>
          <input className="form-input" placeholder="Example: 4 weeks" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} />
        </label>
        <button className="btn-primary" disabled={loading}>{loading ? "Generating..." : "Generate Plan"}</button>
      </form>
      <ErrorState message={error} />
      
      {plans.length > 0 && (
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", margin: "20px 0", paddingBottom: "8px" }}>
          {plans.map((p) => (
            <div key={p._id} style={{ display: "flex", alignItems: "center" }}>
              <button 
                className={`btn ${activePlanId === p._id ? "btn-primary" : "btn-outline"}`}
                onClick={() => { setActivePlanId(p._id); setCurrentPage(1); }}
                style={{ whiteSpace: "nowrap", borderTopRightRadius: "0", borderBottomRightRadius: "0" }}
              >
                {p.goal}
              </button>
              <button 
                className="btn btn-outline delete-btn" 
                style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0", padding: "8px", borderLeft: "none" }}
                onClick={() => handleDeletePlan(p._id)}
                title="Delete Plan"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {plan && plan.weeks && plan.weeks.length > 0 && (
        <>
          <section className="section-block" key={plan.weeks[currentPage - 1].week}>
            <h2>Week {plan.weeks[currentPage - 1].week}</h2>
            <div className="stack">
              {plan.weeks[currentPage - 1].days.map((day, dIndex) => (
                <StudyPlannerDayCard 
                  day={day} 
                  key={day.day} 
                  onToggle={() => handleToggleCompletion(currentPage - 1, dIndex, day.completed)}
                />
              ))}
            </div>
          </section>

          <div className="pagination">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </button>
            
            {plan.weeks.map((_, index) => (
              <button
                key={index}
                className={currentPage === index + 1 ? "active" : ""}
                style={{ 
                  backgroundColor: currentPage === index + 1 ? "var(--primary-color)" : "",
                  color: currentPage === index + 1 ? "white" : "",
                  borderColor: currentPage === index + 1 ? "var(--primary-color)" : ""
                }}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}

            <button 
              disabled={currentPage === plan.weeks.length} 
              onClick={() => setCurrentPage(prev => Math.min(plan.weeks.length, prev + 1))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default StudyPlannerPage;
