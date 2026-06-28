import fs from "fs";
import path from "path";

const createInputFile = async (
    jobId,
    input = ""
) => {

    const sandboxDir = path.join(
        process.cwd(),
        "sandbox",
        jobId
    );

    if (!fs.existsSync(sandboxDir)) {
        fs.mkdirSync(sandboxDir, {
            recursive: true
        });
    }

    const inputFilePath = path.join(
        sandboxDir,
        "input.txt"
    );

    fs.writeFileSync(
        inputFilePath,
        input || ""
    );

    return inputFilePath;
};

export default createInputFile;