import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblemById } from "../api/problemApi";
import { runCode, submitCode } from "../api/judgeApi";
import { aiReview } from "../api/aiApi";
import ProblemCard from "../components/ProblemCard";
import CodeEditor from "../components/CodeEditor";
import VerdictCard from "../components/VerdictCard";
import useResizableSplit from "../hooks/useResizableSplit";
import AIReviewModal from "../components/AIReviewModal";

const CODE_TEMPLATES = {
  cpp: `#include<iostream>
using namespace std;

int main() {

    return 0;
}`,

  c: `#include<stdio.h>

int main() {

    return 0;
}`,

  java: `public class Main {

    public static void main(String[] args) {

    }
}`,

  python: `def main():
    pass

if __name__ == "__main__":
    main()
`,

  javascript: `function main() {

}

main();
`,
};

function ProblemDetailsPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [runStatus, setRunStatus] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(false);
  const [reviewStatus, setReviewStatus] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");
  const [passedTestCases, setPassedTestCases] = useState(0);
  const [totalTestCases, setTotalTestCases] = useState(0);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    language: "cpp",
    code: CODE_TEMPLATES.cpp,
    input: "",
  });
  const { leftPercent, startResize } = useResizableSplit(50, 'horizontal');
  const { percent: topPercent, startResize: startVerticalResize } = useResizableSplit(60, 'vertical');

  useEffect(() => {
    async function fetchProblem() {
      try {
        setLoading(true);
        const response = await getProblemById(id);
        const fetchedProblem = response.data.Question;
        setProblem(fetchedProblem);

        // Load saved state
        const savedState = localStorage.getItem(`oj_editor_${id}`);
        let initialData = { language: "cpp", code: CODE_TEMPLATES.cpp, input: "" };

        if (savedState) {
          try {
            initialData = JSON.parse(savedState);
          } catch (e) {
            console.error("Invalid saved state", e);
          }
        }

        // Prefill custom input if empty
        if (!initialData.input && fetchedProblem?.examples?.length > 0) {
          initialData.input = fetchedProblem.examples[0].input;
        }

        setData(initialData);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [id]);

  useEffect(() => {
    if (problem) {
      localStorage.setItem(`oj_editor_${id}`, JSON.stringify(data));
    }
  }, [data, id, problem]);

  const run = async () => {
    try {
      setRunStatus(true);
      const response = await runCode(data);

      setOutput(response.data.output);
      setVerdict(response.data.verdict);
      setPassedTestCases(0);
      setTotalTestCases(0);
      setError(response.data.error);
    } catch (error) {
      console.error(error);
    } finally {
      setRunStatus(false);
    }
  };

  const submit = async () => {
    try {
      setSubmitStatus(true);
      const response = await submitCode({
        problemId: id,
        language: data.language,
        code: data.code,
      });

      setVerdict(response.data.verdict);
      setPassedTestCases(response.data.passedTestCases || 0);
      setTotalTestCases(response.data.totalTestCases || 0);
      setHasSubmitted(true);
    } catch (error) {
      if (error.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        setError(error.response.data.message);
        setVerdict("Email Verification Required");
        return;
      }
      console.error(error);
    } finally {
      setSubmitStatus(false);
    }
  };

  const review = async () => {
    try {
      setReviewStatus(true);
      const response = await aiReview({
        code: data.code,
      });

      const reviewResponse = response.data.response;
      setReviewResult(reviewResponse);
    } catch (error) {
      if (error.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        setError(error.response.data.message);
        return;
      }
      setError(error.response?.data?.message || "AI review failed. Please try again.");
    } finally {
      setReviewStatus(false);
    }
  };

  const handleLanguageChange = (e) => {
    const language = e.target.value;
    
    // Only prompt if code is not the default template
    if (data.code !== CODE_TEMPLATES[data.language]) {
      const shouldChange = window.confirm(
        "Changing language will replace your current code. Continue?",
      );
      if (!shouldChange) return;
    }

    // Try to load saved language specific code, if implemented in future, but for now we reset to template
    setData((prev) => ({
      ...prev,
      language,
      code: CODE_TEMPLATES[language],
    }));

    setPassedTestCases(0);
    setTotalTestCases(0);
    setVerdict("");
  };

  const handleCodeChange = (newCode) => {
    setData((prev) => ({
      ...prev,
      code: newCode,
    }));

    setHasSubmitted(false);
    setReviewResult(null);
  };

  if (loading) return <div className="page-container"><p>Loading problem...</p></div>;
  if (!problem) return null;

  return (
    <div className="problem-container">
      <AIReviewModal reviewResult={reviewResult} onClose={() => setReviewResult(null)} />
      <div className="problem-layout resizable-layout">
        <div className="resizable-pane" style={{ flexBasis: `${leftPercent}%` }}>
          <ProblemCard problem={problem} />
        </div>

        <div className="splitter" onMouseDown={startResize} role="separator" aria-label="Resize panels" />

        <div className="editor-section resizable-pane" style={{ flexBasis: `${100 - leftPercent}%` }}>
          <div style={{ flexBasis: `${topPercent}%`, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <div className="editor-toolbar">
            <select className="language-select" value={data.language} onChange={handleLanguageChange}>
              <option value="cpp">C++</option>
              <option value="c">C</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
          <CodeEditor language={data.language} code={data.code} onCodeChange={handleCodeChange} />
        </div>

        <div className="splitter-horizontal" onMouseDown={startVerticalResize} role="separator" aria-label="Resize vertical panels" />

        <div style={{ flexBasis: `${100 - topPercent}%`, minHeight: 0, display: "flex", flexDirection: "column" }}>
          <VerdictCard
            input={data.input}
            output={output}
            verdict={verdict}
            passedTestCases={passedTestCases}
            totalTestCases={totalTestCases}
            runStatus={runStatus}
            submitStatus={submitStatus}
            reviewStatus={reviewStatus}
            hasSubmitted={hasSubmitted}
            reviewResult={reviewResult}
            error={error}
            handleInputChange={(e) =>
              setData((prev) => ({
                ...prev,
                input: e.target.value,
              }))
            }
            run={run}
            submit={submit}
            review={review}
          />
        </div>
      </div>
    </div>
    </div>
  );
}

export default ProblemDetailsPage;
