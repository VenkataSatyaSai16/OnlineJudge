import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const createCodeFile = async (
    language,
    code
) => {

    if (!code) {
        throw new Error("Code is required");
    }

    const codesDir = path.join(
        process.cwd(),
        "codes"
    );

    if (!fs.existsSync(codesDir)) {
        fs.mkdirSync(codesDir, {
            recursive: true
        });
    }

    const extensions = {
        cpp: "cpp",
        c: "c",
        python: "py",
        javascript: "js"
    };

    const extension =
        extensions[language];

    if (!extension) {
        throw new Error(
            "Unsupported language"
        );
    }

    const jobId = uuidv4();

    const filePath = path.join(
        codesDir,
        `${jobId}.${extension}`
    );

    fs.writeFileSync(
        filePath,
        code
    );

    return {
        jobId,
        filePath
    };
};

export default createCodeFile;