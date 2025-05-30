import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }

    const exitingUser = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (exitingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });

    // if user is not created
    if(!user){
      return res.status(500).json({
        message: "Error while creating user",
        success: false,
      });
    }
  const token = crypto.randomBytes(32).toString("hex");
    await db.user.update({
      where: { id: user.id },
      data: { verificationToken: token },
    });


   const transporter = nodemailer.createTransport({
      // service: "gmail",
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAILTRAP_SENDER_EMAIL,
      to: user.email,
      subject: "Verify your account",
      text: `Please click on the following link:
            ${process.env.BASE_URL}/api/v1/auth/verify/${token}`, // plain text body
      html: `
                <h1>Click here to verify your account</h1>

                <a href=${process.env.BASE_URL}/api/v1/auth/verify/${token} >${process.env.BASE_URL}/api/v1/auth/verify/${token}</a>
            `,
    };

    const isMailSend = await transporter.sendMail(mailOptions);

    if (!isMailSend) {
      return res.status(201).json({
        success: false,
        message: "Error while sending email",
      });
    }

    // final response
    return res.status(201).json({
      success: true,
      message: "User register successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });

    
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: "Error creating user",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if(!email || !password){
    return res.status(400).json({
      message:"All fileds are required",
      success: false
    })
  }
  
  try {
    const user = await db.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    // Check if user is verified
    // If user is not verified, return an error
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email before logging in",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({
      message: "Error logging in user",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "User logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({
      message: "Error logging out user",
      success: false,
    });
  }
};

export const check = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      message: "User authenticated successfully",
      success: true,
      user
    });
  } catch (error) {
    console.error("Error while checking user.", error);
    return res.status(500).json({
      message: "Error while checking user.",
      success: false,
    });
  }
};

export const verify = async (req, res) => {
  const { token } = req.params;
  console.log("Token received for verification:", token);
  if (!token) {
    return res.status(400).json({
      success: false,
      messag: "Invalid token",
    });
  }

  try {
    const user = await db.user.findFirst({
      where: {
        verificationToken: token,
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        messag: "Invalid token",
      });
    }
    // Update user to set verified to true and clear verificationToken
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    return res.status(200).json({
        success: true,
        message: "User verified successfully"
    })
  } catch (error) {
    console.log("Error while verifying user", error)
      return res.status(200).json({
        success: true,
        message: "Error while verifying user"
    })
  }
};

export const getAllUser = async (req,res)=>{
  try {
    const allUsers = await db.user.findMany();
    
    if(!allUsers){
      return res.status(404).json({
        success: false,
        message: "No user found"
      })
    }

    return res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      users: allUsers
    })
  } catch (error) {

    console.log("Error while fetching all users from db", error)
    return res.status(500).json({
      success: false,
      message: "Error while fetching all users from db"
    })
  }
}