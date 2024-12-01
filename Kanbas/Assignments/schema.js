import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    title: String,
    modules: String,
    points: Number,
    due_date: Date,
    available_date: Date,
    available_until_date: Date,
    description: String,
    course: { type: mongoose.Schema.Types.ObjectId, ref: "CourseModel" },
  },
  { collection: "assignments" }
);
export default schema;
