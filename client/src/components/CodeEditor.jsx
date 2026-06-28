import Editor from "@monaco-editor/react";
import useTheme from "../hooks/useTheme";

const languageMap = {
  cpp: "cpp",
  c: "c",
  java: "java",
  python: "python",
  javascript: "javascript",
};

function CodeEditor({ language, code, onCodeChange }) {
  const { resolvedTheme } = useTheme();

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('oj-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#161b22',
      },
    });
    monaco.editor.defineTheme('oj-light', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#161b22',
      },
    });
  };

  return (
    <div className="editor-card" style={{borderTopLeftRadius: 0, borderTopRightRadius: 0, borderTop: "none"}}>
      <Editor
        beforeMount={handleEditorWillMount}
        height="100%"
        language={languageMap[language]}
        value={code}
        theme={resolvedTheme === "dark" ? "oj-dark" : "oj-light"}
        onChange={(value) => {
          onCodeChange(value);
        }}
      />
    </div>
  );
}

export default CodeEditor;
