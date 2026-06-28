import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { generateMockOA } from "../api/aiApi";
import { getMockOAs } from "../api/mockOAApi";
import ErrorState from "../components/ErrorState";

function MockOAGeneratorPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ company: "", level: "Medium", duration: 90 });
  const [mockOAs, setMockOAs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadMockOAs = async () => {
    const response = await getMockOAs();
    setMockOAs(response.data.data);
  };

  useEffect(() => {
    loadMockOAs().catch(() => {});
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await generateMockOA(form);
      navigate(`/mock-oa/${response.data.data.oaId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to generate Mock OA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <h1 className="page-title">AI Mock OA</h1>
      <form className="inline-form" onSubmit={submit}>
        <select className="form-input" value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })}>
          <option value="">Generic OA</option>
          <option value="Google">Google-inspired</option>
          <option value="Amazon">Amazon-inspired</option>
          <option value="Microsoft">Microsoft-inspired</option>
          <option value="Meta">Meta-inspired</option>
        </select>
        <select className="form-input" value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <input className="form-input" type="number" min="30" max="240" value={form.duration} onChange={(event) => setForm({ ...form, duration: event.target.value })} />
        <button className="btn-primary" disabled={loading}>{loading ? "Generating..." : "Generate Mock OA"}</button>
      </form>
      <ErrorState message={error} />
      <section className="section-block">
        <h2>Your Mock OAs</h2>
        <div className="stack">
          {mockOAs.map((oa) => (
            <div className="list-card" key={oa._id}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <strong>{oa.company || "Generic OA"} · {oa.level}</strong>
                  <span className={`verdict-badge ${oa.status === 'Completed' ? 'badge-accepted' : 'badge-pending'}`} style={{ fontSize: "11px", padding: "2px 8px" }}>
                    {oa.status}
                  </span>
                </div>
                <p className="muted" style={{ margin: 0 }}>{oa.duration} minutes</p>
              </div>
              <Link className="edit-btn" to={`/mock-oa/${oa._id}`}>
                {oa.status === 'Completed' ? "View Results" : "Open"}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default MockOAGeneratorPage;
