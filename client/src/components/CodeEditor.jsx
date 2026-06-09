import Editor from "@monaco-editor/react";

const languageMap = {
  cpp: "cpp",
  c: "c",
  java: "java",
  python: "python",
  javascript: "javascript",
};

function CodeEditor({ language, code, setData }) {
  return (
    <div className="editor-card">
      <Editor
        height="600px"
        language={languageMap[language]}
        value={code}
        theme="vs-dark"
        onChange={(value) =>
          setData((prev) => ({
            ...prev,
            code: value || "",
          }))
        }
      />
    </div>
  );
}

export default CodeEditor;
