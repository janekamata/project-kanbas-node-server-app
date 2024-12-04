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

// Define the Quiz schema
const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    description: { type: String },
    points: { type: Number },
    dueDate: { type: Date },
    availableFromDate: { type: Date },
    availableUntilDate: { type: Date },
    attempts: [attemptSchema],
  },
  { collection: "quizzes" }
);

export default quizSchema;
