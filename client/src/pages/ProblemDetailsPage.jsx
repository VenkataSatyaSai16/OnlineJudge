import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblemById } from "../api/problemApi";
import { runCode, submitCode } from "../api/judgeApi";
import ProblemCard from "../components/ProblemCard";
import CodeEditor from "../components/CodeEditor";
import VerdictCard from "../components/VerdictCard";

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
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");
  const [data, setData] = useState({
    language: "cpp",
    code: CODE_TEMPLATES.cpp,
    input: "",
  });

  useEffect(() => {
    async function fetchProblem() {
      try {
        setLoading(true);
        const response = await getProblemById(id);
        setProblem(response.data.Question);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [id]);

  const run = async () => {
    try {
      setRunStatus(true);
      const response = await runCode(data);
      setOutput(response.data.output);
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
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitStatus(false);
    }
  };

  const handleLanguageChange = (e) => {
    const language = e.target.value;

    const shouldChange = window.confirm(
      "Changing language will replace your current code. Continue?",
    );

    if (!shouldChange) return;

    setData((prev) => ({
      ...prev,
      language,
      code: CODE_TEMPLATES[language],
    }));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="problem-layout">
      <ProblemCard problem={problem} />

      <div className="editor-section">
        <select
          className="language-select"
          value={data.language}
          onChange={handleLanguageChange}
        >
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>
        <CodeEditor
          language={data.language}
          code={data.code}
          setData={setData}
        />

        <VerdictCard
          input={data.input}
          output={output}
          verdict={verdict}
          runStatus={runStatus}
          submitStatus={submitStatus}
          handleInputChange={(e) =>
            setData((prev) => ({
              ...prev,

              input: e.target.value,
            }))
          }
          run={run}
          submit={submit}
        />
      </div>
    </div>
  );
}

export default ProblemDetailsPage;
