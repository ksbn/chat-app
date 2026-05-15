import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let messages = [];

// GET all messages
app.get("/messages", (req, res) => {
  res.json(messages);
});

// POST a new message
app.post("/messages", (req, res) => {
  const { text, username } = req.body;

  if (!text || !text.trim()) {
    res.status(400).send("Message text cannot be empty.");
    return;
  }

  if (!username || !username.trim()) {
    res.status(400).send("Username cannot be empty.");
    return;
  }

  const message = {
    id: Date.now(),
    text: text.trim(),
    username: username.trim(),
    timestamp: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
  };

  messages.push(message);
  res.status(201).json(message);
});

// POST like a message
app.post("/messages/:id/like", (req, res) => {
  const message = messages.find(m => m.id === parseInt(req.params.id));
  if (!message) {
    res.status(404).send("Message not found.");
    return;
  }
  message.likes++;
  res.json(message);
});

// POST dislike a message
app.post("/messages/:id/dislike", (req, res) => {
  const message = messages.find(m => m.id === parseInt(req.params.id));
  if (!message) {
    res.status(404).send("Message not found.");
    return;
  }
  message.dislikes++;
  res.json(message);
});

app.listen(port, () => {
  console.log(`Chat server listening on port ${port}`);
});