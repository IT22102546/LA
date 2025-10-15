import React, { useState } from "react";

// Step Indicator Component
const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                currentStep === step.number
                  ? "bg-indigo-600 text-white shadow-lg"
                  : currentStep > step.number
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
            >
              {step.number}
            </div>
            <span
              className={`font-medium text-sm ${
                currentStep >= step.number ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-20 h-0.5 ${
                currentStep > step.number ? "bg-indigo-600" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Step 1: Setup Component
const SetupStep = ({ formData, setFormData }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Create New Exam - Step 1 : Setup
      </h2>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Heading
          </label>
          <input
            type="text"
            placeholder="Enter Exam Title"
            value={formData.examHeading}
            onChange={(e) =>
              setFormData({ ...formData, examHeading: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Type
          </label>
          <select
            value={formData.examType}
            onChange={(e) =>
              setFormData({ ...formData, examType: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
          >
            <option value="">Select Exam Type</option>
            <option value="mcq">Multiple Choice</option>
            <option value="essay">Essay</option>
            <option value="mixed">Mixed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Schedule Grade
          </label>
          <select
            value={formData.grade}
            onChange={(e) =>
              setFormData({ ...formData, grade: e.target.value })
            }
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
          >
            <option value="">Select Grade</option>
            <option value="grade1">Grade 1</option>
            <option value="grade2">Grade 2</option>
            <option value="grade3">Grade 3</option>
            <option value="grade4">Grade 4</option>
            <option value="grade5">Grade 5</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructions
          </label>
          <textarea
            placeholder="Enter Exam Instruction For Students"
            value={formData.instructions}
            onChange={(e) =>
              setFormData({ ...formData, instructions: e.target.value })
            }
            rows="4"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm resize-none"
          />
        </div>
      </div>
    </div>
  );
};

// Question Component
const QuestionItem = ({ question, index, isActive, onClick, onDelete }) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
        isActive
          ? "bg-indigo-50 border-l-4 border-indigo-600"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-700">Q{index + 1}</span>
        <span className="text-sm text-gray-500">{question.marks} marks</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
        className="text-red-500 hover:text-red-700 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};

// Step 2: Question Component
const QuestionStep = ({ questions, setQuestions }) => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [activePart, setActivePart] = useState(1);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: [
          { text: "", image: null, isCorrect: false },
          { text: "", image: null, isCorrect: false },
          { text: "", image: null, isCorrect: false },
          { text: "", image: null, isCorrect: false },
        ],
        marks: 5,
        mcqType: "single",
      },
    ]);
    setActiveQuestion(questions.length);
  };

  const deleteQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    if (activeQuestion >= newQuestions.length && newQuestions.length > 0) {
      setActiveQuestion(newQuestions.length - 1);
    }
  };

  const updateQuestion = (field, value) => {
    const updated = [...questions];
    updated[activeQuestion] = { ...updated[activeQuestion], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (optionIndex, field, value) => {
    const updated = [...questions];
    updated[activeQuestion].options[optionIndex] = {
      ...updated[activeQuestion].options[optionIndex],
      [field]: value,
    };
    setQuestions(updated);
  };

  const addOption = () => {
    const updated = [...questions];
    updated[activeQuestion].options.push({
      text: "",
      image: null,
      isCorrect: false,
    });
    setQuestions(updated);
  };

  const currentQuestion = questions[activeQuestion];
  const optionLabels = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Part Tabs */}
      <div className="flex gap-2 p-6 pb-0">
        <button
          onClick={() => setActivePart(1)}
          className={`px-8 py-2.5 rounded-t-lg font-medium transition-all ${
            activePart === 1
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Part 01
        </button>
        <button
          onClick={() => setActivePart(2)}
          className={`px-8 py-2.5 rounded-t-lg font-medium transition-all ${
            activePart === 2
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Part 02
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 p-6">
        {/* Questions Sidebar */}
        <div className="col-span-2">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">
            Questions
          </h3>
          <div className="space-y-2">
            {questions.map((q, index) => (
              <QuestionItem
                key={index}
                question={q}
                index={index}
                isActive={activeQuestion === index}
                onClick={() => setActiveQuestion(index)}
                onDelete={deleteQuestion}
              />
            ))}
            <button
              onClick={addQuestion}
              className="w-full py-2 text-indigo-600 text-sm font-medium hover:bg-indigo-50 rounded-lg transition-colors"
            >
              + Add new Question
            </button>
          </div>
        </div>

        {/* Main Question Editor */}
        <div className="col-span-7 border-l border-r border-gray-200 px-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">
              Question {activeQuestion + 1}
            </h3>
            <select
              value={currentQuestion?.mcqType || "single"}
              onChange={(e) => updateQuestion("mcqType", e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="single">Mcq</option>
              <option value="multiple">Multiple Answer</option>
            </select>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text
              </label>
              <textarea
                placeholder="Enter Question"
                value={currentQuestion?.text || ""}
                onChange={(e) => updateQuestion("text", e.target.value)}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              />
              <button className="mt-2 flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Add an image
              </button>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion?.options.map((option, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type={
                        currentQuestion.mcqType === "multiple"
                          ? "checkbox"
                          : "radio"
                      }
                      name={`question-${activeQuestion}`}
                      checked={option.isCorrect}
                      onChange={(e) =>
                        updateOption(idx, "isCorrect", e.target.checked)
                      }
                      className="mt-1 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700 text-sm">
                          Option {optionLabels[idx]}
                        </span>
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Enter Answers"
                        value={option.text}
                        onChange={(e) =>
                          updateOption(idx, "text", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                      <div className="flex items-center gap-4 mt-2">
                        <button className="flex items-center gap-2 text-xs text-gray-500 hover:text-indigo-600 transition-colors">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Add an image
                        </button>
                        <label className="flex items-center gap-2 text-xs text-gray-600">
                          <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) =>
                              updateOption(idx, "isCorrect", e.target.checked)
                            }
                            className="w-3.5 h-3.5 text-indigo-600 rounded focus:ring-indigo-500"
                          />
                          Correct Answer
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addOption}
              className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors"
            >
              + Add Option
            </button>
          </div>
        </div>

        {/* Settings Sidebar */}
        <div className="col-span-3">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm">
            Questions Settings
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marks
            </label>
            <input
              type="number"
              value={currentQuestion?.marks || 0}
              onChange={(e) =>
                updateQuestion("marks", parseInt(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 3: Review Component
const ReviewStep = ({ formData, questions }) => {
  const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 0), 0);

  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Review & Submit</h2>

      <div className="space-y-6">
        {/* Exam Details Card */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Exam Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Exam Title:</span>
              <p className="font-medium text-gray-900 mt-1">
                {formData.examHeading || "Not set"}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Exam Type:</span>
              <p className="font-medium text-gray-900 mt-1">
                {formData.examType || "Not set"}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Grade:</span>
              <p className="font-medium text-gray-900 mt-1">
                {formData.grade || "Not set"}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Total Questions:</span>
              <p className="font-medium text-gray-900 mt-1">
                {questions.length}
              </p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Total Marks:</span>
              <p className="font-medium text-gray-900 mt-1">{totalMarks}</p>
            </div>
          </div>
        </div>

        {/* Questions Summary */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            Questions Summary
          </h3>
          <div className="space-y-3">
            {questions.map((q, index) => (
              <div
                key={index}
                className="border-l-4 border-indigo-600 bg-indigo-50 p-4 rounded"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      Question {index + 1}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {q.text || "No question text"}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {q.options.length} options • {q.marks} marks
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        {formData.instructions && (
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
            <p className="text-sm text-gray-600">{formData.instructions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
function DashExams() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    examHeading: "",
    examType: "",
    grade: "",
    instructions: "",
  });
  const [questions, setQuestions] = useState([
    {
      text: "",
      options: [
        { text: "", image: null, isCorrect: false },
        { text: "", image: null, isCorrect: false },
        { text: "", image: null, isCorrect: false },
        { text: "", image: null, isCorrect: false },
      ],
      marks: 5,
      mcqType: "single",
    },
  ]);

  const steps = [
    { number: 1, label: "Setup" },
    { number: 2, label: "Question" },
    { number: 3, label: "Review & Submit" },
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit logic
      console.log("Submitting exam:", { formData, questions });
      alert("Exam created successfully!");
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All changes will be lost.")) {
      setCurrentStep(1);
      setFormData({
        examHeading: "",
        examType: "",
        grade: "",
        instructions: "",
      });
      setQuestions([
        {
          text: "",
          options: [
            { text: "", image: null, isCorrect: false },
            { text: "", image: null, isCorrect: false },
            { text: "", image: null, isCorrect: false },
            { text: "", image: null, isCorrect: false },
          ],
          marks: 5,
          mcqType: "single",
        },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Exam Creation & Launch
          </h1>
          <p className="text-sm text-gray-600 mt-1">Create Exam</p>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Step Content */}
        <div className="mb-6">
          {currentStep === 1 && (
            <SetupStep formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 2 && (
            <QuestionStep questions={questions} setQuestions={setQuestions} />
          )}
          {currentStep === 3 && (
            <ReviewStep formData={formData} questions={questions} />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
          >
            {currentStep === 3 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashExams;
