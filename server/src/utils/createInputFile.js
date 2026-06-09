import fs from "fs";
import path from "path";

const createInputFile = async (
    jobId,
    input = ""
) => {

    const inputsDir = path.join(
        process.cwd(),
        "inputs"
    );

    if (!fs.existsSync(inputsDir)) {
        fs.mkdirSync(inputsDir, {
            recursive: true
        });
    }

    const inputFilePath = path.join(
        inputsDir,
        `${jobId}.txt`
    );

    fs.writeFileSync(
        inputFilePath,
        input || ""
    );

    return inputFilePath;
};

export default createInputFile;