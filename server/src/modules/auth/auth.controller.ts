import { Request, Response } from "express";
import {
  loginUser,
  registerUser,
  loginWithGoogle,
  requestPasswordReset,
  executePasswordReset
} from "./auth.service";
import {
  validateRegisterInput,
} from "./auth.validation";


export async function register(req: Request, res: Response) {
  try {
    const error = validateRegisterInput(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const user = await registerUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginUser({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    });
  }
}

export async function googleLogin(req: Request, res: Response) {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Google access token parameter is required",
      });
    }

    const result = await loginWithGoogle(token);

    return res.status(200).json({
      success: true,
      message: "Google identity mapping completed successfully",
      ...result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email parameter is required" });
    }

    await requestPasswordReset(email);

    return res.status(200).json({
      success: true,
      message: "If an account exists with that email, a recovery link has been logged/sent.",
    });
  } catch (error) {
    // Always return success status here even if user wasn't found to prevent email enumeration attacks
    return res.status(200).json({
      success: true,
      message: "If an account exists with that email, a recovery link has been logged/sent.",
    });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { password, token } = req.body;
    if (!password || !token) {
      return res.status(400).json({ success: false, message: "Password and token are required" });
    }

    const result = await executePasswordReset(password, token);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Reset process failed",
    });
  }
}