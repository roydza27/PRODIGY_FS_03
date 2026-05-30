import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./auth.model";
import type { RegisterInput } from "./auth.validation";
import axios from "axios";
import crypto from "crypto";
import nodemailer from "nodemailer";

type LoginInput = {
  email: string;
  password: string;
};

export async function registerUser(input: RegisterInput) {
  const { name, email, password } = input;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return safeUser;
}

export async function loginUser(input: LoginInput) {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  const { email, password } = input;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const safeUser = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return { user: safeUser, token };
}

export async function loginWithGoogle(accessToken: string) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  try {
    // 1. Detect token type and determine the correct Google validation endpoint
    // Modern frontend SDKs often pass an ID Token (JWT) instead of an Access Token
    const isIdToken = accessToken.startsWith("eyJ");
    const googleUrl = isIdToken
      ? `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`
      : `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`;

    const googleUserResponse = await axios.get(googleUrl);
    const { sub: googleId, name, email } = googleUserResponse.data;

    if (!email) {
      throw new Error("Google account does not provide an email address");
    }

    // 2. Locate account via googleId hook first, falling back to basic email lookup
    let user = await User.findOne({ 
      $or: [{ googleId }, { email: email.toLowerCase() }] 
    });

    if (user) {
      // If user signed up locally first, link their Google profile details safely
      if (user.authProvider === "local") {
        user.googleId = googleId;
        user.authProvider = "google";
        await user.save();
      }
    } else {
      // 3. Just-In-Time Provisioning: Create account record on-the-fly for clean onboarding
      user = await User.create({
        name,
        email: email.toLowerCase(),
        authProvider: "google",
        googleId,
        role: "user",
      });
    }

    // 4. Issue standard platform authorization JWT session signature tokens
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return { user: safeUser, token };
  } catch (error: any) {
    // Dig out the explicit reason Google rejected the handshake if an Axios error occurs
    const googleErrorReason = error.response?.data?.error_description || error.response?.data?.error || error.message;
    throw new Error(`Google identity authentication processing failure: ${googleErrorReason}`);
  }
}

export async function requestPasswordReset(email: string) {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  
  if (!user) {
    throw new Error("If an account exists with that email, a reset link has been sent.");
  }

  const rawResetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawResetToken).digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 Hour window
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password?token=${rawResetToken}`;

  // 2. Configure the secure SMTP mail transporter connection pipeline
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for port 465, false for other ports like 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // 3. Define the premium dark visual HTML email layout framework envelope
  const mailOptions = {
    from: `"Zynta Support" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: "Reset Your Zynta Account Password",
    html: `
      <div style="font-family: sans-serif; background-color: #0c0c0e; color: #ffffff; padding: 40px; text-align: center; max-width: 500px; margin: 0 auto; border-radius: 24px; border: 1px solid #222;">
        <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 16px;">Password Reset Request</h1>
        <p style="color: #a1a1aa; font-size: 14px; line-height: 1.6; margin-bottom: 32px;">
          Hey ${user.name}, we received a request to reset your password. Click the secure layout link below to choose a new one. This link expires in 61 minutes.
        </p>
        <a href="${resetUrl}" style="background-color: #DB4444; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 12px; display: inline-block; margin-bottom: 32px; transition: background 0.2s;">
          Reset My Password
        </a>
        <p style="color: #52525b; font-size: 11px;">
          If you didn't request this change, you can safely ignore this automated message envelope.
        </p>
      </div>
    `,
  };

  // 4. Send the email over the network stream natively
  await transporter.sendMail(mailOptions);

  return { message: "Recovery link dispatched successfully" };
}

export async function executePasswordReset(password: string, rawToken: string) {
  // 1. Hash the incoming token from the URL to match against database records
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // 2. Find user where token matches AND expiration date is in the future ($gt: greater than now)
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error("Password reset token is invalid or has expired.");
  }

  // 3. Hash the new password before committing it to storage
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Update password and clear out token fields so they can't be reused
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  
  // Force authProvider to local if they are setting a password
  if (user.authProvider === "google") {
    user.authProvider = "local";
  }

  await user.save();
  return { message: "Password updated successfully" };
}