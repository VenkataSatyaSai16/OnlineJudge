function QuestionNavigator({ questions, currentIndex, onSelect, statuses = {} }) {
  return (
    <div className="question-nav">
      {questions.map((question, index) => {
        let className = "";
        if (index === currentIndex) {
          className = "active";
        } else if (statuses[question._id] === "submitted") {
          className = "submitted";
        } else if (statuses[question._id] === "test-passed") {
          className = "test-passed";
        } else if (statuses[question._id] === "test-failed") {
          className = "test-failed";
        }

        return (
          <button
            key={question._id}
            className={className}
            onClick={() => onSelect(index)}
          >
            Q{index + 1}
          </button>
        );
      })}
    </div>
  );
}

export default QuestionNavigator;
