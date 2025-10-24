// controllers/authController.ts
import { Request, Response } from "express";
import User from "../../database/models/userModel";
import bcrypt from "bcrypt";
import { UniqueConstraintError } from "sequelize";
import { checkRequiredFields } from "../../utils/validateFields";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseHelper";

class AuthController {
  public static async registerUser(req: Request, res: Response): Promise<Response | void> {
    // Check required fields 
    if (!checkRequiredFields(req.body, ["username", "email", "password"], res)) {
      return;
    }

    const { username, email, password } = req.body;

    // Username validation
    if (username.length < 3 || username.length > 30) {
      return sendErrorResponse(res, "Username must be between 3 and 30 characters long", 400);
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return sendErrorResponse(res, "Username can only contain letters, numbers, and underscores", 400);
    }

    // Email validation (Gmail only)
    const gmailRegex = /^[\w.+-]+@gmail\.com$/i;
    if (!gmailRegex.test(email)) {
      return sendErrorResponse(res, "Only Gmail addresses are allowed (e.g. user@gmail.com)", 400);
    }

    // Password validation
    if (password.length < 6) {
      return sendErrorResponse(res, "Password must be at least 6 characters long", 400);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendErrorResponse(res, "User already exists", 409);
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user (handle unique constraint race condition)
    try {
      await User.create({ username, email, password: hashedPassword });
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        return sendErrorResponse(res, "User already exists", 409);
      }
      throw err;
    }

    // Send success response
    return sendSuccessResponse(res, "User registered successfully", { username, email }, 201);
  }
}

export default AuthController;
