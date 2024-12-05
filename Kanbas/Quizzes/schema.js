// schema.js

import mongoose from "mongoose";

// Define a schema for tracking user attempts
const attemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    count: { type: Number, default: 0 },
  },
  { _id: false }
);

const choiceSchema = new mongoose.Schema({
  correct: { type: Boolean, default: false },
  answer: { type: String },
});

const questionSchema = new mongoose.Schema({
  title: { type: String },
  type: { type: String, default: "Multiple Choice" },
  points: { type: Number, default: 0 },
  question: { type: String, required: true },
  choices: [choiceSchema],
});

// Define the Quiz schema
const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    description: { type: String },
    points: { type: Number },
    dueDate: { type: Date },
    published: { type: Boolean, default: false },
    allowMultipleAttempts: { type: Boolean, default: false },
    assignTo: { type: String, default: "Everyone" },
    assignmentGroup: { type: String, default: "Quizzes" },
    quizType: { type: String, default: "Graded Quiz" },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    availableFrom: { type: Date },
    availableUntil: { type: Date },
    attempts: [attemptSchema],
    questions: [questionSchema],
    accessCode: { type: String },
    lockQuestions: { type: Boolean, default: false },
    oneQuestionAtATime: { type: Boolean, default: true },
    showCorrectAnswers: { type: String, default: "Immediately" },
    webcam: { type: Boolean, default: false },
    maxAttempts: { type: Number, default: 1 },
  },
  { collection: "quizzes" }
);

export default quizSchema;
