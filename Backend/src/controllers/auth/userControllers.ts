import { Request, Response } from "express";
import User from "../../database/models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<void> {
    // Normalize and destructure
    const rawUsername = req.body.username;
    const rawEmail = req.body.email;
    const rawPassword = req.body.password;
    const rawRole = req.body.role;

    const username = typeof rawUsername === "string" ? rawUsername.trim() : "";
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
    const password = typeof rawPassword === "string" ? rawPassword : "";
    const role = typeof rawRole === "string" ? rawRole : undefined;

    // Missing fields check
    const missingFields: string[] = [];
    if (!username) missingFields.push("username");
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      res.status(400).json({
        message: `Missing required field(s): ${missingFields.join(", ")}`,
      });
      return;
    }

    // Email validation (only allow Gmail)
    const gmailRegex = /^[\w.+-]+@gmail\.com$/i;
    if (!gmailRegex.test(email)) {
      res.status(400).json({
        message: "Only Gmail addresses are allowed (e.g. user@gmail.com)",
      });
      return;
    }

    // Optional: password strength check (simple example)
    if (password.length < 6) {
      res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Attempt to create user (unique constraint might still occur)
    await User.create({
      username,
      email,
      password: hashedPassword,
      role: role
    });

    res.status(201).json({ message: "User registered successfully" });
  }

  public static async loginUser(req: Request, res: Response): Promise<void> {
    const rawEmail = req.body.email;
    const rawPassword = req.body.password;

    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
    const password = typeof rawPassword === "string" ? rawPassword : "";

    // Missing fields check
    const missingFields: string[] = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      res.status(400).json({
        message: `Missing required field(s): ${missingFields.join(", ")}`,
      });
      return;
    }

    // Find user by email
    const [user] = await User.findAll({ where: { email } });
    if (!user) {res.status(401).json({ message: "Invalid email" });
      return;
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "30D" }
    );
    res.status(200).json({ 
      message: "Logged in successful",
      data: token 
    });
  }
}

export default AuthController;