
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Contact = require("./models/Contact");
const Progress = require("./models/Progress");
const Note = require("./models/Note");

const app = express();

app.use(express.json());
app.use(express.static("public"));

// 1. Save contact
app.post("/submit-contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Please fill all contact fields."
      });
    }

    await Contact.create({ name, email, message });

    res.status(201).json({
      message: "Contact saved successfully!"
    });
  } catch (error) {
    res.status(500).json({ message: "Could not save contact." });
  }
});

// Get all contacts
app.get("/contacts", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submissionDate: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Could not load contacts." });
  }
});

// 2. Save student progress
app.post("/progress", async (req, res) => {
  try {
    const { studentName, courseName, completionPercentage } = req.body;
    const percentage = Number(completionPercentage);

    if (
      !studentName ||
      !courseName ||
      completionPercentage === "" ||
      completionPercentage === undefined ||
      !Number.isFinite(percentage) ||
      percentage < 0 ||
      percentage > 100
    ) {
      return res.status(400).json({
        message: "Enter valid student details and percentage (0-100)."
      });
    }

    await Progress.create({
      studentName,
      courseName,
      completionPercentage: percentage
    });

    res.status(201).json({
      message: "Student progress saved!"
    });
  } catch (error) {
    res.status(500).json({ message: "Could not save progress." });
  }
});

// Get all progress entries
app.get("/progress", async (req, res) => {
  try {
    const progress = await Progress.find().sort({ lastUpdated: -1 });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: "Could not load progress." });
  }
});

// 3. Save a note
app.post("/notes", async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Please enter a title and note."
      });
    }

    await Note.create({ title, content });

    res.status(201).json({
      message: "Note saved successfully!"
    });
  } catch (error) {
    res.status(500).json({ message: "Could not save note." });
  }
});

// Get all notes
app.get("/notes", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Could not load notes." });
  }
});

// Connect database and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected!");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.log("Database connection failed:", error.message);
  });
