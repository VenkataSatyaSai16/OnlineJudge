import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { editProblem, getProblemById } from "../api/problemApi";

function EditProblemPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "",
    inputFormat: "",
    outputFormat: "",
    constraints: "",
    tags: [],
    examples: [
      {
        input: "",
        output: "",
      },
    ],
    testCases: [
      {
        input: "",
        output: "",
      },
    ],
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getProblemById(id);

        const question = response.data.Question;

        setFormData({
          title: question.title || "",
          description: question.description || "",
          difficulty: question.difficulty || "",
          inputFormat: question.inputFormat || "",
          outputFormat: question.outputFormat || "",
          constraints: question.constraints || "",

          tags: question.tags || [],

          examples: question.examples?.length
            ? question.examples
            : [{ input: "", output: "" }],

          testCases: question.testCases?.length
            ? question.testCases
            : [{ input: "", output: "" }],
        });
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [id]);

  if (!user || user.role !== "admin") {
    return <h2>Access Denied</h2>;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTagsChange = (e) => {
    setFormData({
      ...formData,
      tags: e.target.value.split(",").map((tag) => tag.trim()),
    });
  };

  const handleExampleChange = (index, field, value) => {
    const updatedExamples = [...formData.examples];
    updatedExamples[index][field] = value;
    setFormData({
      ...formData,
      examples: updatedExamples,
    });
  };

  const addExample = () => {
    setFormData({
      ...formData,
      examples: [
        ...formData.examples,
        {
          input: "",
          output: "",
        },
      ],
    });
  };

  const removeExample = (index) => {
    if (formData.examples.length === 1) return;
    const updatedExamples = formData.examples.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      examples: updatedExamples,
    });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index][field] = value;
    setFormData({
      ...formData,
      testCases: updatedTestCases,
    });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [
        ...formData.testCases,
        {
          input: "",
          output: "",
        },
      ],
    });
  };

  const removeTestCase = (index) => {
    if (formData.testCases.length === 1) return;
    const updatedTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      testCases: updatedTestCases,
    });
  };
  const editQuestion = async () => {
    try {
      const response = await editProblem(id, formData);
      alert(response.data.message);
      navigate("/problems");
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Update Failed");
    }
  };
  return (
    <div className="add-problem-container">
      <div className="form-header">
        <h1>Edit Problem</h1>
        <button type="button" className="submit-btn" onClick={editQuestion}>
          Save Changes
        </button>
      </div>

      <div className="problem-form-grid">
        <div className="left-panel">
          {/* Basic Details */}

          <div className="form-card">
            <h2>Basic Details</h2>

            <input
              type="text"
              name="title"
              placeholder="Problem Title"
              value={formData.title}
              onChange={handleChange}
            />

            <textarea
              rows="10"
              name="description"
              placeholder="Problem Description"
              value={formData.description}
              onChange={handleChange}
            />

            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option value="">Select Difficulty</option>

              <option value="Easy">Easy</option>

              <option value="Medium">Medium</option>

              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-card">
            <h2>Formats</h2>

            <textarea
              rows="4"
              name="inputFormat"
              placeholder="Input Format"
              value={formData.inputFormat}
              onChange={handleChange}
            />

            <textarea
              rows="4"
              name="outputFormat"
              placeholder="Output Format"
              value={formData.outputFormat}
              onChange={handleChange}
            />

            <textarea
              rows="4"
              name="constraints"
              placeholder="Constraints"
              value={formData.constraints}
              onChange={handleChange}
            />

            <input
              type="text"
              placeholder="Tags"
              value={formData.tags?.join(", ")}
              onChange={handleTagsChange}
            />
          </div>
        </div>

        <div className="right-panel">
          {/* Examples */}

          <div className="form-card">
            <div className="section-header">
              <h2>Examples</h2>

              <button type="button" className="add-btn" onClick={addExample}>
                + Add Example
              </button>
            </div>

            {formData.examples.map((example, index) => (
              <div className="example-card" key={index}>
                <h4>Example {index + 1}</h4>

                <textarea
                  rows="3"
                  placeholder="Input"
                  value={example.input}
                  onChange={(e) =>
                    handleExampleChange(index, "input", e.target.value)
                  }
                />

                <textarea
                  rows="3"
                  placeholder="Output"
                  value={example.output}
                  onChange={(e) =>
                    handleExampleChange(index, "output", e.target.value)
                  }
                />

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeExample(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Test Cases */}

          <div className="form-card">
            <div className="section-header">
              <h2>Test Cases</h2>

              <button type="button" className="add-btn" onClick={addTestCase}>
                + Add Test Case
              </button>
            </div>

            {formData.testCases.map((testCase, index) => (
              <div className="testcase-card" key={index}>
                <h4>Test Case {index + 1}</h4>

                <textarea
                  rows="3"
                  placeholder="Input"
                  value={testCase.input}
                  onChange={(e) =>
                    handleTestCaseChange(index, "input", e.target.value)
                  }
                />

                <textarea
                  rows="3"
                  placeholder="Expected Output"
                  value={testCase.output}
                  onChange={(e) =>
                    handleTestCaseChange(index, "output", e.target.value)
                  }
                />

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => removeTestCase(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProblemPage;
