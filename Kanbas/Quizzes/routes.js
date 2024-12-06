// routes.js

import mongoose from "mongoose";
import * as quizzesDao from "./dao.js";

/**
 * Defines all quiz-related routes.
 * @param {Object} app - The Express application instance.
 */
export default function QuizRoutes(app) {
  /**
   * GET /api/courses/:cid/quizzes
   * Retrieves all quizzes for a specific course.
   */
  app.get("/api/courses/:cid/quizzes", async (req, res) => {
    const { cid } = req.params;

    // Validate course ID
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: `Invalid course ID: ${cid}` });
    }

    try {
      const quizzes = await quizzesDao.findQuizzesForCourse(cid);
      console.log("Quizzes:", quizzes);
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  /**
   * POST /api/courses/:cid/quizzes
   * Creates a new quiz for a specific course.
   */
  app.post("/api/courses/:cid/quizzes", async (req, res) => {
    const { cid } = req.params;

    // Validate course ID
    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: `Invalid course ID: ${cid}` });
    }

    const newQuizData = {
      ...req.body,
      course: cid, // Associates the quiz with the course ID from the URL
    };

    try {
      const newQuiz = await quizzesDao.createQuiz(newQuizData);
      res.status(201).json(newQuiz); // 201 Created
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  /**
   * DELETE /api/quizzes/:qid
   * Deletes a quiz by its ID.
   */
  app.delete("/api/courses/:cid/quizzes/:qid", async (req, res) => {
    const { qid } = req.params;

    // Validate quiz ID
    if (!mongoose.Types.ObjectId.isValid(qid)) {
      return res.status(400).json({ error: `Invalid quiz ID: ${qid}` });
    }

    try {
      await quizzesDao.deleteQuiz(qid);
      res.sendStatus(204); // 204 No Content
    } catch (error) {
      console.error("Error deleting quiz:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  /**
   * PUT /api/quizzes/:qid
   * Updates an existing quiz by its ID.
   */
  app.put("/api/courses/:cid/quizzes/:qid", async (req, res) => {
    const { qid } = req.params;

    // Validate quiz ID
    if (!mongoose.Types.ObjectId.isValid(qid)) {
      return res.status(400).json({ error: `Invalid quiz ID: ${qid}` });
    }

    const quizUpdates = req.body;

    try {
      const updatedQuiz = await quizzesDao.updateQuiz(qid, quizUpdates);

      if (updatedQuiz) {
        res.sendStatus(204); // 204 No Content
      } else {
        res.status(404).json({ message: "Quiz not found" });
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  /**
   * POST /api/quizzes/:qid/attempt
   * Records a new attempt for the authenticated user on a specific quiz.
   */
  app.post("/api/courses/:cid/quizzes/:qid/attempt", async (req, res) => {
    const { qid } = req.params;
    const userId = req.user && req.user.id; // Assumes user is authenticated and user info is in req.user

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    // Validate quiz ID
    if (!mongoose.Types.ObjectId.isValid(qid)) {
      return res.status(400).json({ error: `Invalid quiz ID: ${qid}` });
    }

    try {
      const updatedQuiz = await quizzesDao.incrementUserAttempt(qid, userId);
      res.status(200).json({
        message: "Attempt recorded successfully",
        quizId: qid,
        userId: userId,
        updatedQuiz: updatedQuiz,
      });
    } catch (error) {
      console.error("Error recording attempt:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  /**
   * GET /api/quizzes/:qid/attempts
   * Retrieves the number of attempts the authenticated user has made on a specific quiz.
   */
  app.get("/api/courses/:cid/quizzes/:qid/attempts", async (req, res) => {
    const { qid } = req.params;
    const userId = req.user && req.user.id; // Assumes user is authenticated and user info is in req.user

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    // Validate quiz ID
    if (!mongoose.Types.ObjectId.isValid(qid)) {
      return res.status(400).json({ error: `Invalid quiz ID: ${qid}` });
    }

    try {
      const attemptCount = await quizzesDao.getUserAttemptCount(qid, userId);
      res.status(200).json({
        quizId: qid,
        userId: userId,
        attemptCount: attemptCount,
      });
    } catch (error) {
      console.error("Error retrieving attempt count:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.put("/api/courses/:cid/quizzes/:qid/publish", async (req, res) => {
    const {qid} = req.params;
    try {
      await quizzesDao.publish(qid);
      res.status(200);
    } catch (error) {
      console.error("Error publishing quiz:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.put("/api/courses/:cid/quizzes/:qid/unpublish", async (req, res) => {
    const {qid} = req.params;
    try {
      await quizzesDao.unpublish(qid);
      res.status(200);
    } catch (error) {
      console.error("Error publishing quiz:", error);
      res.status(500).send("Internal Server Error");
    }
  });
}
