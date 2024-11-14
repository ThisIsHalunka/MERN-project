// back-end/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/tododb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Todo Model
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema);

// Routes
app.get("/api/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/api/todos", async (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
  });
  const savedTodo = await newTodo.save();
  res.json(savedTodo);
});

app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { text, completed },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: "Failed to update the todo item" });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  await Todo.findByIdAndDelete(id);
  res.json({ message: "Todo deleted" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
