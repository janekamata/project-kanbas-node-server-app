import QuizModel from "./model.js";

/**
 * Retrieves all quizzes for a specific course.
 * @param {string} courseId - The ID of the course.
 * @returns {Promise<Array>} - List of quizzes belonging to the course.
 */
export function findQuizzesForCourse(courseId) {
  console.log('Finding quizzes for course', courseId);
  return QuizModel.find({ course: courseId });
}

/**
 * Creates a new quiz and saves it to the database.
 * @param {Object} quiz - The quiz data.
 * @returns {Promise<Object>} - The newly created quiz.
 */
export function createQuiz(quiz) {
  delete quiz._id;
  return QuizModel.create(quiz);
}

/**
 * Deletes a quiz by its ID.
 * @param {string} quizId - The ID of the quiz to delete.
 * @returns {Promise<Object>} - Result of the delete operation.
 */
export function deleteQuiz(quizId) {
  return QuizModel.deleteOne({ _id: quizId });
}

/**
 * Updates an existing quiz with new data.
 * @param {string} quizId - The ID of the quiz to update.
 * @param {Object} quizUpdates - The updated quiz data.
 * @returns {Promise<Object>} - The result of the update operation.
 */
export function updateQuiz(quizId, quizUpdates) {
  return QuizModel.updateOne({ _id: quizId }, { $set: quizUpdates });
}

/**
 * Retrieves all quizzes.
 * @returns {Promise<Array>} - List of all quizzes in the database.
 */
export function findAllQuizzes() {
  return QuizModel.find();
}

/**
 * Retrieves the number of attempts a user has made for a specific quiz.
 * @param {string} quizId - The ID of the quiz.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<number>} - The number of attempts.
 */
export async function getUserAttemptCount(quizId, userId) {
  const quiz = await QuizModel.findById(quizId).exec();
  if (!quiz) {
    throw new Error("Quiz not found");
  }
  const attemptRecord = quiz.attempts.find(
    (attempt) => attempt.user.toString() === userId
  );
  return attemptRecord ? attemptRecord.count : 0;
}

/**
 * Increments the attempt count for a user on a specific quiz.
 * @param {string} quizId - The ID of the quiz.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} - The updated quiz.
 */
export async function incrementUserAttempt(quizId, userId) {
  return QuizModel.findOneAndUpdate(
    { _id: quizId, "attempts.user": userId },
    { $inc: { "attempts.$.count": 1 } },
    { new: true }
  ).exec().then(async (updatedQuiz) => {
    if (!updatedQuiz) {
      // If the user hasn't attempted yet, add a new record
      return QuizModel.findByIdAndUpdate(
        quizId,
        { $push: { attempts: { user: userId, count: 1 } } },
        { new: true }
      ).exec();
    }
    return updatedQuiz;
  });
}
