const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Firestore
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// API endpoint for retrieving active questions
app.get('/api/questions', async (req, res) => {
  try {
    const questionsSnapshot = await db.collection('questions').where('status', '==', 'active').get();
    const questions = questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: 'Failed to retrieve questions' });
  }
});

// API endpoint for submitting a prayer
app.post('/api/prayers', async (req, res) => {
  const { userId, prayerContent, prayerRequest, location } = req.body;

  if (!userId || !prayerContent || !prayerRequest || !location) {
    return res.status(400).json({ message: 'Missing required prayer data' });
  }

  const prayerData = {
    userId,
    prayerContent,
    prayerRequest,
    location,
    prayerTime: admin.firestore.Timestamp.now(),
  };

  try {
    await db.collection('prayers').add(prayerData);
    res.json({ message: 'Prayer submitted successfully' });
  } catch (error) {
    console.error("Error submitting prayer:", error);
    res.status(500).json({ message: 'Failed to submit prayer' });
  }
});

// API endpoint for adding a question
app.post('/api/questions', async (req, res) => {
  const { questionText, status = 'active' } = req.body;

  if (!questionText) {
    return res.status(400).json({ message: 'Question text is required' });
  }

  const questionData = { questionText, status };

  try {
    const newQuestion = await db.collection('questions').add(questionData);
    const savedQuestion = { id: newQuestion.id, ...questionData };
    res.json(savedQuestion);
  } catch (error) {
    console.error("Error adding question:", error);
    res.status(500).json({ message: 'Failed to add question' });
  }
});

// API endpoint for deleting a question
app.delete('/api/questions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await db.collection('questions').doc(id).delete();
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({ message: 'Failed to delete question' });
  }
});

// API endpoint to get all submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const submissionsSnapshot = await db.collection('submissions').get();
    const submissions = submissionsSnapshot.docs.map(doc => {
      const data = doc.data();

      // Ensure 'answers' is an array before calling .map
      if (!Array.isArray(data.answers)) {
        return {
          id: doc.id,
          userId: data.userId,
          location: data.location,
          answers: [],  // Empty array if answers is not valid
          submissionTime: data.submissionTime ? data.submissionTime.toDate() : null
        };
      }

      return {
        id: doc.id,
        userId: data.userId,
        location: data.location,
        answers: data.answers.map(answer => ({
          questionText: answer.questionText,
          answerText: answer.answerText
        })),
        submissionTime: data.submissionTime ? data.submissionTime.toDate() : null // Convert Firestore timestamp to JS Date
      };
    });
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Error fetching submissions' });
  }
});


// API endpoint to post a new submission
app.post('/api/submissions', async (req, res) => {
  const { userId, answers, location } = req.body;

  if (!userId || !answers || !location) {
    console.error('Missing required submission data');
    return res.status(400).json({ message: 'Missing required submission data' });
  }

  const submissionData = {
    userId,
    answers, // Contains both questionText and answerText
    location,
    submissionTime: admin.firestore.Timestamp.now(),
  };

  try {
    const newSubmission = await db.collection('submissions').add(submissionData);
    res.json({ id: newSubmission.id, ...submissionData });
  } catch (error) {
    console.error('Error adding submission:', error);
    res.status(500).json({ message: 'Failed to add submission' });
  }
});

// API endpoint for deleting a submission
app.delete('/api/submissions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const submissionRef = db.collection('submissions').doc(id);
    const doc = await submissionRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    await submissionRef.delete();
    res.json({ message: 'Submission deleted successfully' });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ message: 'Failed to delete submission' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
