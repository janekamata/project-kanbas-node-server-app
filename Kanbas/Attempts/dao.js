import AttemptsModel from "./model.js";

/**
 * Retrieves all attempts for a specific quiz.
 * @param {string} quizId - The ID of the quiz.
 * @returns {Promise<Array>} - List of attempts for the quiz.
 */
export function findAttemptsForQuiz(quizId) {
  console.log("Finding attempts for quiz", quizId);
  return AttemptsModel.find({ quiz: quizId });
}

/**
 * Retrieves all attempts by a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} - List of attempts made by the user.
 */
export function findAttemptsByUser(userId) {
  return AttemptsModel.find({ user: userId });
}

/**
 * Retrieves an attempt by its ID.
 * @param {string} attemptId - The ID of the attempt.
 * @returns {Promise<Object>} - The attempt document.
 */
export function findAttemptById(attemptId) {
  return AttemptsModel.findById(attemptId);
}

/**
 * Creates a new attempt and saves it to the database.
 * @param {Object} attemptData - The attempt data.
 * @returns {Promise<Object>} - The newly created attempt.
 */
export function createAttempt(attemptData) {
  delete attemptData._id;
  return AttemptsModel.create(attemptData);
}

/**
 * Deletes an attempt by its ID.
 * @param {string} attemptId - The ID of the attempt to delete.
 * @returns {Promise<Object>} - Result of the delete operation.
 */
export function deleteAttempt(attemptId) {
  return AttemptsModel.deleteOne({ _id: attemptId });
}

/**
 * Updates an existing attempt with new data.
 * @param {string} attemptId - The ID of the attempt to update.
 * @param {Object} attemptUpdates - The updated attempt data.
 * @returns {Promise<Object>} - The result of the update operation.
 */
export function updateAttempt(attemptId, attemptUpdates) {
  return AttemptsModel.updateOne({ _id: attemptId }, { $set: attemptUpdates });
}

/**
 * Retrieves the number of attempts a user has made for a specific quiz.
 * @param {string} quizId - The ID of the quiz.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<number>} - The number of attempts.
 */
export async function getUserAttemptCount(quizId, userId) {
  return AttemptsModel.countDocuments({ quiz: quizId, user: userId });
}

/**
 * Retrieves the most recent attempt made by a user for a specific quiz.
 * @param {string} quizId - The ID of the quiz.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} - The most recent attempt document.
 */
export function findLatestAttempt(quizId, userId) {
  return AttemptsModel.findOne({ quiz: quizId, user: userId })
    .sort({ lastAttempt: -1 })
    .exec();
}

/**
 * Increments the score for a specific attempt.
 * @param {string} attemptId - The ID of the attempt.
 * @param {number} scoreIncrement - The amount to increment the score by.
 * @returns {Promise<Object>} - The updated attempt document.
 */
export function incrementAttemptScore(attemptId, scoreIncrement) {
  return AttemptsModel.findByIdAndUpdate(
    attemptId,
    { $inc: { score: scoreIncrement }, $set: { lastAttempt: Date.now() } },
    { new: true }
  );
}

/**
 * Retrieves all attempts.
 * @returns {Promise<Array>} - List of all attempts in the database.
 */
export function findAllAttempts() {
  return AttemptsModel.find();
}
