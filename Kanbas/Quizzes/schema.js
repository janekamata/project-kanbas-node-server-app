import mongoose from "mongoose";

// Define the schema for choices within a question
const choiceSchema = new mongoose.Schema(
  {
    text: { type: String, required: true }, // Text for the choice
    isCorrect: { type: Boolean, default: false }, // Indicates if the choice is the correct one
  },
  { _id: false }
);

// Define the schema for each question
const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Question title (e.g., "Easy Question")
    type: {
      type: String,
      enum: ["Multiple Choice", "True/False", "Fill In the Blank"],
      required: true,
    }, // Question type
    points: { type: Number, default: 0 }, // Points assigned to the question
    question: { type: String, required: true }, // The actual question text
    choices: [choiceSchema], // Array of choices for the question
  },
  { _id: false }
);

// Define the Quiz schema
const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    description: { type: String },
    points: { type: Number },
    dueDate: { type: Date },
    availableFrom: { type: Date },
    availableUntil: { type: Date },
    timeLimit: { type: Number, default: 0 },
    quizType: { type: String, enum: ["Practice Quiz", "Graded Quiz", "Survey"], default: "Graded Quiz" },
    assignmentGroup: { type: String, default: "" },
    published: { type: Boolean, default: false },
    allowMultipleAttempts: { type: Boolean, default: false },
    assignTo: { type: String, default: "Everyone" },
    shuffleAnswers: { type: Boolean, default: false },
    lockQuestions: { type: Boolean, default: false },
    oneQuestionAtATime: { type: Boolean, default: false },
    showCorrectAnswers: { type: String, enum: ["Immediately", "After Submission", "Never"], default: "Immediately" },
    webcam: { type: Boolean, default: false },
    maxAttempts: { type: Number, default: 1 },
    accesscode: { type: String, default: "" },
    questions: [questionSchema], // Array of questions
    attempts: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        count: { type: Number, default: 0 },
      },
    ], // Tracking user attempts
  },
  { collection: "quizzes", timestamps: true }
);

export default quizSchema;
