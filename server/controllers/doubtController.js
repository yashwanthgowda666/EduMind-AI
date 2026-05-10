// ============================================
// controllers/doubtController.js - Doubt Controller (LINE-BY-LINE EXPLANATION)
// ============================================
// Handles all HTTP requests related to "doubts" (student questions or problems).
// If not used: The backend will not respond to any requests regarding doubts, and doubt-related routes will break.

// Each function below is mapped to a particular API endpoint by the router setup elsewhere in the code.
// If not used: The corresponding endpoint will not have any logic to run.

// Importing Groq AI client from config/gemini.js for making AI calls (used to answer doubts or analyze images)
// If not used: Groq-powered features (answering, extracting questions from images) will fail.
const { groq } = require("../config/gemini");

// Importing the MongoDB Mongoose model for "Doubt" - this handles DB reads/writes.
// If not used: No ability to save, fetch, update, or delete doubts from the database.
const Doubt = require("../models/Doubt");

// ============================================
// analyzeImage - Handles POST /api/doubts/analyze-image
// ============================================
// Receives an image upload; uses Groq Vision AI to extract a question from it; returns the question as JSON.
// If not used: Users cannot upload a photo of a question and get it converted to text.
const analyzeImage = async (req, res) => {
  try {
    // Check: Did the user send an image file with the request?
    // If not, return a 400 Bad Request (required, otherwise no image to analyze).
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    // Convert the image file buffer to base64. Groq Vision API needs a base64-encoded string.
    // If not used: The API call will fail—Groq expects base64 data.
    const base64Image = req.file.buffer.toString("base64");

    // Get the MIME type of the uploaded image (e.g., "image/png").
    // If not used: The API may not properly recognize the image type.
    const mimeType = req.file.mimetype;

    // Call Groq's vision model: Give it the image and ask for extraction of the question/problem.
    // The prompt tells Groq to: Look at image, extract question, return in specific JSON format.
    // If not used: No AI-powered question/image extraction can happen.
    const response = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
            {
              type: "text",
              // Instruct AI exactly what output format we want and what to look for.
              text: 'Analyze this image carefully. Extract the question, problem, or doubt shown in this image. Return ONLY a JSON object: {"question": "the extracted question", "subject": "detected subject like Math/Physics/Chemistry/Biology/History/etc", "hasEquation": true/false}. If no question is visible, set question to an empty string.',
            },
          ],
        },
      ],
      max_tokens: 500, // Limit the AI’s output length.
    });

    // Take just the raw text response from AI output.
    // If not used: Cannot proceed to parse the AI response.
    const text = response.choices[0].message.content;

    // Try to extract just the JSON part from the AI output (in case it sent extra text).
    // If not used: Code might break if AI returns text, or miss the intended JSON object.
    const jsonMatch = text.match(/\{[\s\S]*?\}/);

    // Default result used if parsing fails.
    // If not used: Code could break if nothing is parsed.
    let result = { question: "", subject: "General", hasEquation: false };

    // If a JSON structure was found in the response, try parsing it.
    // On parse failure, fallback to setting question as raw AI text.
    // If not used: Malformed responses might crash the server or give no result to the user.
    if (jsonMatch) {
      try {
        result = JSON.parse(jsonMatch[0]);
      } catch {
        result.question = text;
      }
    }

    // Send the extracted result plus the raw AI output back to client.
    // If not used: Client gets no response/data.
    res.json({ ...result, rawResponse: text });
  } catch (error) {
    // Handle and log any errors that occur in the above process.
    // If not used: Server errors crash the endpoint instead of returning a clear error to client.
    console.error("Image analysis error:", error);
    res.status(500).json({ error: "Failed to analyze image" });
  }
};

// ============================================
// askDoubt - Handles POST /api/doubts/ask
// ============================================
// Receives a question (and optionally, image or subject), asks Groq AI to answer it in detail, and saves the resulting Q&A to database.
// If not used: No main "ask a doubt/question" functionality—core of the system is gone.
const askDoubt = async (req, res) => {
  try {
    // Take question, subject, and optional image URL from client request.
    // If not used: Cannot get user's question from the request.
    const { question, subject, imageUrl } = req.body;

    // Check: User must actually provide a question (not blank).
    // If not used: Blank questions can break logic or confuse AI.
    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "A question is required" });
    }

    // Add a subject context string if a specific subject was provided and it's not "General".
    // If not used: The AI may not give a subject-specific answer.
    const subjectContext = subject && subject !== "General"
      ? `This question is from the subject: ${subject}.`
      : "";

    // Build the prompt to instruct AI:
    // Give the question, request a JSON response, give format.
    // If not used: AI may not give structured/formatted responses, making parsing impossible.
    const prompt = `You are an expert academic tutor. A student has the following doubt:

"${question}"

${subjectContext}

Please provide a thorough, student-friendly answer. Return ONLY valid JSON (no markdown) in this format:
{
  "answer": "Clear, direct answer to the question",
  "explanation": "Detailed step-by-step explanation or breakdown",
  "difficulty": "Easy | Medium | Hard",
  "tags": ["topic1", "topic2", "topic3"],
  "subject": "detected subject",
  "tips": ["helpful tip 1", "helpful tip 2"]
}`;

    // Ask Groq AI for its answer.
    // If not used: No AI answer generated; cannot proceed or store a response.
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500, // Limit output size (to avoid overlong answers).
    });

    // Get just the AI's message content.
    // If not used: Cannot extract the actual AI/generated answer.
    const text = response.choices[0].message.content;

    // Try to extract just the JSON object from AI response, avoiding any surrounding text.
    // If not used: Parsing fails if AI returns extra text.
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    // If AI didn't return a JSON object as per instructions, throw an error.
    // If not used: Unparseable results break downstream logic.
    if (!jsonMatch) {
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    // Parse the JSON (answer+explanation+tags etc.)
    // If not used: Data remains as unusable string, can't save or show to user.
    const aiResult = JSON.parse(jsonMatch[0]);

    // Create a new Doubt document (MongoDB) using the question and AI answer.
    // imageUrl is optional. Subject defaults to detected/param/"General".
    // If not used: The answered doubt won't be saved (users won't see a history, can't access later).
    const doubt = new Doubt({
      question,
      imageUrl: imageUrl || null,
      subject: aiResult.subject || subject || "General",
      answer: aiResult.answer,
      explanation: aiResult.explanation,
      difficulty: aiResult.difficulty || "Medium",
      tags: aiResult.tags || [],
    });

    // Save the question+answer object to the database.
    // If not used: Data is lost after reply, can't review history/follow-up.
    const saved = await doubt.save();

    // Return the saved doubt and any AI-provided tips back to the user.
    // If not used: The client will not receive confirmation, the new doubt, or extra tips.
    res.status(201).json({ doubt: saved, tips: aiResult.tips });
  } catch (error) {
    // Error handling - log and return 500 to client.
    // If not used: Unhandled errors crash the route/server.
    console.error("Ask doubt error:", error);
    res.status(500).json({ error: "Failed to process your doubt" });
  }
};

// ============================================
// askFollowUp - Handles POST /api/doubts/:id/followup
// ============================================
// Lets user ask a clarification/follow-up on a previous doubt, AI answers with context.
// If not used: No follow-up Q&A feature; users can't get clarifications.
const askFollowUp = async (req, res) => {
  try {
    // Get follow-up question from request body and doubt ID from URL params.
    // If not used: Can't know which doubt to follow up on, or what's being asked.
    const { question } = req.body;
    const doubtId = req.params.id;

    // Validate: must send a follow-up question (not blank).
    // If not used: Blank queries would confuse AI or break logic.
    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "A follow-up question is required" });
    }

    // Fetch the original doubt (for giving AI context).
    // If not used: AI won't know what the previous question+answer was, so can't answer usefully.
    const doubt = await Doubt.findById(doubtId);
    if (!doubt) {
      return res.status(404).json({ error: "Doubt not found" });
    }

    // Prompt the AI: Provide context of previous question and answer, then append follow-up query.
    // If not used: AI won't answer the follow-up in the right context and will give poor answers.
    const prompt = `You are an expert academic tutor. A student previously asked:

Original question: "${doubt.question}"
Your previous answer: "${doubt.answer}"

Now the student has a follow-up question:
"${question}"

Please provide a clear and concise answer to the follow-up. Return only plain text (no JSON).`;

    // Ask the AI for a follow-up answer.
    // If not used: No AI-powered clarification.
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800,
    });

    // Extract just the AI’s answer.
    // If not used: Cannot save/return the clarification.
    const followUpAnswer = response.choices[0].message.content;

    // Attach this follow-up Q&A to the original doubt's "followUps" array.
    // If not used: Follow-ups are not tracked or retained.
    doubt.followUps.push({ question, answer: followUpAnswer });
    await doubt.save();

    // Reply to the client with the saved follow-up data.
    // If not used: Client will get no indication that follow-up was successful.
    res.json({ question, answer: followUpAnswer });
  } catch (error) {
    // Error handling: logs and returns error.
    // If not used: Crashes or unclear errors.
    console.error("Follow-up error:", error);
    res.status(500).json({ error: "Failed to process follow-up question" });
  }
};

// ============================================
// getHistory - Handles GET /api/doubts/history
// ============================================
// Returns all user's past doubts, newest first. Supports filtering by subject/difficulty/search.
// If not used: Users can't view their question history or filter it.
const getHistory = async (req, res) => {
  try {
    // Read optional query filters from client: subject, difficulty, search text.
    // If not used: Can't filter/search user's doubt history.
    const { subject, difficulty, search } = req.query;

    // Set up a MongoDB filter object based on search criteria.
    // If not used: Always returns all doubts, no filtering.
    const filter = {};

    if (subject) filter.subject = subject;
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.question = { $regex: search, $options: "i" }; // case-insensitive search

    // Fetch all matching doubts from DB, most recent first.
    // If not used: Returns unordered or wrong doubts.
    const doubts = await Doubt.find(filter).sort({ createdAt: -1 });
    res.json(doubts);
  } catch (error) {
    // Log and reply with error if anything fails.
    // If not used: Server may crash/unhelpful response.
    console.error("Get history error:", error);
    res.status(500).json({ error: "Failed to fetch doubt history" });
  }
};

// ============================================
// getDoubtById - Handles GET /api/doubts/:id
// ============================================
// Fetch a single doubt by its MongoDB ID, including follow-ups.
// If not used: Users can't reopen past queries with full details.
const getDoubtById = async (req, res) => {
  try {
    // Find the doubt by its ID (from URL param).
    // If not used: Can't retrieve individual question's answer/explanation/etc.
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ error: "Doubt not found" });
    }
    res.json(doubt);
  } catch (error) {
    // If DB lookup fails or crashes, catch and reply.
    // If not used: Server crash/unhelpful errors.
    console.error("Get doubt error:", error);
    res.status(500).json({ error: "Failed to fetch doubt" });
  }
};

// ============================================
// markHelpful - Handles PATCH /api/doubts/:id/helpful
// ============================================
// Allows user to mark if AI's answer helped them—stored as Boolean on doubt.
// If not used: No feedback/ratings, can't measure answer usefulness.
const markHelpful = async (req, res) => {
  try {
    // Read helpful-ness value (Boolean) from client.
    // If not used: Always updates with blank/incorrect data.
    const { isHelpful } = req.body;

    // Validate isHelpful is actually a Boolean value.
    // If not used: Wrong types may get into database, cause bugs.
    if (typeof isHelpful !== "boolean") {
      return res.status(400).json({ error: "isHelpful must be true or false" });
    }

    // Update the specified doubt document with isHelpful value; return the new document.
    // If not used: Feedback isn't saved/visible in system.
    const doubt = await Doubt.findByIdAndUpdate(
      req.params.id,
      { isHelpful },
      { new: true }
    );

    // If no such doubt found, return error.
    // If not used: Trying to mark non-existent questions, unhelpful error messages.
    if (!doubt) {
      return res.status(404).json({ error: "Doubt not found" });
    }

    // Respond with confirmation and the updated doubt.
    // If not used: Client doesn't get confirmation or updated data.
    res.json({ message: "Feedback saved", doubt });
  } catch (error) {
    // Handle and report error.
    // If not used: Crashes or no error info.
    console.error("Mark helpful error:", error);
    res.status(500).json({ error: "Failed to update feedback" });
  }
};

// ============================================
// deleteDoubt - Handles DELETE /api/doubts/:id
// ============================================
// Removes a doubt from database permanently by ID.
// If not used: User cannot erase obsolete or mistaken questions.
const deleteDoubt = async (req, res) => {
  try {
    // Find and delete the specified doubt (by ID).
    // If not used: Doubts will only accumulate, cannot be erased, bad UX.
    const doubt = await Doubt.findByIdAndDelete(req.params.id);
    if (!doubt) {
      return res.status(404).json({ error: "Doubt not found" });
    }
    res.json({ message: "Doubt deleted successfully" });
  } catch (error) {
    // Handle errors in deletion process.
    // If not used: Operation may crash with no info to client.
    console.error("Delete doubt error:", error);
    res.status(500).json({ error: "Failed to delete doubt" });
  }
};

// ============================================
// Export all controller functions so they can be used by route definitions in the rest of the app.
// If not used: The router can't use these functions and HTTP requests will fail or go nowhere.
module.exports = {
  analyzeImage,
  askDoubt,
  askFollowUp,
  getHistory,
  getDoubtById,
  markHelpful,
  deleteDoubt,
};
