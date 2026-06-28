function StudyPlannerDayCard({ day, onToggle }) {
  return (
    <div 
      className="list-card vertical"
      style={{ 
        opacity: day.completed ? 0.7 : 1, 
        border: day.completed ? "1px solid var(--success)" : undefined 
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ textDecoration: day.completed ? "line-through" : "none", margin: 0 }}>
          Day {day.day}: {day.focus}
        </h3>
        {onToggle && (
          <button 
            className="btn"
            style={{
              backgroundColor: day.completed ? "var(--success)" : "transparent",
              color: day.completed ? "white" : "var(--text-primary)",
              border: day.completed ? "1px solid var(--success)" : "1px solid var(--border-color)"
            }}
            onClick={onToggle}
          >
            {day.completed ? "Completed" : "Mark Complete"}
          </button>
        )}
      </div>
      <div className="tag-row" style={{ marginTop: "12px" }}>
        {day.problems?.map((problem, index) => (
          <div className="mini-card" key={`${problem.title}-${index}`}>
            <strong>{problem.title}</strong>
            <span className={`diff-badge diff-${problem.difficulty?.toLowerCase?.() || "easy"}`}>
              {problem.difficulty}
            </span>
            <p className="muted">{problem.tags?.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudyPlannerDayCard;
