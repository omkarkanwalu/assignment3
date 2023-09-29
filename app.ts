import express, { Request, Response } from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import * as path from "path";
import jwt from "jsonwebtoken";

import User from "./user.model";

const envPath = path.resolve(__dirname, "config.env");
dotenv.config({ path: envPath });

const sessions: Record<
  string,
  { sessionId: string; email: string; valid: boolean }
> = {};

function createSession(email: string) {
  const sessionId = String(Object.keys(sessions).length + 1);

  const session = { sessionId, email, valid: true };

  sessions[sessionId] = session;

  return session;
}

const app = express();
app.use(express.json());

const databaseUrl = process.env.DATABASE;
const accessTokenSecret =
  process.env.ACCESS_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET;
databaseUrl ? process.env.DATABASE : process.env.DATABASE;

if (databaseUrl !== undefined) {
  mongoose.connect(
    // "mongodb+srv://omkarkanwalu:T04ZgUimXncAtbub@cluster0.oasaetg.mongodb.net/customers",
    databaseUrl,
    {}
  );
} else {
  console.error("Database URL is undefined");
}

app.get("/hi", async (req, res) => {
  res.status(200).json({ success: "qwertyui" });
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }
  const user = new User({ name, email, password });
  await user.save();
  const token = await user.generateAuthToken();

  res.status(201).json({ token });
});

// login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !user.validatePassword(password)) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const accessToken = await user.generateAuthToken();
  const refreshToken = await user.generateRefreshToken();
  res.status(200).json({ accessToken, refreshToken });
});

app.delete("/delete-user/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
