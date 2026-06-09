import { exec } from "child_process";
import { promisify } from "util";
import path from "path";

const execPromise =
    promisify(exec);

const executeCode = async (
    language,
    filePath,
    inputFilePath,
    jobId
) => {

    let command;

    const codesDir = path.join(
        process.cwd(),
        "codes"
    );

    switch (language) {

        case "cpp":

            command =
                `g++ "${filePath}" -o "${codesDir}\\${jobId}.exe" && "${codesDir}\\${jobId}.exe" < "${inputFilePath}"`;

            break;

        case "c":

            command =
                `gcc "${filePath}" -o "${codesDir}\\${jobId}.exe" && "${codesDir}\\${jobId}.exe" < "${inputFilePath}"`;

            break;

        case "python":

            command =
                `python "${filePath}" < "${inputFilePath}"`;

            break;

        case "javascript":

            command =
                `node "${filePath}" < "${inputFilePath}"`;

            break;

        default:

            throw new Error(
                "Unsupported language"
            );
    }

    const {
        stdout,
        stderr
    } = await execPromise(
        command
    );

    if (stderr) {
        throw new Error(stderr);
    }

    return stdout;
};

export default executeCode;