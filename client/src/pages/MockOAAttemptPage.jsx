import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import MockOAQuestionCard from "../components/MockOAQuestionCard";
import QuestionNavigator from "../components/QuestionNavigator";
import Timer from "../components/Timer";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";
import { getMockOAById, getMockOAProblems, startMockOA, submitMockOA } from "../api/mockOAApi";
import { runCode, submitCode } from "../api/judgeApi";
import useResizableSplit from "../hooks/useResizableSplit";
import VerdictCard from "../components/VerdictCard";

const TEMPLATES = {
  cpp: "#include<iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}",
  python: "def main():\n    pass\n\nif __name__ == \"__main__\":\n    main()\n",
  java: "public class Main {\n    public static void main(String[] args) {\n    }\n}",
  c: "#include<stdio.h>\n\nint main() {\n    return 0;\n}",
  javascript: "function main() {\n}\n\nmain();\n",
};

function MockOAAttemptPage() {
  const { oaId } = useParams();
  const navigate = useNavigate();
  const [oa, setOa] = useState(null);
  const [problems, setProblems] = useState([]);
  const [index, setIndex] = useState(0);
  const [solutions, setSolutions] = useState({});
  const [problemStatuses, setProblemStatuses] = useState({});
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");
  const [passedTestCases, setPassedTestCases] = useState(0);
  const [totalTestCases, setTotalTestCases] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [runStatus, setRunStatus] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(false);
  const [finishStatus, setFinishStatus] = useState(false);
  const { leftPercent, startResize } = useResizableSplit(50, 'horizontal');
  const { percent: topPercent, startResize: startVerticalResize } = useResizableSplit(60, 'vertical');

  useEffect(() => {
    async function load() {
      try {
        const started = await startMockOA(oaId);
        const [oaResponse, problemsResponse] = await Promise.all([
          getMockOAById(oaId),
          getMockOAProblems(oaId),
        ]);
        setOa(oaResponse.data.data.startedAt ? oaResponse.data.data : started.data.data);
        setProblems(problemsResponse.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load Mock OA");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [oaId]);

  const current = problems[index];
  const code = solutions[current?._id] || TEMPLATES[language];

  // Custom Input prefill on question change
  useEffect(() => {
    if (current && !input) {
      if (current.examples?.length > 0) {
        setInput(current.examples[0].input);
      }
      setOutput("");
      setVerdict("");
      setPassedTestCases(0);
      setTotalTestCases(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, current]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    if (code !== TEMPLATES[language]) {
      const shouldChange = window.confirm("Changing language will replace your current code. Continue?");
      if (!shouldChange) return;
    }
    setLanguage(newLang);
    setSolutions((prev) => ({ ...prev, [current._id]: TEMPLATES[newLang] }));
  };

  const setCode = (value) => {
    setSolutions((prev) => ({ ...prev, [current._id]: value }));
  };

  const run = async () => {
    try {
      setRunStatus(true);
      const response = await runCode({ language, code, input });
      setOutput(response.data.output || response.data.error || "");
      setVerdict(response.data.verdict);
      setPassedTestCases(0);
      setTotalTestCases(0);
      
      // Run is just testing custom input, we don't update question navigator status for it unless it's a runtime error
      if (response.data.verdict !== "Success") {
        setProblemStatuses((prev) => {
          if (prev[current._id] === 'accepted' || prev[current._id] === 'partial') return prev;
          return { ...prev, [current._id]: 'rejected' };
        });
      }
    } catch (err) {
      console.error(err);
      setOutput(err.response?.data?.message || "Error running code");
      setVerdict("Error");
      setProblemStatuses((prev) => {
        if (prev[current._id] === 'accepted' || prev[current._id] === 'partial') return prev;
        return { ...prev, [current._id]: 'rejected' };
      });
    } finally {
      setRunStatus(false);
    }
  };

  const submitCurrent = async () => {
    try {
      setSubmitStatus(true);
      const response = await submitCode({ problemId: current._id, language, code, oaId });
      setVerdict(response.data.verdict);
      setPassedTestCases(response.data.passedTestCases || 0);
      setTotalTestCases(response.data.totalTestCases || 0);
      
      let status = "rejected";
      if (response.data.verdict === "Accepted") {
        status = "accepted";
      } else if (response.data.passedTestCases > 0) {
        status = "partial";
      }
      setProblemStatuses((prev) => ({ ...prev, [current._id]: status }));
    } catch (err) {
      console.error(err);
      setVerdict("Submit Failed");
      setProblemStatuses((prev) => ({ ...prev, [current._id]: "rejected" }));
    } finally {
      setSubmitStatus(false);
    }
  };

  const finish = async () => {
    try {
      setFinishStatus(true);
      await submitMockOA(oaId);
      navigate(`/mock-oa/${oaId}/result`);
    } catch (err) {
      console.error(err);
    } finally {
      setFinishStatus(false);
    }
  };

  if (loading) return <main className="page-container"><LoadingState /></main>;

  const isPending = runStatus || submitStatus || finishStatus;

  return (
    <main className="mock-layout">
      <ErrorState message={error} />
      <div className="mock-header">
        <QuestionNavigator questions={problems} currentIndex={index} onSelect={setIndex} statuses={problemStatuses} />
        {oa?.expiresAt && <Timer expiresAt={oa.expiresAt} onExpire={finish} />}
        <button className="btn btn-submit" onClick={finish} disabled={isPending}>
          {finishStatus ? "Submitting..." : "Submit OA"}
        </button>
      </div>
      <div className="problem-layout resizable-layout">
        <div className="resizable-pane" style={{ flexBasis: `${leftPercent}%` }}>
          <MockOAQuestionCard problem={current} />
        </div>
        
        <div className="splitter" onMouseDown={startResize} role="separator" aria-label="Resize panels" />
        
        <div className="editor-section resizable-pane" style={{ flexBasis: `${100 - leftPercent}%` }}>
          <div style={{ flexBasis: `${topPercent}%`, minHeight: 0, display: "flex", flexDirection: "column" }}>
            <div className="editor-toolbar">
              <select className="language-select" value={language} onChange={handleLanguageChange}>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
            <CodeEditor language={language} code={code} onCodeChange={setCode} />
          </div>
          
          <div className="splitter-horizontal" onMouseDown={startVerticalResize} role="separator" aria-label="Resize vertical panels" />

          <div style={{ flexBasis: `${100 - topPercent}%`, minHeight: 0, display: "flex", flexDirection: "column" }}>
            <VerdictCard
              input={input}
              output={output}
              verdict={verdict}
              passedTestCases={passedTestCases}
              totalTestCases={totalTestCases}
              runStatus={runStatus}
              submitStatus={submitStatus}
              hasSubmitted={false}
              error={error}
              handleInputChange={(e) => setInput(e.target.value)}
              run={run}
              submit={submitCurrent}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default MockOAAttemptPage;
