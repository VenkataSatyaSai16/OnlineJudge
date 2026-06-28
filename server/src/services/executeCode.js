import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execPromise = promisify(exec);

const executeCode = async (language, filePath, inputFilePath, jobId, timeLimit = 3000) => {
  const sandboxDir = path.join(process.cwd(), "sandbox", jobId);

  let compileCommand = null;
  let executeCommand = null;
  let executablePath = null;
  
  // For Windows, append .exe if needed (though g++ does it automatically, we need to check for it)
  const isWindows = process.platform === "win32";

  switch (language) {
    case "cpp":
      executablePath = path.join(sandboxDir, "Main");
      if (isWindows) executablePath += ".exe";
      compileCommand = `g++ "${filePath}" -o "${executablePath}"`;
      executeCommand = `"${executablePath}" < "${inputFilePath}"`;
      break;

    case "c":
      executablePath = path.join(sandboxDir, "Main");
      if (isWindows) executablePath += ".exe";
      compileCommand = `gcc "${filePath}" -o "${executablePath}"`;
      executeCommand = `"${executablePath}" < "${inputFilePath}"`;
      break;

    case "python":
      executeCommand = `python3 "${filePath}" < "${inputFilePath}"`;
      // Fallback for Windows
      if (isWindows) executeCommand = `python "${filePath}" < "${inputFilePath}"`;
      break;

    case "javascript":
      executeCommand = `node "${filePath}" < "${inputFilePath}"`;
      break;

    case "java":
      compileCommand = `javac "${filePath}"`;
      executeCommand = `java -cp "${sandboxDir}" ${jobId} < "${inputFilePath}"`;
      executablePath = path.join(sandboxDir, `${jobId}.class`);
      break;

    default:
      throw new Error("Unsupported language");
  }

  try {
    // 1. Compile step (if needed)
    if (compileCommand) {
      const shouldCompile = !executablePath || !fs.existsSync(executablePath);
      if (shouldCompile) {
        try {
          await execPromise(compileCommand, { timeout: 10000, cwd: sandboxDir });
        } catch (compileError) {
          return {
            verdict: "Compilation Error",
            output: null,
          };
        }
      }
    }

    // 2. Verify executable/compiled file exists
    if (executablePath) {
      if (!fs.existsSync(executablePath)) {
        return {
          verdict: "Compilation Error",
          output: null,
        };
      }
    }

    // 3. Execution step
    const { stdout } = await execPromise(executeCommand, {
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

    return {
      verdict: "Runtime Error",
      output: null,
    };
  }
};

export default executeCode;
