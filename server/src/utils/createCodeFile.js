import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const createCodeFile = async (language, code) => {
  if (!code) {
    throw new Error("Code is required");
  }

  const languageExtension = {
    cpp: "cpp",
    c: "c",
    python: "py",
    javascript: "js",
    java: "java",
  };

  const extension = languageExtension[language];

  if (!extension) {
    throw new Error("Unsupported language");
  }

  const uuid = uuidv4();

  let jobId = uuid;
  let fileName = `${uuid}.${extension}`;
  let finalCode = code;

  if (language === "java") {
    // Java-safe class name
    const javaClassName = `Main_${uuid.replace(/-/g, "_")}`;

    finalCode = code.replace(
      /public\s+class\s+\w+/,
      `public class ${javaClassName}`
    );

    jobId = javaClassName;
    fileName = `${javaClassName}.java`;
  }

  const sandboxDir = path.join(process.cwd(), "sandbox", jobId);

  if (!fs.existsSync(sandboxDir)) {
    fs.mkdirSync(sandboxDir, {
      recursive: true,
    });
  }

  const filePath = path.join(sandboxDir, fileName);

  fs.writeFileSync(filePath, finalCode);

  return {
    jobId,
    filePath,
  };
};

export default createCodeFile;