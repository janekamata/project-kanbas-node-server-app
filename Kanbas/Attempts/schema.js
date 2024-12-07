// schema.js

import mongoose from "mongoose";

// Define a schema for choices within questions
const choiceSchema = new mongoose.Schema({
  correct: { type: Boolean, default: false },
  answer: { type: String },
});

// Define a schema for quiz questions
const questionSchema = new mongoose.Schema({
  title: { type: String },
  type: { type: String, default: "Multiple Choice" },
  points: { type: Number, default: 0 },
  question: { type: String, required: true },
  choices: [choiceSchema],
});

// Define a schema for attempts
const attemptSchemas = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    questions: [
      {
        question: { type: String },
        answer: { type: String },
        correct: { type: Boolean },
        currentAnswer: { type: String },
      },
    ],
    score: { type: Number, default: 0 },
    lastAttempt: { type: Date, default: Date.now },
  },
  { collection: "attempts" }
);

export default attemptSchemas;
