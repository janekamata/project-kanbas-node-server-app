import mongoose from "mongoose";
import * as quizzesDao from "./dao.js";

export default function QuizRoutes(app) {
  /**
   * GET /api/courses/:cid/quizzes
   * Retrieves all quizzes for a specific course.
   */
  app.get("/api/courses/:cid/quizzes", async (req, res) => {
    const { cid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: `Invalid course ID: ${cid}` });
    }

    try {
      const quizzes = await quizzesDao.findQuizzesForCourse(cid);
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

    if (!mongoose.Types.ObjectId.isValid(cid)) {
      return res.status(400).json({ error: `Invalid course ID: ${cid}` });
    }

    const { title, description, points, dueDate, availableFrom, availableUntil, timeLimit, questions } = req.body;

    const newQuizData = {
      title,
      description,
      points,
      dueDate,
      availableFrom,
      availableUntil,
      timeLimit,
      course: cid,
      questions, // Array of question objects
    };

    try {
      const newQuiz = await quizzesDao.createQuiz(newQuizData);
      res.status(201).json(newQuiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  /**
   * PUT /api/quizzes/:qid
   * Updates an existing quiz by its ID.
   */
  app.put("/api/quizzes/:qid", async (req, res) => {
    const { qid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(qid)) {
      return res.status(400).json({ error: `Invalid quiz ID: ${qid}` });
    }

    const updatedData = req.body;

    try {
      const updatedQuiz = await quizzesDao.updateQuiz(qid, updatedData);

      if (updatedQuiz) {
        res.status(200).json(updatedQuiz);
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
  app.post("/api/quizzes/:qid/attempt", async (req, res) => {
    const { qid } = req.params;
    const userId = req.user && req.user.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(qid)) {
      return res.status(400).json({ error: `Invalid quiz ID: ${qid}` });
    }

    try {
      const updatedQuiz = await quizzesDao.incrementUserAttempt(qid, userId);
      res.status(200).json({
        message: "Attempt recorded successfully",
        updatedQuiz,
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
  app.get("/api/quizzes/:qid/attempts", async (req, res) => {
    const { qid } = req.params;
    const userId = req.user && req.user.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(qid)) {
      return res.status(400).json({ error: `Invalid quiz ID: ${qid}` });
    }

    try {
      const attemptCount = await quizzesDao.getUserAttemptCount(qid, userId);
      res.status(200).json({
        attemptCount,
      });
    } catch (error) {
      console.error("Error retrieving attempt count:", error);
      res.status(500).send("Internal Server Error");
    }
  });
}
