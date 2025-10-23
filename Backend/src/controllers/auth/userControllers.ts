import express, { type Request, type Response } from "express";
import User from "../../database/models/userModel";

class AuthController {
  // public and static is use to define a method that can be called
  // without creating an instance of the class
  public static async registerUser(req: Request, res: Response): Promise<void> {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
          message: "All fields are required: username, email, password",
        });
      return;
    }

    await User.create({ 
        username, 
        email, 
        password 
    });
    res.status(201).json({ 
        message: "User registered successfully"
    });
  }
}

export default AuthController;
