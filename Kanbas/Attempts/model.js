import mongoose from "mongoose";
import attemptsSchema from "./schema.js";

const AttemptsModel = mongoose.model("AttemptsModel", attemptsSchema);
export default AttemptsModel;
