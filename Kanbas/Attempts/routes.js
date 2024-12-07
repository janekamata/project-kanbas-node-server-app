import mongoose from "mongoose";
import * as attemptsDao from "./dao.js";

/**
 * Defines all attempt-related routes.
 * @param {Object} app - The Express application instance.
 */
export default function AttemptRoutes(app) {
  /**
   * GET /api/attempts/:aid
   * Retrieves an attempt by its ID.
   */
  app.get("/api/attempts/:aid", async (req, res) => {
    const { aid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(aid)) {
      return res.status(400).json({ error: `Invalid attempt ID: ${aid}` });
    }

    try {
      const attempt = await attemptsDao.findAttemptById(aid);
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      res.json(attempt);
    } catch (error) {
      console.error("Error fetching attempt:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  /**
   * POST /api/quizzes/:qid/attempts
   * Creates a new attempt for a quiz.
   */
  app.post("/api/quizzes/:qid/attempts", async (req, res) => {
    const { qid } = req.params;
    const { questions, score } = req.body;
    const currentUser = req.session["currentUser"];
    const userId = currentUser && currentUser._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(qid)) {
      return res.status(400).json({ error: `Invalid quiz ID: ${qid}` });
    }

    const attemptData = {
      quiz: qid,
      user: userId,
      questions,
      score,
    };

    try {
      const newAttempt = await attemptsDao.createAttempt(attemptData);
      res.status(201).json(newAttempt);
    } catch (error) {
      console.error("Error creating attempt:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  /**
   * GET /api/quizzes/:qid/attempts
   * Retrieves all attempts for a specific quiz.
   */
  app.get("/api/quizzes/:qid/attempts", async (req, res) => {
    const { qid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(qid)) {
      return res.status(400).json({ error: `Invalid quiz ID: ${qid}` });
    }

    try {
      const attempts = await attemptsDao.findAttemptsForQuiz(qid);
      res.json(attempts);
    } catch (error) {
      console.error("Error fetching attempts:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  /**
   * GET /api/users/:uid/attempts
   * Retrieves all attempts made by a specific user.
   */
  app.get("/api/users/:uid/attempts", async (req, res) => {
    const { uid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(uid)) {
      return res.status(400).json({ error: `Invalid user ID: ${uid}` });
    }

    try {
      const attempts = await attemptsDao.findAttemptsByUser(uid);
      res.json(attempts);
    } catch (error) {
      console.error("Error fetching attempts:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  /**
   * PUT /api/attempts/:aid
   * Updates an existing attempt.
   */
  app.put("/api/attempts/:aid", async (req, res) => {
    const { aid } = req.params;
    const attemptUpdates = req.body;

    if (!mongoose.Types.ObjectId.isValid(aid)) {
      return res.status(400).json({ error: `Invalid attempt ID: ${aid}` });
    }

    try {
      const updatedAttempt = await attemptsDao.updateAttempt(aid, attemptUpdates);

      if (!updatedAttempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }

      res.sendStatus(204);
    } catch (error) {
      console.error("Error updating attempt:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  /**
   * DELETE /api/attempts/:aid
   * Deletes an attempt by its ID.
   */
  app.delete("/api/attempts/:aid", async (req, res) => {
    const { aid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(aid)) {
      return res.status(400).json({ error: `Invalid attempt ID: ${aid}` });
    }

    try {
      await attemptsDao.deleteAttempt(aid);
      res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting attempt:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  /**
   * GET /api/quizzes/:qid/attempts/latest
   * Retrieves the most recent attempt made by the authenticated user on a specific quiz.
   */
  app.get("/api/quizzes/:qid/attempts/latest", async (req, res) => {
    const { qid } = req.params;
    const currentUser = req.session["currentUser"];
    const userId = currentUser && currentUser._id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(qid)) {
      return res.status(400).json({ error: `Invalid quiz ID: ${qid}` });
    }

    try {
      const latestAttempt = await attemptsDao.findLatestAttempt(qid, userId);
      if (!latestAttempt) {
        return res.status(404).json({ message: "No attempts found for the user." });
      }
      res.json(latestAttempt);
    } catch (error) {
      console.error("Error fetching latest attempt:", error);
      res.status(500).send("Internal Server Error");
    }
  });
}
