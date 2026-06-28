import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execPromise = promisify(exec);

const executeCode = async (language, filePath, inputFilePath, jobId, timeLimit = 3000) => {
  let command;
  let executablePath = null;

  const sandboxDir = path.join(process.cwd(), "sandbox", jobId);

  switch (language) {
    case "cpp":
      executablePath = path.join(sandboxDir, "Main");

      command = `g++ "${filePath}" -o "${executablePath}" && "${executablePath}" < "${inputFilePath}"`;

      break;

    case "c":
      executablePath = path.join(sandboxDir, "Main");

      command = `gcc "${filePath}" -o "${executablePath}" && "${executablePath}" < "${inputFilePath}"`;

      break;

    case "python":
      command = `python3 "${filePath}" < "${inputFilePath}"`;

      break;

    case "javascript":
      command = `node "${filePath}" < "${inputFilePath}"`;

      break;

    case "java":
      command = `javac "${filePath}" && java -cp "${sandboxDir}" ${jobId} < "${inputFilePath}"`;

      break;

    default:
      throw new Error("Unsupported language");
  }

  try {
    const { stdout } = await execPromise(command, {
      timeout: timeLimit,
      cwd: sandboxDir,
    });

    return {
      verdict: "Success",
      output: stdout,
    };
  } catch (error) {
    if (error.killed) {
      return {
        verdict: "Time Limit Exceeded",
        output: null,
      };
    }

    const errorText = error.stderr || error.message;

    if (errorText.includes("error:")) {
      return {
        verdict: "Compilation Error",
        output: null,
      };
    }

    return {
      verdict: "Runtime Error",
      output: null,
    };
  } finally {
    try {
      if (sandboxDir && fs.existsSync(sandboxDir)) {
        fs.rmSync(sandboxDir, { recursive: true, force: true });
      }
    } catch (error) {
      console.error("Cleanup Error:", error.message);
    }
  }
};

export default executeCode;
